from math import gcd

def mod_inverse(a, m):
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    raise ValueError(f"No modular inverse for a = {a} under mod {m}")

def affine_encrypt_ascii(text, a, b):
    if gcd(a, 26) != 1:
        raise ValueError("a must be coprime with 26")
    
    result = ''
    for char in text.upper():
        if 'A' <= char <= 'Z':
            x = ord(char) - ord('A')
            enc_char = chr(((a * x + b) % 26) + ord('A'))
            result += enc_char
        else:
            result += char
    return result

def affine_decrypt_ascii(cipher, a, b):
    if gcd(a, 26) != 1:
        raise ValueError("a must be coprime with 26")

    a_inv = mod_inverse(a, 26)
    result = ''
    for char in cipher.upper():
        if 'A' <= char <= 'Z':
            y = ord(char) - ord('A')
            dec_char = chr((a_inv * (y - b)) % 26 + ord('A'))
            result += dec_char
        else:
            result += char
    return result

# 🔽 Input/output section (as you asked)
text = input("Enter message: ")
a = int(input("Enter key 'a' (must be coprime with 26): "))
b = int(input("Enter key 'b': "))

try:
    encrypted = affine_encrypt_ascii(text, a, b)
    print("Encrypted message:", encrypted)

    decrypted = affine_decrypt_ascii(encrypted, a, b)
    print("Decrypted message:", decrypted)

except ValueError as e:
    print("Error:", e)
