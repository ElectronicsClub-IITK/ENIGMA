import math

def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def mod_inverse(a, m):
    a = a % m
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None  # No inverse exists

def affine_encrypt(text, a, b):
    result = []
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            x = ord(char) - base
            y = (a * x + b) % 26
            result.append(chr(y + base))
        else:
            result.append(char)  # Non-alphabetic characters unchanged
    return ''.join(result)

def affine_decrypt(text, a, b):
    a_inv = mod_inverse(a, 26)
    if a_inv is None:
        raise ValueError("Key 'a' has no modular inverse. Choose a different key.")
    
    result = []
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            y = ord(char) - base
            x = (a_inv * (y - b)) % 26
            result.append(chr(x + base))
        else:
            result.append(char)  # Non-alphabetic characters unchanged
    return ''.join(result)

def main():
    print("Affine Cipher")
    choice = input("1. Encrypt\n2. Decrypt\nEnter choice (1/2): ")
    text = input("Enter text: ")
    a = int(input("Enter key 'a' (must be coprime with 26): "))
    b = int(input("Enter key 'b': "))

    if gcd(a, 26) != 1:
        print("Error: 'a' must be coprime with 26 (valid keys: 1,3,5,7,9,11,15,17,19,21,23,25).")
        return

    if choice == '1':
        ciphertext = affine_encrypt(text, a, b)
        print(f"Encrypted: {ciphertext}")
    elif choice == '2':
        try:
            plaintext = affine_decrypt(text, a, b)
            print(f"Decrypted: {plaintext}")
        except ValueError as e:
            print(e)
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()