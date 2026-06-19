import PySimpleGUI as sg
import time

font_spec = 'Courier 24 bold'
heading_color = '#2FB8AD'
alphabet_list = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

# This defines how the GUI looks
layout = [
[sg.Text('ENIGMA MACHINE SIMULATOR', justification='center', font='Courier 24 bold', expand_x=True, text_color='white', background_color="#00D99C")],
    [sg.Text('Input Message for Encryption', background_color=heading_color)],
    [sg.InputText('', key='pic_input')],
[sg.Text('Rotor 1  Configuration', background_color=heading_color)],
[sg.InputText('EKMFLGDQVZNTOWYHXUSPAIBRCJ', key='rotor1_input'), sg.Button('Send', key='rotor1_send')],

[sg.Text('Rotor 2  Configuration', background_color=heading_color)],
[sg.InputText('AJDKSIRUXBLHWTMCQGZNPYFVOE', key='rotor2_input'), sg.Button('Send', key='rotor2_send')],

[sg.Text('Rotor 3  Configuration', background_color=heading_color)],
[sg.InputText('BDFHJLCPRTXVZNYEIWGAKMUSQO', key='rotor3_input'), sg.Button('Send', key='rotor3_send')],
    [
    sg.Text('Rotor 3 Offset(L)', background_color=heading_color),
    sg.Text('Rotor 2 Offset(M)', background_color=heading_color),
    sg.Text('Rotor 1 Offset(R)', background_color=heading_color),
    sg.Button('Send Offsets', key='send_offsets')
    ],
    [
    sg.Listbox(values=alphabet_list, size=(10,5), key='rotor3_offset'),
    sg.Listbox(values=alphabet_list, size=(10,5), key='rotor2_offset'),
    sg.Listbox(values=alphabet_list, size=(10,5), key='rotor1_offset')
    ],
    [sg.Text('Ring Setting L', background_color=heading_color),
 sg.Text('Ring Setting M', background_color=heading_color),
 sg.Text('Ring Setting R', background_color=heading_color),
 sg.Button('Send Ring Settings', key='send_rings')],
[sg.Listbox(values=alphabet_list, size=(10,5), key='ring1_offset'),
 sg.Listbox(values=alphabet_list, size=(10,5), key='ring2_offset'),
 sg.Listbox(values=alphabet_list, size=(10,5), key='ring3_offset')],

    [sg.Button('Submit', key='submit')],
    [sg.Multiline('', size=(60, 10), key='console', disabled=True, autoscroll=True, background_color='#222', text_color='white')],
    [sg.Checkbox('Enable Reset', key='reset'), sg.Button('Reset', key='reset_all')],

]



import string
NUM_ROTORS = 3
ALPHABET_SIZE = 26

rotors = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"
]

reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"

rotor_offsets = [0, 0, 0]
ring_settings = [0, 0, 0]  # R, M, L
turnovers = [ord('Q') - ord('A'), ord('E') - ord('A'), ord('V') - ord('A')]

pairings = [0] * ALPHABET_SIZE
stecker = [0] * ALPHABET_SIZE
input_buffer = ['\0'] * 256
output_buffer = ['\0'] * 256

stepping = [0, 0, 0]
steckers = False

def char_to_index(c):
    return ord(c.upper()) - ord('A')

def index_to_char(index):
    return chr(ord('A') + (index % ALPHABET_SIZE))

def index_inverse(c, rotor):
    for i in range(ALPHABET_SIZE):
        if rotors[rotor][i] == chr(c + ord('A')):
            return i
    return -1

def apply_ring_setting(rotor, ring_offset):
    return rotor[ring_offset:] + rotor[:ring_offset]

def rotor_r_to_l(input, rotor):
    idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE
    mapped = ord(rotors[rotor][idx]) - ord('A')
    res = mapped - rotor_offsets[rotor]
    if res < 0:
        res += ALPHABET_SIZE
    return res

def rotor_l_to_r(input, rotor):
    idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE
    inverse = index_inverse(idx, rotor)
    res = inverse - rotor_offsets[rotor]
    if res < 0:
        res += ALPHABET_SIZE
    return res

def reflect(input):
    return ord(reflector[input]) - ord('A')

