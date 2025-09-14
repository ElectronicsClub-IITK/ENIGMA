#include <stdio.h>
#include <string.h>
#include <ctype.h>


int modInverse(int a, int m) 
{
    for (int x = 1; x < m; x++) {
        if ((a * x) % m == 1)
            return x;
    }
}


void encrypt(char* ptxt, char* ctxt, int a, int b) 
{
    int l;
    for (int i = 0; ptxt[i] != '\0'; i++) {
        char c = ptxt[i];
        if (isalpha(c)) {
            c = toupper(c);
            int x = c - 'A';
            int encd = (a * x + b) % 26;
            ctxt[i] = encd + 'A';
        } 
        l=i;
    }
    ctxt[l] = '\0';
}


void decrypt(char* ctxt, char* ptxt, int a, int b) 
{
    int ainv = modInverse(a, 26);

    int i;
    for (i = 0; ctxt[i] != '\0'; i++) {
        char c = ctxt[i];
        if (isalpha(c)) {
            c = toupper(c);
            int y = c - 'A';
            int decd = (ainv * (y - b)+26) % 26; 
            ptxt[i] = decd + 'A';
        } else {
            ptxt[i] = c;
        }
    }
    ptxt[i] = '\0';
}

int main() {
    char input[101], encd[101], decd[101];
    int a, b;

    printf("Enter txt (max 100 char no spaces): ");
    scanf("%s", input);

    printf("Enter a ");
    scanf("%d", &a);

    printf("Enter 'b': ");
    scanf("%d", &b);

    encrypt(input, encd, a, b);
    decrypt(encd, decd, a, b);
 
    printf("Encd txt: %s\n", encd);
    printf("Decd txt: %s\n", decd);

    return 0;
}
