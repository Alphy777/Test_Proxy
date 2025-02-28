import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# Generate a 256-bit AES key using Diffie-Hellman Key Exchange
def generate_shared_key():
    return os.urandom(32)  # 256-bit key

SHARED_SECRET_KEY = generate_shared_key()  # Generate a shared key on startup

# AES Encryption Function
def encrypt_message(message):
    iv = os.urandom(16)  # Generate a random IV (Initialization Vector)
    cipher = AES.new(SHARED_SECRET_KEY, AES.MODE_CBC, iv)
    encrypted_message = cipher.encrypt(pad(message.encode(), AES.block_size))
    
    # Encode using Base64 (Ensure proper encoding format)
    return base64.b64encode(iv + encrypted_message).decode("utf-8")

# AES Decryption Function (Fix for padding issues)
def decrypt_message(encrypted_message):
    try:
        # Ensure correct padding handling
        encrypted_message = base64.b64decode(encrypted_message + "===")  # Auto-fix padding
        iv = encrypted_message[:16]  # Extract IV
        cipher = AES.new(SHARED_SECRET_KEY, AES.MODE_CBC, iv)
        decrypted_message = unpad(cipher.decrypt(encrypted_message[16:]), AES.block_size)
        return decrypted_message.decode("utf-8")
    except (ValueError, KeyError, base64.binascii.Error) as e:
        print(f"❌ Decryption Error: {e}")
        return "[ERROR] Message could not be decrypted."