def initialize_plugboard(pairs):
    global pairings
    pairings = [0] * ALPHABET_SIZE
    for i in range(0, len(pairs), 3):
        if i + 2 < len(pairs) and pairs[i+1] == ' ':
            first = ord(pairs[i].upper()) - ord('A')
            second = ord(pairs[i+2].upper()) - ord('A')
            if 0 <= first < ALPHABET_SIZE and 0 <= second < ALPHABET_SIZE:
                pairings[first] = second - first
                pairings[second] = first - second

def initialize_steckerboard(pairs):
    global stecker
    stecker = [0] * ALPHABET_SIZE
    for i in range(0, len(pairs), 3):
        if i + 2 < len(pairs) and pairs[i+1] == ' ':
            first = ord(pairs[i].upper()) - ord('A')
            second = ord(pairs[i+2].upper()) - ord('A')
            if 0 <= first < ALPHABET_SIZE and 0 <= second < ALPHABET_SIZE:
                stecker[first] = second - first
                stecker[second] = first - second

def plug_swap(input):
    return input + pairings[input]

def spin_rotors():
    global rotor_offsets

    # Check for double-stepping
    middle_at_turnover = rotor_offsets[1] == turnovers[1]
    right_at_turnover = rotor_offsets[0] == turnovers[0]

    # Always step the rightmost rotor
    rotor_offsets[0] = (rotor_offsets[0] + 1) % ALPHABET_SIZE

    # Double-stepping mechanism
    if right_at_turnover:
        rotor_offsets[1] = (rotor_offsets[1] + 1) % ALPHABET_SIZE

    # Step middle rotor again if it is at its own turnover position
    if middle_at_turnover:
        rotor_offsets[1] = (rotor_offsets[1] + 1) % ALPHABET_SIZE
        rotor_offsets[2] = (rotor_offsets[2] + 1) % ALPHABET_SIZE
        
def stecker_swap(input):
    return input + stecker[input]

def encrypt_char(c):
    global steckers
    steckerboard = False
    if steckers and c == ' ':
        q = input("Do you want to continue with the steckerboard?(Y/N) ")
        if q.upper() == 'Y':
            steckerboard = True

    if not c.isalpha():
        return c

    c = c.upper()
    spin_rotors()

    res = char_to_index(c)
    if steckerboard:
        res = stecker_swap(res)
        res = rotor_r_to_l(res, 0)
        res = rotor_r_to_l(res, 1)
        res = rotor_r_to_l(res, 2)
        res = reflect(res)
        res = rotor_l_to_r(res, 2)
        res = rotor_l_to_r(res, 1)
        res = rotor_l_to_r(res, 0)
        res = stecker_swap(res)
        return index_to_char(res)
    else:
        res = plug_swap(res)
        res = rotor_r_to_l(res, 0)
        res = rotor_r_to_l(res, 1)
        res = rotor_r_to_l(res, 2)
        res = reflect(res)
        res = rotor_l_to_r(res, 2)
        res = rotor_l_to_r(res, 1)
        res = rotor_l_to_r(res, 0)
        res = plug_swap(res)
        
    # print_rotor_status()
    return index_to_char(res)

def encrypt_message(input):
    rotor0 = apply_ring_setting(rotors[0], ring_settings[0])
    rotor1 = apply_ring_setting(rotors[1], ring_settings[1])
    rotor2 = apply_ring_setting(rotors[2], ring_settings[2])

    output = ''
    for c in input:
        output += encrypt_char(c)
    return output

def print_rotor_status():
    print("Rotor positions (L,M,R):", index_to_char(rotor_offsets[2]), index_to_char(rotor_offsets[1]), index_to_char(rotor_offsets[0]))

def set_rotor_positions(left, middle, right):
    rotor_offsets[2] = char_to_index(left)
    rotor_offsets[1] = char_to_index(middle)
    rotor_offsets[0] = char_to_index(right)




sg.SetOptions(
    background_color='#9FB8AD',
    text_element_background_color='#9FB8AD',
    element_background_color='#475841',
    button_color=('white', '#475841'),
)
##Create and show the window
window = sg.Window('ECE4760 Interface', layout, finalize=True)




