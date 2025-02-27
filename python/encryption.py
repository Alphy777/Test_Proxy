# encryption.py
def encrypt_message(message, key):
    encrypted_message = ""
    for char in message:
        if char.isalpha():
            shift = key if char.islower() else key
            new_char = chr((ord(char) + shift - 97) % 26 + 97) if char.islower() else chr((ord(char) + shift - 65) % 26 + 65)
            encrypted_message += new_char
        else:
            encrypted_message += char
    return encrypted_message

def decrypt_message(encrypted_message, key):
    return encrypt_message(encrypted_message, -key)  # Decryption is just reversing the shift
