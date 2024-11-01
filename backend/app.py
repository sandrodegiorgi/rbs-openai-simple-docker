from flask import Flask, request, Response, jsonify, send_from_directory, abort
from openai import OpenAI
import os
import requests
import uuid
from dotenv import load_dotenv
from flask_cors import CORS
from functools import wraps

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
PASSWORD = os.getenv("PASSWORD")

assistant_model = "gpt-4o"
chat_model = "gpt-4o"

assistants = {}

# app = Flask(__name__, static_folder="static")
app = Flask(__name__, static_folder=".")

CORS(app, resources={r"/*": {"origins": "*"}})

def check_password(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        password = request.args.get('password') or request.get_json().get('password')
        # print(password)
        if password != PASSWORD:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

def load_assistants():
    assistants_dir = 'assistants'
    assistants.clear()
    
    for filename in os.listdir(assistants_dir):
        filepath = os.path.join(assistants_dir, filename)

        if os.path.isfile(filepath):
            with open(filepath, 'r') as file:
                print(f"Loading assistant: {filepath}")
                lines = file.readlines()
                if len(lines) < 4:
                    continue
                
                assistant_name = lines[0].strip()
                prompt = lines[1].strip()
                virtual_url = lines[2].strip()
                system_message = "".join(lines[3:]).strip()

                assistants[virtual_url] = {
                    'name': assistant_name,
                    'prompt': prompt,
                    'system_message': system_message
                }

load_assistants()

@app.route('/api/assistants/reload', methods=['POST'])
@check_password
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
    return jsonify(all_assistants)

def load_system_message(assistant_type):
    file_path = f"system_messages/{assistant_type}.txt"
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return "You are a helpful assistant."

@app.route('/app.py')
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


@app.route('/api/assistants/<virtual_url>/interact', methods=['GET'])
@check_password
def interact_with_assistant(virtual_url):
    prompt = request.args.get('prompt')
    system_message = {"role": "system", "content": assistants[virtual_url]['system_message']}

    def generate():
        try:
            response = client.chat.completions.create(
                model=assistant_model,
                messages=[system_message, {"role": "user", "content": prompt}],
                stream=True
            )
            for chunk in response:
                if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
                    chunk_message = chunk.choices[0].delta.content    
                    if chunk_message:
                        yield f"data: {chunk_message}\n\n"
        except Exception as e:
            print(f"Error: {str(e)}")
            yield f"data: [ERROR] {str(e)}\n\n"

    return Response(generate(), content_type='text/event-stream')

@app.route('/api/chat', methods=['GET'])
@check_password
def chat():
    prompt = request.args.get('prompt')
    assistant_type = request.args.get('assistant_type', 'friendly')
    
    system_message_content = load_system_message(assistant_type)
    system_message = {"role": "system", "content": system_message_content}

    def generate():
        try:
            response = client.chat.completions.create(
                model=chat_model,
                messages=[system_message, {"role": "user", "content": prompt}],
                stream=True
            )
            for chunk in response:
                if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
                    chunk_message = chunk.choices[0].delta.content    
                    if chunk_message:
                        yield f"data: {chunk_message}\n\n"
        except Exception as e:
            print(f"Error: {str(e)}")
            yield f"data: [ERROR] {str(e)}\n\n"

    return Response(generate(), content_type='text/event-stream')

@app.route('/api/image', methods=['POST'])
@check_password
def image():
    data = request.get_json()
    prompt = data.get('prompt')

    # works fine, think it's v2
    # try:
    #     response = client.images.generate(prompt=prompt, n=1, size="1024x1024")
    #     image_url = response.data[0].url
    #     return jsonify({'image_url': image_url})
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

    # works fine, think it's v3
    # try:
    #     response = client.images.generate(
    #         model="dall-e-3",
    #         prompt=prompt,
    #         n=1,
    #         # size="1024x1024",
    #         quality="hd",   # "standard" or "hd"
    #         style="vivid"       #  "vivid" or "natural"
    #     )
    #     image_url = response.data[0].url
    #     return jsonify({'image_url': image_url})
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

    try:
        response = client.images.generate(
            model="dall-e-3",
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
            with open(image_path, "wb") as f:
                f.write(image_response.content)

            return jsonify({'image_url': f"/images/{filename}"})
        else:
            return jsonify({'error': 'Failed to download the image.'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

# pip freeze > requirements.txt
# pip list --format=freeze --not-required > requirements.txt

# FLASK_APP=app.py flask run