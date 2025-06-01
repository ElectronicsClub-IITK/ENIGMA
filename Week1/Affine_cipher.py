def affine_encrypt(plaintext, a, b):
    ciphertext = ""
    for char in plaintext:
        if char.isalpha():
            x = ord(char.lower()) - ord('a')  # Convert to 0–25
            encrypted_char = (a * x + b) % 26
            ciphertext += chr(encrypted_char + ord('a'))
        else:
            ciphertext += char
    return ciphertext

def affine_decrypt(ciphertext, a, b):
    try:
        a_inv = pow(a, -1, 26)  # Modular inverse of a mod 26
    except ValueError:
        raise ValueError(f"Modular inverse does not exist for a = {a} under mod 26. Choose a coprime to 26.")

    plaintext = ""
    for char in ciphertext:
        if char.isalpha():
            y = ord(char.lower()) - ord('a')
            decrypted_char = (a_inv * (y - b)) % 26
            plaintext += chr(decrypted_char + ord('a'))
        else:
            plaintext += char
    return plaintext

if __name__ == "__main__":
    plaintext = input("Enter plaintext: ")
    a = int(input("Enter a (must be coprime to 26): "))
    b = int(input("Enter b: "))
    

    # Encryption
    ciphertext = affine_encrypt(plaintext, a, b)
    print(f"Ciphertext: {ciphertext}")

    # Decryption
    decrypted_text = affine_decrypt(ciphertext, a, b)
    print(f"Decrypted text: {decrypted_text}")
