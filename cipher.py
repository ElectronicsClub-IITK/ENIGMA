from math import gcd

# --- Modular inverse finder ---
def mod_inverse(a, m):
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    raise ValueError(f"No modular inverse for a = {a} under mod {m}")

# --- Encryption (Easy Way using alphabet) ---
def affine_encrypt(text, a, b):
    if gcd(a, 26) != 1:
        raise ValueError("Key 'a' must be coprime with 26")

    result = ''
    for char in text.upper():
        if char.isalpha():
            x = ord(char) - ord('A')
            enc_char = chr(((a * x + b) % 26) + ord('A'))
            result += enc_char
        else:
            result += char
    return result

# --- Decryption ---
def affine_decrypt(cipher, a, b):
    if gcd(a, 26) != 1:
        raise ValueError("Key 'a' must be coprime with 26")

    a_inv = mod_inverse(a, 26)
    result = ''
    for char in cipher.upper():
        if char.isalpha():
            y = ord(char) - ord('A')
            dec_char = chr(((a_inv * (y - b)) % 26) + ord('A'))
            result += dec_char
        else:
            result += char
    return result

# === MAIN SECTION ===
if __name__ == "__main__":
    plaintext = input("Enter your message: ")
    a = int(input("Enter key 'a' (must be coprime with 26): "))
    b = int(input("Enter key 'b': "))

    try:
        encrypted = affine_encrypt(plaintext, a, b)
        print("\nEncrypted text:", encrypted)

        decrypted = affine_decrypt(encrypted, a, b)
        print("Decrypted text:", decrypted)

    except ValueError as e:
        print("Error:", e)
