from flask import Flask
from flask import request, Response, jsonify, send_from_directory, abort, session, current_app
# from flask_sqlalchemy import SQLAlchemy

from models import db, Interaction

from openai import OpenAI
import os
import requests
import uuid
from dotenv import load_dotenv
from flask_cors import CORS
from functools import wraps

from lingua import Language, LanguageDetectorBuilder

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PASSWORD = os.getenv("PASSWORD")
PASSWORD_CHAT = os.getenv("PASSWORD_CHAT")
PASSWORD_IMAGE = os.getenv("PASSWORD_IMAGE")
PASSWORD_TRANSLATE = os.getenv("PASSWORD_TRANSLATE")
FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "fallback-dev-secret")

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

assistant_model = "gpt-4o"
chat_model = "gpt-4o"
translate_model = "gpt-3.5-turbo"
image_model = "dall-e-3"

chat_interaction_type = "general_chat"
image_interaction_type = "image_gen"
translation_interaction_type = "translation"

assistants = {}

# app = Flask(__name__, static_folder="static")
app = Flask(__name__, static_folder=".")

app.secret_key = FLASK_SECRET_KEY

# app.config['SQLALCHEMY_DATABASE_URI'] = (
#     f"mariadb+mariadbconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
#     f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
# )
# print (DB_URI)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password@0.0.0.0:3306/rbs-ai'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

db.init_app(app)

CORS(app, resources={r"/*": {"origins": "*"}})

detector = LanguageDetectorBuilder.from_all_languages().build()

def create_tables():
    with app.app_context():
        db.create_all()
        print("Checked and ensured all models/tables exist in the database.", flush=True)

def get_or_create_user_id():
    if "user_id" not in session:
        session["user_id"] = str(uuid.uuid4())
    return session["user_id"]

# def check_password(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         password = request.args.get('password') or request.get_json().get('password')
#         # print(password)
#         if password != PASSWORD:
#             return jsonify({"error": "Unauthorized"}), 401
#         return f(*args, **kwargs)
#     return decorated_function

