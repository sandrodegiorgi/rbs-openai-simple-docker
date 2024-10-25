from flask import Flask, request, Response, jsonify, send_from_directory
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS
import time

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

def load_system_message(assistant_type):
    file_path = f"system_messages/{assistant_type}.txt"
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return "You are a helpful assistant."

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Serve the React app's index.html for all unmatched routes
        return send_from_directory(app.static_folder, "index.html")

@app.route('/api/chat', methods=['GET'])
def chat():
    prompt = request.args.get('prompt')
    assistant_type = request.args.get('assistant_type', 'friendly')
    # print("Assistant Type: ", assistant_type)
    
    system_message_content = load_system_message(assistant_type)
    system_message = {"role": "system", "content": system_message_content}
    
    # print("system_message: ", system_message)   
    
    def generate():
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[system_message, {"role": "user", "content": prompt}],
                stream=True  # Enable streaming responses
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
def image():
    data = request.get_json()
    prompt = data.get('prompt')

    try:
        response = client.images.generate(prompt=prompt, n=1, size="1024x1024")
        image_url = response.data[0].url
        return jsonify({'image_url': image_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
