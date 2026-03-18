while(True):
    a = int(input("Enter a: (note must be coprime with 26): \n"))
    if (((a%2)==0) or ((a%13)==0) ):
        print("Try Again, a is not coprime with 26:\n")
        continue
    else:
        break
a = a%26
b = int(input("Enter Value for b\n"))
inverse_dict = {1:1,3:9,5:21,7:15,9:3,11:19,15:7,17:23,19:11,21:5,23:17,25:25}
while(True):
    choice = int(input("Enter\n0. To exit\n1. For encoding\n2. For Decoding\n"))
    if (choice==1):
        #code for encoding into (ax+b)mod26
        line = str(input("Enter string to encode:\n")).upper()
        output = ""
        for i in range(len(line)):
            if line[i].isalpha():
                num = ord(line[i]) - ord('A')
                num = (a * num + b) % 26
                output += chr(num + ord('A'))
            else:
                output += line[i]  # Keep non-alphabet characters unchanged
        print("Encoded string:", output)
    if (choice==2):
        #code for decoding algo
            if (choice == 2):
        # code for decoding algo
                line = str(input("Enter string to decode:\n")).upper()
                output = ""
                a_inv = inverse_dict[a]
                for i in range(len(line)):
                    if line[i].isalpha():
                        num = ord(line[i]) - ord('A')
                        num = (a_inv * (num - b)) % 26
                        output += chr(num + ord('A'))
                    else:
                        output += line[i]
                print("Decoded String: " + output)