def check_password(required_password=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            password = request.args.get('password') or request.get_json().get('password')
            if required_password is None:
                if password != PASSWORD:
                    return jsonify({"error": "Unauthorized"}), 401
            else:
                if password != required_password:
                    return jsonify({"error": "Unauthorized"}), 401
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def check_password_ass():
    def decorator(f):
        @wraps(f)
        def decorated_function(virtual_url, *args, **kwargs):
            password = request.args.get('password') or request.get_json().get('password')
            assistant = assistants.get(virtual_url)

            if not assistant:
                return jsonify({"error": "Assistant not found"}), 404

            if password != assistant['password']:
                return jsonify({"error": "Unauthorized"}), 401

            return f(virtual_url, *args, **kwargs)
        return decorated_function
    return decorator

def load_assistants():
    assistants_dir = 'assistants'
    assistants.clear()
    
    for filename in os.listdir(assistants_dir):
        if not filename.startswith('ass_'):
            continue
        
        filepath = os.path.join(assistants_dir, filename)

        if os.path.isfile(filepath):
            with open(filepath, 'r') as file:
                # print(f"Loading assistant: {filepath}")
                lines = file.readlines()
                if len(lines) < 4:
                    continue
                
                assistant_name = lines[0].strip()
                prompt = lines[1].strip()
                virtual_url = lines[2].strip()
                assistant_password = lines[3].strip()
                system_message = "".join(lines[4:]).strip()

                assistants[virtual_url] = {
                    'name': assistant_name,
                    'prompt': prompt,
                    'system_message': system_message,
                    'password': assistant_password
                }

load_assistants()

@app.route('/api/assistants/reload', methods=['POST'])
@check_password()
def reload_assistants():
    load_assistants()
    return jsonify({"message": "Assistants reloaded successfully"}), 200

@app.route('/api/assistants/<virtual_url>', methods=['GET'])
def get_assistant(virtual_url):
    if virtual_url not in assistants:
        abort(404)

    assistant_data = {
        'name': assistants[virtual_url]['name'],
        'prompt': assistants[virtual_url]['prompt']
    }

    return jsonify(assistant_data)

@app.route('/api/assistants', methods=['GET'])
def get_all_assistants():
    all_assistants = [
        {
            'name': assistants[virtual_url]['name'],
            'prompt': assistants[virtual_url]['prompt'],
            'url': f"{virtual_url}"
        }
        for virtual_url in assistants
    ]
    
    sorted_assistants = sorted(all_assistants, key=lambda x: x['name'])
    
    return jsonify(sorted_assistants)

def load_system_message(assistant_type):
    file_path = f"system_messages/{assistant_type}.txt"
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return "You are a helpful assistant."

@app.route('/api/interactions', methods=['GET'])
def get_all_interactions():
    user_id = request.args.get('user_id')
    interaction_type = request.args.get('interaction_type')

    if not user_id or not interaction_type:
        return jsonify({"error": "Both 'user_id' and 'interaction_type' are required."}), 400

    conversation_history = Interaction.query.filter_by(
        user_id=user_id,
        interaction_type=interaction_type
    ).order_by(Interaction.created_at.asc()).all()

    interaction_list = [
        {
            'id': interaction.id,
            'user_id': interaction.user_id,
            'interaction_type': interaction.interaction_type,
            'role': interaction.role,
            'content': interaction.content,
            'model': interaction.model,
            'created_at': interaction.created_at.isoformat()
        }
        for interaction in conversation_history
    ]

    return jsonify(interaction_list)

@app.route('/app.py') # XXX: blocking models.py as well?
def block_app_py():
    abort(404)

@app.route('/system_messages/<path:path>')
def block_system_messages(path):
    abort(404)

@app.route('/assistants/<path:path>')
def block_assistants(path):
    abort(404)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        # return send_from_directory(app.static_folder, path)
        return send_from_directory(".", path)
    else:
        # return send_from_directory(app.static_folder, "index.html")
        return send_from_directory(".", "index.html")

@app.before_request
def log_request():
    print(f"Received {request.method} request to {request.path}")

@app.route('/api/assistants/<virtual_url>/interact', methods=['GET'])
@check_password_ass()
def interact_with_assistant(virtual_url):
    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 204

    # Get the prompt and user ID
    prompt = request.args.get('prompt')
    user_id = request.headers.get("X-User-ID") or request.args.get("user_id")
    system_message = assistants[virtual_url].get('system_message', "This is the default system message.")
    is_streaming = request.args.get('stream', 'false').lower() == 'true'
    
    app = current_app._get_current_object()

    if not is_streaming:
        print("Handling initial non-streaming request")
        with app.app_context():
            conversation_history = Interaction.query.filter_by(
                user_id=user_id,
                interaction_type=virtual_url
            ).order_by(Interaction.created_at).all()

            if not conversation_history:
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=virtual_url,
                        role="system",
                        content=system_message,
                        model=assistant_model,
                    )
                )
                db.session.commit()

        return jsonify({"status": "ok", "message": "Initial request received"})

    # Streaming request handling
    def generate():
        with app.app_context():
            try:
                conversation_history = Interaction.query.filter_by(
                    user_id=user_id,
                    interaction_type=virtual_url
                ).order_by(Interaction.created_at).all()

                messages = [{"role": interaction.role, "content": interaction.content} 
                            for interaction in conversation_history]

                # Add the system message if this is the first call
                if not messages:
                    messages.append({"role": "system", "content": system_message})
                    db.session.add(
                        Interaction(
                            user_id=user_id,
                            interaction_type=virtual_url,
                            role="system",
                            content=system_message,
                            model=assistant_model,
                        )
                    )

                # Add the user's new message
                messages.append({"role": "user", "content": prompt})
                
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=virtual_url,
                        role="user",
                        content=prompt,
                        model=assistant_model,
                    )
                )
                db.session.commit()

                # Stream the response from OpenAI
                response = client.chat.completions.create(
                    model=assistant_model,
                    messages=messages,
                    stream=True
                )

                assistant_reply = ""

                for chunk in response:
                    if hasattr(chunk.choices[0].delta, "content") and chunk.choices[0].delta.content:
                        chunk_message = chunk.choices[0].delta.content
                        assistant_reply += chunk_message
                        # print(f"[{chunk_message}]")
                        # print(f"Chunk content: [{repr(chunk_message)}]")
                        chunk_message = chunk_message.replace("\n", "[NEWLINE]")
                        yield f"data: {chunk_message}\n\n"
                yield f"data: [DONE]\n\n"

                # Save the assistant's response to the database
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=virtual_url,
                        role="assistant",
                        content=assistant_reply,
                        model=assistant_model,
                    )
                )
                db.session.commit()

            except Exception as e:
                yield f"data: [ERROR] {str(e)}\n\n"

    print("Handling streaming request")
    return Response(
        generate(),
        content_type="text/event-stream",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
        }
    )

