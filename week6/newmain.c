/* 
 * File:   newmain.c
 * Author: Arushi Kondaskar
 *
 * Created on June 20, 2025, 6:35 PM
 */



#include <xc.h>
#include <stdio.h>
#include <string.h>
#include "i2c_master.h"
#include "ssd1306.h"
#include "fonts.h"
#include <stdbool.h>


// Rotor state
char rotors[3] = {'A', 'A', 'A'};
int currentRotor = 0;
bool wasDown = false;
bool wasPressed = false;
char lastMessage[32] = "";
char lastEncrypted[32] = "";

void draw_display();
void parse_encrypted_message(char *input);
void print_rotor_status();
bool isAlpha(char c);

void UART1_Write(char c) {
    while (U1STAbits.UTXBF);  // Wait until buffer is not full
    U1TXREG = c;
}

void UART1_WriteString(const char *str) {
    while (*str) {
        UART1_Write(*str++);
    }
}

int main(void) {
    // INIT UART
    __builtin_disable_interrupts();
    U1MODE = 0;
    U1STA = 0;
    U1BRG = ((48000000 / 16) / 9600) - 1;
    U1MODEbits.PDSEL = 0; // 8-bit no parity
    U1MODEbits.STSEL = 0; // 1 stop bit
    U1STAbits.UTXEN = 1;  // Enable TX
    U1STAbits.URXEN = 1;  // Enable RX
    U1MODEbits.ON = 1;    // Turn on UART
    __builtin_enable_interrupts();

    // INIT I2C & OLED
    i2c_master_setup();
    ssd1306_init();
    draw_display();

    char buffer[64];
    int index = 0;
    while (1) {
        // Read UART input
        if (U1STAbits.URXDA) {
            char c = U1RXREG;
            if (c == '\n' || c == '\r') {
                buffer[index] = '\0';
                index = 0;

                if (strlen(buffer) == 5 && buffer[1] == '-' && buffer[3] == '-') {
                    if (isAlpha(buffer[0]) && isAlpha(buffer[2]) && isAlpha(buffer[4])) {
                        rotors[0] = buffer[0];
                        rotors[1] = buffer[2];
                        rotors[2] = buffer[4];
                        print_rotor_status();
                        draw_display();
                    }
                } else if (strstr(buffer, "MSG:") && strstr(buffer, "|ENC:")) {
                    parse_encrypted_message(buffer);
                    draw_display();
                }
            } else if (index < sizeof(buffer) - 1) {
                buffer[index++] = c;
            }
        }
    }
}

void draw_display() {
    ssd1306_clear();

    char line1[32];
    sprintf(line1, "Rotor: %c-%c-%c", rotors[0], rotors[1], rotors[2]);
    ssd1306_draw_string(line1, 0, 0);

    ssd1306_draw_string("Msg:",0, 10 );
    ssd1306_draw_string(lastMessage,0, 20);

    ssd1306_draw_string("Enc:",0, 35);
    ssd1306_draw_string(lastEncrypted,0, 45);

    ssd1306_update();
}

void parse_encrypted_message(char *input) {
    char *msg_ptr = strstr(input, "MSG:");
    char *enc_ptr = strstr(input, "|ENC:");

    if (msg_ptr && enc_ptr) {
        int msg_len = enc_ptr - (msg_ptr + 4);
        strncpy(lastMessage, msg_ptr + 4, msg_len);
        lastMessage[msg_len] = '\0';

        strncpy(lastEncrypted, enc_ptr + 5, sizeof(lastEncrypted) - 1);
        lastEncrypted[sizeof(lastEncrypted) - 1] = '\0';
    }
}

void print_rotor_status() {
    char status[16];
    sprintf(status, "%c-%c-%c\n", rotors[0], rotors[1], rotors[2]);
    UART1_WriteString(status);
}

bool isAlpha(char c) {
    return (c >= 'A' && c <= 'Z');
}
