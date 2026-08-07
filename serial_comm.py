import string
import serial
import time

ALPHABET = string.ascii_uppercase
ALPHABET_SIZE = 26

rotors = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",  # Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",  # Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"   # Rotor III
]

reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"
turnovers = [ord('Q') - 65, ord('E') - 65, ord('V') - 65]  # I, II, III

rotor_offsets = [0, 0, 0]  # Right, Middle, Left
plugboard_map = {ch: ch for ch in ALPHABET}


def char_to_index(c):
    return ord(c) - ord('A')


def index_to_char(i):
    return ALPHABET[i % ALPHABET_SIZE]


def set_rotor_positions(left, middle, right):
    rotor_offsets[2] = char_to_index(left)
    rotor_offsets[1] = char_to_index(middle)
    rotor_offsets[0] = char_to_index(right)


def initialize_plugboard(pairs):
    global plugboard_map
    plugboard_map = {ch: ch for ch in ALPHABET}
    tokens = pairs.upper().split()
    for i in range(0, len(tokens), 2):
        if i + 1 < len(tokens):
            a, b = tokens[i], tokens[i + 1]
            plugboard_map[a], plugboard_map[b] = b, a


def plug_swap(c):
    return plugboard_map.get(c, c)


def spin_rotors():
    # Double stepping mechanism
    r, m, l = rotor_offsets
    will_middle_step = (m == turnovers[1])
    will_right_step = (r == turnovers[0])

    # Right rotor always steps
    rotor_offsets[0] = (r + 1) % ALPHABET_SIZE

    # Middle rotor steps if right rotor hits turnover OR if it is in its own turnover
    if will_right_step or will_middle_step:
        rotor_offsets[1] = (m + 1) % ALPHABET_SIZE

    # Left rotor steps only if middle rotor hits its turnover
    if will_middle_step:
        rotor_offsets[2] = (l + 1) % ALPHABET_SIZE


def rotor_forward(c, rotor_index, offset):
    idx = (char_to_index(c) + offset) % ALPHABET_SIZE
    wired = rotors[rotor_index][idx]
    return index_to_char((char_to_index(wired) - offset) % ALPHABET_SIZE)


def rotor_backward(c, rotor_index, offset):
    idx = (char_to_index(c) + offset) % ALPHABET_SIZE
    char = ALPHABET[idx]
    pos = rotors[rotor_index].index(char)
    return index_to_char((pos - offset) % ALPHABET_SIZE)


def reflect(c):
    return reflector[char_to_index(c)]


def encrypt_char(c):
    if not c.isalpha():
        return c
    c = c.upper()

    spin_rotors()

    c = plug_swap(c)

    c = rotor_forward(c, 0, rotor_offsets[0])
    c = rotor_forward(c, 1, rotor_offsets[1])
    c = rotor_forward(c, 2, rotor_offsets[2])

    c = reflect(c)

    c = rotor_backward(c, 2, rotor_offsets[2])
    c = rotor_backward(c, 1, rotor_offsets[1])
    c = rotor_backward(c, 0, rotor_offsets[0])

    c = plug_swap(c)
    return c


def encrypt_message(message):
    result = ""
    for ch in message:
        if ch == ' ':
            result += ' '
            while True:
                choice = input("Space encountered. Update plugboard? (y/n): ").strip().lower()
                if choice == 'y':
                    pairs = input("Enter new plugboard pairs (e.g., A B C D): ")
                    initialize_plugboard(pairs)
                    print("Plugboard updated.")
                    break
                elif choice == 'n':
                    break
        else:
            result += encrypt_char(ch)
    return result


def print_rotor_status():
    print(f"Rotor positions (L M R): {index_to_char(rotor_offsets[2])} "
          f"{index_to_char(rotor_offsets[1])} {index_to_char(rotor_offsets[0])}")


def send_to_arduino(message):
    try:
        arduino = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)  # Change to 'COMX' on Windows
        time.sleep(2)
        for ch in message:
            arduino.write(ch.encode())
            time.sleep(0.05)
        arduino.close()
        print("Message sent to Arduino.")
    except Exception as e:
        print(f"Arduino error: {e}")


def main():
    print("=== Enigma Machine Simulator (FULL) ===")
    set_rotor_positions('A', 'A', 'A')
    while True:
        print_rotor_status()
        print("\n1. Set rotor positions")
        print("2. Set plugboard pairs")
        print("3. Encrypt message")
        print("4. Exit\n")

        cmd = input("Enter option: ").strip()
        if cmd == '1':
            pos = input("Enter positions (L M R): ").upper().split()
            if len(pos) == 3 and all(p in ALPHABET for p in pos):
                set_rotor_positions(pos[0], pos[1], pos[2])
                print("Rotors updated.")
            else:
                print("Invalid input.")
        elif cmd == '2':
            pairs = input("Enter plugboard pairs: ")
            initialize_plugboard(pairs)
        elif cmd == '3':
            message = input("Enter message to encrypt: ")
            encrypted = encrypt_message(message)
            print(f"Encrypted: {encrypted}")
            send_to_arduino(encrypted)
        elif cmd == '4':
            break
        else:
            print("Invalid option.")


if __name__ == "__main__":
    main()