@app.route('/api/chat', methods=['GET'])
@check_password(PASSWORD_CHAT)
def chat():
    prompt = request.args.get('prompt')
    user_id = request.headers.get("X-User-ID") or request.args.get("user_id")
    system_message = "You are a helpful assistant." # XXX
    is_streaming = request.args.get('stream', 'false').lower() == 'true'
    local_model = chat_model
    local_interaction_type = chat_interaction_type

    app = current_app._get_current_object()

    if not is_streaming:
        # print("Handling initial non-streaming request (CHAT)")
        with app.app_context():
            conversation_history = Interaction.query.filter_by(
                user_id=user_id,
                interaction_type=local_interaction_type
            ).order_by(Interaction.created_at).all()

            if not conversation_history:
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=local_interaction_type,
                        role="system",
                        content=system_message,
                        model=local_model,
                    )
                )
                db.session.commit()

        return jsonify({"status": "ok", "message": "Initial request received"})
    
    def generate():
        with app.app_context():
            try:
                conversation_history = Interaction.query.filter_by(
                    user_id=user_id,
                    interaction_type=local_interaction_type
                ).order_by(Interaction.created_at).all()
                
                messages = [{"role": interaction.role, "content": interaction.content} 
                            for interaction in conversation_history]    
                
                if not messages:
                    messages.append({"role": "system", "content": system_message})
                    db.session.add(
                         Interaction(
                            user_id=user_id,
                            interaction_type=local_interaction_type,
                            role="system",
                            content=system_message,
                            model=local_model,
                        )
                    )
                    
                messages.append({"role": "user", "content": prompt})
            
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=local_interaction_type,
                        role="user",
                        content=prompt,
                        model=local_model,
                    )
                )
                db.session.commit()
                
                response = client.chat.completions.create(
                    model=local_model,
                    messages=messages,
                    stream=True
                )
            
                assistant_reply = ""
            
            
                for chunk in response:
                    if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
                        chunk_message = chunk.choices[0].delta.content
                        chunk_message = chunk_message.replace("\n", "[NEWLINE]")
                        assistant_reply += chunk_message
                        yield f"data: {chunk_message}\n\n"
                yield f"data: [DONE]\n\n"
            
                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=local_interaction_type,
                        role="assistant",
                        content=assistant_reply,
                        model=local_model,
                    )
                )
                db.session.commit()
            
            except Exception as e:
                print(f"Error: {str(e)}")
                yield f"data: [ERROR] {str(e)}\n\n"

    # print("Handling streaming request (CHAT)")
    return Response(
        generate(),
        content_type="text/event-stream",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
        }
    )

