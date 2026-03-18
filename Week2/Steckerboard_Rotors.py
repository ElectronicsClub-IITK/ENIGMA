import serial
import time

#arduino = serial.Serial('COM8', 9600, timeout=1 )
#time.sleep(2)


# Constants
ALPHABET_SIZE = 26
NUM_ROTORS = 3

# Rotor configurations (historical Enigma I rotors)
rotors = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",  # Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",  # Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"   # Rotor III
]

# Reflector B
reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"

# Turnover positions
turnovers = [ord('Q') - ord('A'), ord('E') - ord('A'), ord('V') - ord('A')]

# Rotor positions (right, middle, left)
rotor_offsets = [0, 0, 0]

# Plugboard pairings
pairings = [0] * ALPHABET_SIZE

def char_to_index(c):
    return ord(c.upper()) - ord('A')

def index_to_char(i):
    return chr((i % ALPHABET_SIZE) + ord('A'))

def index_inverse(c, rotor):
    target_char = index_to_char(c)
    return rotors[rotor].index(target_char)

def rotor_r_to_l(input_val, rotor):
    idx = (input_val + rotor_offsets[rotor]) % ALPHABET_SIZE
    mapped = ord(rotors[rotor][idx]) - ord('A')
    res = (mapped - rotor_offsets[rotor]) % ALPHABET_SIZE
    return res

def rotor_l_to_r(input_val, rotor):
    idx = (input_val + rotor_offsets[rotor]) % ALPHABET_SIZE
    inverse = index_inverse(idx, rotor)
    res = (inverse - rotor_offsets[rotor]) % ALPHABET_SIZE
    return res

def reflect(input_val):
    return ord(reflector[input_val]) - ord('A')

def initialize_plugboard(pairs_str):
    global pairings
    pairings = [0] * ALPHABET_SIZE
    pairs = pairs_str.strip().split()
    for i in range(0, len(pairs) - 1, 2):
        a = char_to_index(pairs[i])
        b = char_to_index(pairs[i+1])
        pairings[a] = b - a
        pairings[b] = a - b

def plug_swap(input_val):
    return (input_val + pairings[input_val]) % ALPHABET_SIZE

def spin_rotors():
    global rotor_offsets
    step = [False] * NUM_ROTORS

    # Double-stepping mechanism
    if rotor_offsets[1] == turnovers[1]:
        rotor_offsets[2] = (rotor_offsets[2] + 1) % ALPHABET_SIZE
        rotor_offsets[1] = (rotor_offsets[1] + 1) % ALPHABET_SIZE
        step[2] = True
        step[1] = True

    if rotor_offsets[0] == turnovers[0] or step[1]:
        rotor_offsets[1] = (rotor_offsets[1] + 1) % ALPHABET_SIZE
        step[1] = True

    rotor_offsets[0] = (rotor_offsets[0] + 1) % ALPHABET_SIZE

def encrypt_char(c):
    if not c.isalpha():
        return c

    c = c.upper()
    spin_rotors()

    res = char_to_index(c)
    res = plug_swap(res)
    res = rotor_r_to_l(res, 0)
    res = rotor_r_to_l(res, 1)
    res = rotor_r_to_l(res, 2)
    res = reflect(res)
    res = rotor_l_to_r(res, 2)
    res = rotor_l_to_r(res, 1)
    res = rotor_l_to_r(res, 0)
    res = plug_swap(res)

    return index_to_char(res)

def encrypt_message(message):
    encrypted = ""
    for ch in message:
        encrypted += encrypt_char(ch)
    return encrypted

def set_rotor_positions(left, middle, right):
    rotor_offsets[2] = char_to_index(left)
    rotor_offsets[1] = char_to_index(middle)
    rotor_offsets[0] = char_to_index(right)

def print_rotor_status():
    print(f"Rotor positions (L,M,R): {index_to_char(rotor_offsets[2])} {index_to_char(rotor_offsets[1])} {index_to_char(rotor_offsets[0])}")

# Main simulation loop
def main():
    print("=== Enigma Machine Simulator (Python) ===\n")

    while True:
        print_rotor_status()
        print("\nCommands:")
        print("1: Set rotor positions")
        print("2: Set plugboard configuration")
        print("3: Encrypt a message")
        print("4: Quit\n")

        command = input("Enter command: ").strip()

        if command == '1':
            left = input("Enter left rotor position (A-Z): ").strip().upper()
            middle = input("Enter middle rotor position (A-Z): ").strip().upper()
            right = input("Enter right rotor position (A-Z): ").strip().upper()
            set_rotor_positions(left, middle, right)
            print(f"Rotor positions set to: {left} {middle} {right}\n")

        elif command == '2':
            pairs = input("Enter plugboard pairs (e.g., 'A B C D' to swap A-B and C-D): ")
            initialize_plugboard(pairs)
            print("Plugboard configuration set.\n")

        elif command == '3':
            print("Enter message to encrypt (type ENTER when done):")
            encrypted_message = ""
            input_text = input("Message: ")
            
            pchange = int(input("Change Plugboard settings:\nPress 1- To change plugboard setting for each word \nPress 2- Same Plugboard setting for each word \n"))

            if pchange == 1:
                for ch in input_text:
                    if ch == " ":
                        print("\n--- Space detected ---")
                        print("Enter new plugboard pairs (or press ENTER to keep current):")
                        new_pairs = input()
                        if new_pairs.strip():
                            initialize_plugboard(new_pairs)
                        encrypted_message += " "  
                        continue
                    encrypted_char = encrypt_char(ch)
                    encrypted_message += encrypted_char
            elif pchange == 2:
                encrypted_message = encrypt_message(input_text)
            else:
                print("Invalid Choice")
                continue


                

            print("\nEncrypted message:", encrypted_message)
            print("Note: Rotors have advanced during encryption.\n")

            

        elif command == '4':
            print("Exiting Enigma simulator.")
            break
        else:
            print("Invalid command. Please try again.\n")

if __name__ == "__main__":
    main()

#print(f"Sending encrypted message to Arduino: {encrypted_message}")
#arduino.write((encrypted_message + '\n').encode())  # add newline for Arduino readline()
