from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from encryption import encrypt_message, decrypt_message  # Use new AES encryption

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "users.db"))

def setup_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            encrypted_message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

setup_db()

# Send Message API
@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    sender = data.get("sender")
    receiver = data.get("receiver")
    message = data.get("message")

    if not sender or not receiver or not message:
        return jsonify({"error": "Missing data"}), 400

    encrypted_message = encrypt_message(message)  # Encrypt using AES

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO messages (sender, receiver, encrypted_message) VALUES (?, ?, ?)",
                   (sender, receiver, encrypted_message))
    conn.commit()
    conn.close()

    return jsonify({"status": "Message sent successfully"})

# Fetch Messages API
@app.route('/get-messages/<username>', methods=['GET'])
def get_messages(username):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT sender, receiver, encrypted_message, timestamp FROM messages WHERE sender=? OR receiver=? ORDER BY timestamp", (username, username))
    messages = cursor.fetchall()
    conn.close()

    chat_history = [{
        "sender": msg[0],
        "receiver": msg[1],
        "message": decrypt_message(msg[2]),  # Decrypt using AES
        "timestamp": msg[3]
    } for msg in messages]

    return jsonify(chat_history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
