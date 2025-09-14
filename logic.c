#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

// Number of rotors and alphabet size
#define NUM_ROTORS 3
#define ALPHABET_SIZE 26

// Rotor configurations (historical Enigma I rotors)
char rotors[NUM_ROTORS][ALPHABET_SIZE + 1] = {
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ", // Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE", // Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"  // Rotor III
};

char reflector[ALPHABET_SIZE + 1] = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

volatile int rotor_offsets[NUM_ROTORS] = {0, 0, 0}; // Right, middle, left
int turnovers[NUM_ROTORS] = {'Q' - 'A', 'E' - 'A', 'V' - 'A'};
int pairings[ALPHABET_SIZE] = {0};
char input_buffer[256] = {0};
char output_buffer[256] = {0};
int stepping[NUM_ROTORS] = {0, 0, 0};

int char_to_index(char c) {
    return toupper(c) - 'A';
}

char index_to_char(int index) {
    return 'A' + (index % ALPHABET_SIZE);
}

int index_inverse(int c, int rotor) {
    int i;
    for (i = 0; i < ALPHABET_SIZE; i++) {
        if (rotors[rotor][i] == c + 'A') {
            return i;
        }
    }
    return -1; // Error condition
}

// Map an input through a rotor from right to left
int rotor_r_to_l(int input, int rotor) {
    // Apply offset to determine which contact is hit
    int idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE;
    
    // Determine which contact it maps to, based on the rotor's wiring
    int mapped = rotors[rotor][idx] - 'A';
    
    // Adjust for the offset to get the index of the output contact
    int res = mapped - rotor_offsets[rotor];
    
    // Ensure the result is within range 0-25
    if (res < 0) res += ALPHABET_SIZE;
    if (res >= ALPHABET_SIZE) res -= ALPHABET_SIZE;
    
    return res;
}

// Map an input through a rotor from left to right
int rotor_l_to_r(int input, int rotor) {
    // Apply offset to determine which contact is hit
    int idx = (input + rotor_offsets[rotor]) % ALPHABET_SIZE;
    
    // Find the inverse mapping (which contact on the right maps to this one)
    int inverse = index_inverse(idx, rotor);
    
    // Adjust for the offset to get the index of the output contact
    int res = inverse - rotor_offsets[rotor];
    
    // Ensure the result is within range 0-25
    if (res < 0) res += ALPHABET_SIZE;
    if (res >= ALPHABET_SIZE) res -= ALPHABET_SIZE;
    
    return res;
}

// Map an input through the reflector
int reflect(int input) {
    // The reflector simply uses the lookup table to map the input
    // to its corresponding output
    return reflector[input] - 'A';
}

// Initialize the plugboard with given pairs
void initialize_plugboard(const char *pairs) {
    // Reset the plugboard to no swaps
    for (int i = 0; i < ALPHABET_SIZE; i++) {
        pairings[i] = 0;
    }
    
    // Process each pair
    for (int i = 0; i < strlen(pairs); i += 3) {
        if (pairs[i+1] == ' ' && i+2 < strlen(pairs)) {
            // Extract the two letters to be paired
            int first = toupper(pairs[i]) - 'A';
            int second = toupper(pairs[i+2]) - 'A';
            
            if (first >= 0 && first < ALPHABET_SIZE && 
                second >= 0 && second < ALPHABET_SIZE) {
                // Set up the bidirectional swap
                pairings[first] = second - first;
                pairings[second] = first - second;
            }
        }
    }
}

// Swap a letter through the plugboard
int plug_swap(int input) {
    // Add the offset (which may be 0 if no swap) to the input
    return input + pairings[input];
}

void spin_rotors() {
    for (int i = 0; i < NUM_ROTORS; i++) {
        stepping[i] = 0;
    } 
    for (int i = NUM_ROTORS - 1; i > 0; i--) {
        if (rotor_offsets[i-1] == turnovers[i-1]) {
            rotor_offsets[i] = (rotor_offsets[i] + 1) % ALPHABET_SIZE;
            stepping[i] = 1;
        }
    }
    rotor_offsets[0] = (rotor_offsets[0] + 1) % ALPHABET_SIZE;
    if(stepping[2]==1 && stepping[1]==0)
    rotor_offsets[1]=(rotor_offsets[1]+1)%26;
}

// Simple encrypt character function (without threading)
char encrypt_char(char c) {
    // If not a letter, return unchanged
    if (!isalpha(c)) return c;
    
    // Convert to uppercase
    c = toupper(c);
    // Advance the rotors
    spin_rotors();
    
    // Apply encryption logic
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

// Simple encrypt message function (without threading)
void encrypt_message(const char *input, char *output) {
    int i = 0;
    while (input[i] != '\0') {
        if (input[i] == ' ') {
            // When space is encountered, prompt for plugboard change
            printf("\nSpace detected. Do you want to change plugboard configuration? (y/n): ");
            char response;
            scanf(" %c", &response);
            getchar(); // Clear the newline
            
            if (tolower(response) == 'y') {
                char new_pairs[256];
                printf("Enter new plugboard pairs (e.g., 'A B C D' to swap A-B and C-D): ");
                fgets(new_pairs, sizeof(new_pairs), stdin);
                new_pairs[strcspn(new_pairs, "\n")] = '\0'; // Remove newline
                initialize_plugboard(new_pairs);
                printf("Plugboard configuration updated.\n");
            }
            
            // Add the space to output
            output[i] = ' ';
            i++;
            continue;
        }
        
        output[i] = encrypt_char(input[i]);
        i++;
    }
    output[i] = '\0';
}

// Print current rotor positions
void print_rotor_status() {
    printf("Rotor positions (L,M,R): %c %c %c\n", 
           index_to_char(rotor_offsets[2]), 
           index_to_char(rotor_offsets[1]), 
           index_to_char(rotor_offsets[0]));
}

// Set rotor positions
void set_rotor_positions(char left, char middle, char right) {
    rotor_offsets[2] = char_to_index(left);
    rotor_offsets[1] = char_to_index(middle);
    rotor_offsets[0] = char_to_index(right);
}

// Example main function to demonstrate usage
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
            plugboard_config[strcspn(plugboard_config, "\n")] = '\0'; // Remove newline
            initialize_plugboard(plugboard_config);
            printf("Plugboard configuration set\n\n");
        }
        else if (command[0] == '3') {
            printf("Enter message to encrypt: ");
            getchar(); // Clear newline
            fgets(text, sizeof(text), stdin);
            text[strcspn(text, "\n")] = '\0'; // Remove newline
            
            encrypt_message(text, output_buffer);
            printf("Encrypted message: %s\n\n", output_buffer);
            
            // Reset rotor positions for demonstration
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