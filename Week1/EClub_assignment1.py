
def encrypt_string(a, b, list_encrypt_string):
    encrypted_string = []
    for x in list_encrypt_string:
        en_x = ((ord(x)-65)*a + b)%26
        encrypted_string.append(chr(en_x))
    return encrypted_string

def main():
    a = int(input("Enter value for a: "))
    b = int(input("Enter value for b: "))

    mod_a = a%26
    mod_b = b%26

    string_input = input("Enter the string to be encrypted: ")
    string_input.upper()
    list_encrypt_string = list(string_input)

    list_encrypted_string = encrypt_string(mod_a, mod_b, list_encrypt_string)
    print(str(list_encrypted_string))

main()