@app.route('/api/translate', methods=['POST'])
@check_password(PASSWORD_TRANSLATE)
def translate():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    prompt = data.get('prompt')
    src_language = data.get('srcL')
    target_language = data.get('tarL') 
    system_message = "You are a highly skilled translation assistant."
    detected_language = None
    
    local_model = translate_model
    local_interaction_type = translation_interaction_type
    user_id = request.headers.get("X-User-ID")
    
    # make this more stream, extract and refac maybe... XXX
    if not user_id:
        return jsonify({"error": "Sorry, there is data missing in your request."}), 400
    
    if src_language == "auto-detect":
        detected_language = detector.detect_language_of(prompt)
        if detected_language is None:
            return jsonify({"error": "Sorry, source language not detectable."}), 400
        else:
            src_language = detected_language.name

    app = current_app._get_current_object()
    
    with app.app_context():
        conversation_history = Interaction.query.filter_by(
            user_id=user_id,
            interaction_type=local_interaction_type
        ).order_by(Interaction.created_at).all()
        
        if not conversation_history:
            db.session.add(
                Interaction(
                    user_id=user_id,
                    interaction_type=local_interaction_type,
                    role="system",
                    content=system_message,
                    model=local_model,
                )
            )
            db.session.commit()
                
        try:
            translation_prompt = f"Please translate the entire following text from language {src_language} to language {target_language}:\n\n{prompt}\n\nTranslation:\n\n"
            # conversation_history = Interaction.query.filter_by(
            #     user_id=user_id,
            #     interaction_type=local_interaction_type
            # ).order_by(Interaction.created_at).all()
            db.session.add(
                Interaction(
                    user_id=user_id,
                    interaction_type=local_interaction_type,
                    role="user",
                    content=translation_prompt,
                    model=local_model,
                )
            )
            db.session.commit()
              
            response = client.chat.completions.create(
                model=local_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": translation_prompt}
                ],
                stream=False,
                max_tokens=200,
                temperature=0.5
            )
            translated_text = response.choices[0].message.content.strip()

            db.session.add(
                Interaction(
                    user_id=user_id,
                    interaction_type=local_interaction_type,
                    role="assistant",
                    content=translated_text,
                    model=local_model,
                )
            )
            db.session.commit()

            return jsonify({
                'source_language': src_language,
                'target_language': target_language,
                'original_text': prompt,
                'translated_text': translated_text
                }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/api/image', methods=['POST'])
@check_password(PASSWORD_IMAGE)
def image():
    data = request.get_json()
    prompt = data.get('prompt')
    system_message = "You are a super high class image generating machhine! Only the best output is expected."
    local_model = image_model
    local_interaction_type = image_interaction_type
    user_id = request.headers.get("X-User-ID")
    
    if not user_id:
        return jsonify({"error": "Sorry, there is data missing in your request."}), 400

    # print(f"Data: {data}")
    # for header, value in request.headers.items():
    #   print(f"{header}: {value}")
    # return jsonify({'error': 'Not implemented yet'}), 501
    
    app = current_app._get_current_object()
    
    with app.app_context():
        conversation_history = Interaction.query.filter_by(
            user_id=user_id,
            interaction_type=local_interaction_type
        ).order_by(Interaction.created_at).all()

        if not conversation_history:
            db.session.add(
                Interaction(
                    user_id=user_id,
                    interaction_type=local_interaction_type,
                    role="system",
                    content=system_message,
                    model=local_model,
                )
            )
            db.session.commit()
        
        try:
            conversation_history = Interaction.query.filter_by(
                user_id=user_id,
                interaction_type=local_interaction_type
            ).order_by(Interaction.created_at).all()
            
            messages = [{"role": interaction.role, "content": interaction.content} 
                        for interaction in conversation_history]    

            messages.append({"role": "user", "content": prompt})
            
            db.session.add(
                Interaction(
                    user_id=user_id,
                    interaction_type=local_interaction_type,
                    role="user",
                    content=prompt,
                    model=local_model,
                )
            )
            db.session.commit()
            
            response = client.images.generate(
                model=local_model,
                prompt=prompt,
                n=1,
                # size="1024x1024",
                quality="hd",   # "standard" or "hd"
                style="vivid"       #  "vivid" or "natural"
            )
            image_url = response.data[0].url

            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                filename = f"{uuid.uuid4()}.png"
                image_path = os.path.join("images", filename)
                image_size = len(image_response.content)
                print(f"Saving image to: {image_path}")
                with open(image_path, "wb") as f:
                    f.write(image_response.content)

                db.session.add(
                    Interaction(
                        user_id=user_id,
                        interaction_type=local_interaction_type,
                        role="assistant",
                        content=f"Filename: {filename}, size: {image_size} bytes",
                        model=local_model,
                    )
                )
                db.session.commit()

               # return jsonify({'image_url': f"/images/{filename}"})
                return jsonify({'image_url': f"images/{filename}"})
            else:
                return jsonify({'error': 'Failed to download the image.'}), 500

        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # print("hello from starting flask...", flush=True)
    create_tables()
    app.run(host='0.0.0.0', port=5000)

# pip freeze > requirements.txt
# pip list --format=freeze --not-required > requirements.txt
# pip list --format=freeze > requirements.txt

# FLASK_APP=app.py flask run