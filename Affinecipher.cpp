#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int gcd(int a, int b) {
    if (b == 0)
        return a;
    return gcd(b, a % b);
}

int inverse(int a, int m) {
    a = a % m;
    for (int x = 1; x < m; x++) {
        if ((a * x) % m == 1)
            return x;
    }
    return -1; 
}

string affineEncrypt(string text, int a, int b) {
    string result = "";

    for (int i = 0; i < text.length(); i++) {

        if (isalpha(text[i])) {
            char offset;
            if (isupper(text[i])) {
                offset = 'A';
            } else {
                offset = 'a';
            }

            int x = text[i] - offset;
            int encrypted = (a * x + b) % 26;
            char newChar = char(encrypted + offset);
            result += newChar;
        } else {
            result += text[i]; //only alphabet encruption
        }
    }

    return result;
}

// Decrypt using Affine Cipher
string affineDecrypt(string text, int a, int b) {
    int a_inv = inverse(a, 26);
    // if (a_inv == -1) {
    //     return "Invalid key: 'a' has no modular inverse.";
    // }

    string result = "";

    for (int i = 0; i < text.length(); i++) {

        if (isalpha(text[i])) {
            char offset;
            if (isupper(text[i])) {
                offset = 'A';
            } else {
                offset = 'a';
            }

            int y = text[i] - offset;
            int decrypted = (a_inv * (y - b + 26)) % 26;//add 26 to prevent negative values -1+'65'
            char newChar = char(decrypted + offset);
            result += newChar;
        } else {
            result += text[i];
        }
    }

    return result;
}

int main() {
    string input;
    int a, b;
    char choice;

    cout << "Enter text: ";
    getline(cin, input);
    cout << "Enter \"a\" (coprime with 26): ";
    cin >> a;
    if (gcd(a, 26) != 1) {
        cout << "Invalid key: 'a' must be coprime with 26.\n";
        return 1;
    }
    cout << "Enter \"b\": ";
    cin >> b;
    cout << "Encrypt (e) or Decrypt (d)? ";
    cin >> choice;

    cin.ignore(); // Clear newline left in buffer

    if (choice == 'e') {
        string encrypted = affineEncrypt(input, a, b);
        cout << "Encrypted Text: " << encrypted << endl;
    } else if (choice == 'd') {
        string decrypted = affineDecrypt(input, a, b);
        cout << "Decrypted Text: " << decrypted << endl;
    } else {
        cout << "Invalid choice.\n";
    }

    return 0;
}