while True:
    event, values = window.read(timeout=20)
    
    if event == sg.WIN_CLOSED or event == 'Exit':
        break

    # Set rotor configurations
    if event == 'rotor1_send':
        rotor1 = values['rotor1_input'].upper()
        if len(rotor1) == 26 and set(rotor1) == set(alphabet_list):
            rotors[0] = rotor1
            window['console'].update('Rotor 1 config set!\n', append=True)
        else:
            window['console'].update('Invalid Rotor 1 config!\n', append=True)

    if event == 'rotor2_send':
        rotor2 = values['rotor2_input'].upper()
        if len(rotor2) == 26 and set(rotor2) == set(alphabet_list):
            rotors[1] = rotor2
            window['console'].update('Rotor 2 config set!\n', append=True)
        else:
            window['console'].update('Invalid Rotor 2 config!\n', append=True)

    if event == 'rotor3_send':
        rotor3 = values['rotor3_input'].upper()
        if len(rotor3) == 26 and set(rotor3) == set(alphabet_list):
            rotors[2] = rotor3
            window['console'].update('Rotor 3 config set!\n', append=True)
        else:
            window['console'].update('Invalid Rotor 3 config!\n', append=True)

    # Always set rotor offsets and show message when button pressed
    if event == 'send_offsets':
        try:
            right = values['rotor1_offset'][0]
            middle = values['rotor2_offset'][0]
            left = values['rotor3_offset'][0]
            set_rotor_positions(left, middle, right)
            window['console'].update(f'Offsets set: {left} {middle} {right}\n', append=True)
        except Exception:
            window['console'].update('Please select all rotor offsets!\n', append=True)
            
    if event =='update_from_arduino':
        window['rotor1_offset'].update(set_to_index=rotor_offsets[0])
        window['rotor2_offset'].update(set_to_index=rotor_offsets[1])
        window['rotor3_offset'].update(set_to_index=rotor_offsets[2])


    if event == 'send_rings':
        try:
            left = values['ring1_offset'][0]
            middle = values['ring2_offset'][0]
            right = values['ring3_offset'][0]
            ring_settings[2] = char_to_index(left)
            ring_settings[1] = char_to_index(middle)
            ring_settings[0] = char_to_index(right)
            window['console'].update(f'Ring settings set: {left} {middle} {right}\n', append=True)
        except Exception:
            window['console'].update('Please select all ring settings!\n', append=True)


    # Encrypt and send message
    if event == 'submit':
        message = values['pic_input']
        encrypted = encrypt_message(message)
        window['console'].update(f'Encrypted: {encrypted}\n', append=True)
        left_char = index_to_char(rotor_offsets[2])
        middle_char = index_to_char(rotor_offsets[1])
        right_char = index_to_char(rotor_offsets[0])

    
        status_msg = (
            f'Rotor Offsets:'
            f'{left_char} '
            f'{middle_char} '
            f'{right_char}\n'
        )
        window['console'].update(status_msg, append=True)
        # ser.write((encrypted+'\r').encode())
        
        window['rotor1_offset'].update(set_to_index=rotor_offsets[0])
        window['rotor2_offset'].update(set_to_index=rotor_offsets[1])
        window['rotor3_offset'].update(set_to_index=rotor_offsets[2])
        
    if event == "update_offsets":
        rotor_vals = values[event]
        window['rotor1_offset'].update(set_to_index=rotor_vals[0])
        window['rotor2_offset'].update(set_to_index=rotor_vals[1])
        window['rotor3_offset'].update(set_to_index=rotor_vals[2])



    # Reset all fields if 'Enable Reset' is checked and 'Reset' button is pressed
    if event == 'reset_all' and values['reset']:
        # Clear all input fields
        window['pic_input'].update('')
        window['rotor1_input'].update('EKMFLGDQVZNTOWYHXUSPAIBRCJ')
        window['rotor2_input'].update('AJDKSIRUXBLHWTMCQGZNPYFVOE')
        window['rotor3_input'].update('BDFHJLCPRTXVZNYEIWGAKMUSQO')
        # Clear all listbox selections
        window['rotor1_offset'].update(set_to_index=[])
        window['rotor2_offset'].update(set_to_index=[])
        window['rotor3_offset'].update(set_to_index=[])
        # Clear the console
        window['ring1'].update(set_to_index=[])
        window['ring2'].update(set_to_index=[])
        window['ring3'].update(set_to_index=[])

        window['console'].update('')
        window['console'].update('All fields reset!\n', append=True)
        

# Close window after loop ends
window.close()    
