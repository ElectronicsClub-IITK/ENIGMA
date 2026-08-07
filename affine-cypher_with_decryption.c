#include <stdio.h>
#include <string.h>

char encrypt(char x, int a, int b){
    a = a % 26;
    int y = x - 'A';
    int z = (a * y + b) % 26;
    return z + 'A';
}


int Inverse(int a, int m) {
    a = a % m;
    for (int x = 1; x < m; x++) {
        if ((a * x) % m == 1) {
            return x;
        }
    }
    return -1; 
}
char decrypt(char x, int a, int b) {
    int a_inv = Inverse(a, 26);
    if (a_inv == -1) {
        printf("Modular inverse does not exist. Decryption not possible.\n");
        return '?'; 
    }
    int y = x - 'A';
    int z = (a_inv * (y - b + 26)) % 26; 
    return z + 'A';
}

int main(){
    int a, b, m = 26;
    scanf("%d %d", &a, &b);
    if (a < m) {
        int coprime = 0;
        while (!coprime) {
            coprime = 1;
            for (int i = 2; i <= a; i++) {
                if (a % i == 0 && m % i == 0) {
                    printf("a and m are supposed to be coprime\n");
                    printf("Enter a new value for a: ");
                    scanf("%d", &a);
                    coprime = 0;
                    break;
                }
            }
        }
    }

    if (m < a) {
        int coprime = 0;
        while (!coprime) {
            coprime = 1;
            for (int i = 2; i <= m; i++) {
                if (a % i == 0 && m % i == 0) {
                    printf("a and m are supposed to be coprime\n");
                    printf("Enter a new value for a: ");
                    scanf("%d", &a);
                    coprime = 0;
                    break;
                }
            }
        }
    }

    char s[100];
    scanf("%s", s);

    printf("Encrypted text: ");
    char encrypted[100];
    for (int i = 0; i < strlen(s); i++) {
        encrypted[i] = encrypt(s[i], a, b);
        printf("%c", encrypted[i]);
    }
    encrypted[strlen(s)] = '\0'; 
    printf("\n");
    printf("Decrypted text: ");
    for (int i = 0; i < strlen(encrypted); i++) {
        printf("%c", decrypt(encrypted[i], a, b));
    }
    printf("\n");

    return 0;
}