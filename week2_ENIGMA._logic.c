#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

#define NUM_ROTORS 3
#define ALPHABET_SIZE 26

char rotors[NUM_ROTORS][ALPHABET_SIZE + 1] = {
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"
};

char reflector[ALPHABET_SIZE + 1] = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

volatile int rotor_offsets[NUM_ROTORS] = {0, 0, 0};
int turnovers[NUM_ROTORS] = {'Q' - 'A', 'E' - 'A', 'V' - 'A'};

int pairings[ALPHABET_SIZE] = {0};
int stecker[ALPHABET_SIZE] = {0};
char input_buffer[256] = {0};
char output_buffer[256] = {0};

int stepping[NUM_ROTORS] = {0, 0, 0};
bool steckers = false;

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
    int res = mapped - rotor_offsets[rotor];
    if (res < 0) res += ALPHABET_SIZE;
    return res;
}

int rotor_l_to_r(int input, int rotor) {
    int idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE;
    int inverse = index_inverse(idx, rotor);
    int res = inverse - rotor_offsets[rotor];
    if (res < 0) res += ALPHABET_SIZE;
    return res;
}

int reflect(int input) {
    return reflector[input] - 'A';
}

void initialize_plugboard(const char *pairs) {
    for (int i = 0; i < ALPHABET_SIZE; i++) pairings[i] = 0;
    for (int i = 0; i < strlen(pairs); i += 3) {
        if (pairs[i + 1] == ' ' && i + 2 < strlen(pairs)) {
            int first = toupper(pairs[i]) - 'A';
            int second = toupper(pairs[i + 2]) - 'A';
            if (first >= 0 && first < ALPHABET_SIZE && second >= 0 && second < ALPHABET_SIZE) {
                pairings[first] = second - first;
                pairings[second] = first - second;
            }
        }
    }
}

void initialize_steckerboard(const char *pairs) {
    for (int i = 0; i < ALPHABET_SIZE; i++) stecker[i] = 0;
    for (int i = 0; i < strlen(pairs); i += 3) {
        if (pairs[i + 1] == ' ' && i + 2 < strlen(pairs)) {
            int first = toupper(pairs[i]) - 'A';
            int second = toupper(pairs[i + 2]) - 'A';
            if (first >= 0 && first < ALPHABET_SIZE && second >= 0 && second < ALPHABET_SIZE) {
                stecker[first] = second - first;
                stecker[second] = first - second;
            }
        }
    }
}

int plug_swap(int input) {
    return input + pairings[input];
}

void spin_rotors() {
    for (int i = 0; i < NUM_ROTORS; i++) {
        stepping[i] = 0;
    }

    stepping[0] = 1;

    if (rotor_offsets[1] == turnovers[1]) {
        stepping[2] = 1;
        stepping[1] = 1;
    }

    if (rotor_offsets[0] == turnovers[0]) {
        stepping[1] = 1;
    }

    for (int i = 0; i < NUM_ROTORS; i++) {
        if (stepping[i]) {
            rotor_offsets[i] = (rotor_offsets[i] + 1) % ALPHABET_SIZE;
        }
    }
}


struct pt {
    int yield_flag;
};

#define PT_BEGIN(pt) int yield_state = 0; switch(yield_state) { case 0:
#define PT_END(pt) } return 0;
#define PT_YIELD_TIME_msec(pt, ms) do { yield_state = __LINE__; return 1; case __LINE__: ; } while(0)
#define PT_EXIT(pt) do { return 0; } while(0)

/*int PT_Encrypt(struct pt *pt, const char *input, char *output) {
    PT_BEGIN(pt);

    int encrypt_idx = 0;
    memset(output, '\0', 256);

    while (input[encrypt_idx] != '\0') {
        if (!isalpha(input[encrypt_idx])) {
            output[encrypt_idx] = input[encrypt_idx];
            encrypt_idx++;
            continue;
        }

        int res = plug_swap(char_to_index(input[encrypt_idx]));
        spin_rotors();
        res = rotor_r_to_l(res, 0);
        res = rotor_r_to_l(res, 1);
        res = rotor_r_to_l(res, 2);
        res = reflect(res);
        res = rotor_l_to_r(res, 2);
        res = rotor_l_to_r(res, 1);
        res = rotor_l_to_r(res, 0);
        res = plug_swap(res);

        output[encrypt_idx] = index_to_char(res);
        encrypt_idx++;
        PT_YIELD_TIME_msec(pt, 1000);
    }

    PT_EXIT(pt);
    PT_END(pt);
}
*/
int stecker_swap(int input) {
    return input + stecker[input];
}

char encrypt_char(char c) {
    bool steckerboard = false;
    if (steckers && c == ' ') {
        printf("Do you want to continue with the steckerboard?(Y/N)");
        char q;
        scanf(" %c", &q);
        if (q == 'Y' || q == 'y') steckerboard = true;
    }

    if (!isalpha(c)) return c;
    c = toupper(c);
    spin_rotors();

    int res = char_to_index(c);
    if (steckerboard) {
        res = stecker_swap(res);
        res = rotor_r_to_l(res, 0);
        res = rotor_r_to_l(res, 1);
        res = rotor_r_to_l(res, 2);
        res = reflect(res);
        res = rotor_l_to_r(res, 2);
        res = rotor_l_to_r(res, 1);
        res = rotor_l_to_r(res, 0);
        res = stecker_swap(res);
        return index_to_char(res);
    }

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

void encrypt_message(const char *input, char *output) {
    int i = 0;
    while (input[i] != '\0') {
        output[i] = encrypt_char(input[i]);
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
    struct pt pt_encrypt;

    printf("=== Enigma Machine Simulator ===\n\n");

    while (true) {
        print_rotor_status();
        printf("\nCommands:\n");
        printf("1: Set rotor positions\n");
        printf("2: Set plugboard configuration\n");
        printf("3: Set steckerboard configuration\n");
        printf("4: Encrypt a message\n");
        printf("5: Quit\n");
        printf("\nEnter command: ");

        scanf("%s", command);

        if (command[0] == '1') {
            char left, middle, right;
            printf("Enter rotor positions (left middle right, e.g., 'A B C'): ");
            scanf(" %c %c %c", &left, &middle, &right);
            set_rotor_positions(left, middle, right);
            printf("Rotor positions set to: %c %c %c\n\n", left, middle, right);
        } else if (command[0] == '2') {
            printf("Enter plugboard pairs (e.g., 'A B C D' to swap A-B and C-D): ");
            getchar();
            fgets(plugboard_config, sizeof(plugboard_config), stdin);
            initialize_plugboard(plugboard_config);
            printf("Plugboard configuration set\n\n");
        } else if (command[0] == '3') {
            printf("Enter steckerboard pairs (e.g., 'A B C D' to swap A-B and C-D): ");
            getchar();
            fgets(plugboard_config, sizeof(plugboard_config), stdin);
            initialize_steckerboard(plugboard_config);
            steckers = true;
            printf("Steckerboard configuration set\n\n");
        } else if (command[0] == '4') {
            printf("Enter message to encrypt: ");
            getchar();
            fgets(text, sizeof(text), stdin);
            text[strcspn(text, "\n")] = '\0';
            encrypt_message(text, output_buffer);
            printf("Encrypted message: %s\n\n", output_buffer);
            printf("Note: Rotors have advanced during encryption.\n");
        } else if (command[0] == '5') {
            printf("Exiting Enigma simulator.\n");
            break;
        } else {
            printf("Invalid command. Please try again.\n\n");
        }
    }

    return 0;
}
