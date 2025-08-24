#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

#define NUM_ROTORS 3
#define ALPHABET_SIZE 26

char rotors[NUM_ROTORS][ALPHABET_SIZE + 1] = {
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ", // Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE", // Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"  // Rotor III
};

char reflector[ALPHABET_SIZE + 1] = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

volatile int rotor_offsets[NUM_ROTORS] = {0, 0, 0};
int pairings[ALPHABET_SIZE] = {0};

char input_buffer[256] = {0};
char output_buffer[256] = {0};

int char_to_index(char c) {
    return toupper(c) - 'A';
}

char index_to_char(int index) {
    return 'A' + (index % ALPHABET_SIZE);
}

int index_inverse(int c, int rotor) {
    for (int i = 0; i < ALPHABET_SIZE; i++) {
        if (rotors[rotor][i] == c + 'A') return i;
    }
    return -1;
}

int rotor_r_to_l(int input, int rotor) {
    int idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE;
    int mapped = rotors[rotor][idx] - 'A';
    return (mapped - rotor_offsets[rotor] + ALPHABET_SIZE) % ALPHABET_SIZE;
}

int rotor_l_to_r(int input, int rotor) {
    int idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE;
    int inverse = index_inverse(idx, rotor);
    return (inverse - rotor_offsets[rotor] + ALPHABET_SIZE) % ALPHABET_SIZE;
}

int reflect(int input) {
    return reflector[input] - 'A';
}

void initialize_plugboard(const char *pairs) {
    for (int i = 0; i < ALPHABET_SIZE; i++) pairings[i] = 0;
    for (int i = 0; i < strlen(pairs); i += 3) {
        if (pairs[i+1] == ' ' && i+2 < strlen(pairs)) {
            int first = toupper(pairs[i]) - 'A';
            int second = toupper(pairs[i+2]) - 'A';
            if (first >= 0 && first < ALPHABET_SIZE && second >= 0 && second < ALPHABET_SIZE) {
                pairings[first] = second - first;
                pairings[second] = first - second;
            }
        }
    }
}

int plug_swap(int input) {
    return input + pairings[input];
}

// Middle rotor double-steps after right rotor makes a full rotation
void spin_rotors() {
    static int right_rotor_steps = 0;
    rotor_offsets[0] = (rotor_offsets[0] + 1) % ALPHABET_SIZE;
    right_rotor_steps++;
    if (right_rotor_steps % ALPHABET_SIZE == 0) {
        rotor_offsets[1] = (rotor_offsets[1] + 2) % ALPHABET_SIZE;
    }
}

char encrypt_char(char c) {
    if (!isalpha(c)) return c;
    c = toupper(c);
    spin_rotors();
    int res = char_to_index(c);
    res = plug_swap(res);
    res = rotor_r_to_l(res, 0);
    res = rotor_r_to_l(res, 1);
    res = rotor_r_to_l(res, 2);
    res = reflect(res);
    res = rotor_l_to_r(res, 2);
    res = rotor_l_to_r(res, 1);
    res = rotor_l_to_r(res, 0);
    res = plug_swap(res);
    return index_to_char(res);
}

// ✅ Modified to prompt on spaces
void encrypt_message(const char *input, char *output) {
    char temp_config[256];
    int i = 0;
    while (input[i] != '\0') {
        if (input[i] == ' ') {
            output[i] = ' ';
            printf("\nSpace detected at position %d.\n", i);
            printf("Change plugboard configuration? (y/n): ");
            char choice;
            scanf(" %c", &choice);
            getchar(); // Clear newline
            if (choice == 'y' || choice == 'Y') {
                printf("Enter new plugboard pairs (e.g., 'A B C D'): ");
                fgets(temp_config, sizeof(temp_config), stdin);
                initialize_plugboard(temp_config);
                printf("Plugboard updated.\n");
            }
        } else {
            output[i] = encrypt_char(input[i]);
        }
        i++;
    }
    output[i] = '\0';
}

void print_rotor_status() {
    printf("Rotor positions (L,M,R): %c %c %c\n",
           index_to_char(rotor_offsets[2]),
           index_to_char(rotor_offsets[1]),
           index_to_char(rotor_offsets[0]));
}

void set_rotor_positions(char left, char middle, char right) {
    rotor_offsets[2] = char_to_index(left);
    rotor_offsets[1] = char_to_index(middle);
    rotor_offsets[0] = char_to_index(right);
}

int main() {
    char command[10];
    char text[256];
    char plugboard_config[256] = "";

    printf("=== Enigma Machine Simulator ===\n\n");

    while (true) {
        print_rotor_status();
        printf("\nCommands:\n");
        printf("1: Set rotor positions\n");
        printf("2: Set plugboard configuration\n");
        printf("3: Encrypt a message\n");
        printf("4: Quit\n");
        printf("\nEnter command: ");

        scanf("%s", command);

        if (command[0] == '1') {
            char left, middle, right;
            printf("Enter rotor positions (left middle right, e.g., 'A B C'): ");
            scanf(" %c %c %c", &left, &middle, &right);
            set_rotor_positions(left, middle, right);
            printf("Rotor positions set to: %c %c %c\n\n", left, middle, right);
        }
        else if (command[0] == '2') {
            printf("Enter plugboard pairs (e.g., 'A B C D' to swap A-B and C-D): ");
            getchar(); // Clear newline
            fgets(plugboard_config, sizeof(plugboard_config), stdin);
            initialize_plugboard(plugboard_config);
            printf("Plugboard configuration set\n\n");
        }
        else if (command[0] == '3') {
            printf("Enter message to encrypt: ");
            getchar(); // Clear newline
            fgets(text, sizeof(text), stdin);
            text[strcspn(text, "\n")] = '\0'; // Remove newline

            encrypt_message(text, output_buffer);
            printf("\nEncrypted message: %s\n\n", output_buffer);
            printf("Note: Rotors have advanced during encryption.\n");
        }
        else if (command[0] == '4') {
            printf("Exiting Enigma simulator.\n");
            break;
        }
        else {
            printf("Invalid command. Please try again.\n\n");
        }
    }

    return 0;
}
