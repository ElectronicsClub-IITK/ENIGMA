#include <iostream>
#include <string>
using namespace std;

string toUpperCase(string str) {
    for (char &c :str) {
        c = toupper(c);
    }
    return str;
}

string affineCipher(string text, int a, int b) {
    string result = "";
    for (char c : text) {
        char encryptedChar = char(((a * c + b) % 128));
        result += encryptedChar;
    }
    return result;
}

bool coprime(int a, int b) {
    while (b != 0) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a == 1;
}

int getInverse(int a) {
    for (int i = 1; i < 128; i++) {
        if ((a * i) % 128 == 1) {
            return i;
        }
    }
    return -1; 
}

string decipher(string text, int a, int b) {
    string result = "";
    for (char c : text) {
        char encryptedChar = char(((c - b + 128) * a) % 128);
        result += encryptedChar;
    }
    return result;
}

int main(){
    string text;
    int a,b;
    cout<<"Enter the text to encrypt: ";
    cin>>text;
    cout<<"Enter the value of a: "; 
    cin>>a;
    a%=128;
    if(a<0)
        a+=128;
    if(coprime(a, 128)==false){
        cout<<"a and 128 are not coprime. Cannot encrypt."<<endl;
        return 0;
    }
    cout<<"Enter the value of b: ";
    cin>>b;
    b%=128;
    if(b<0)
        b+=128;
    string enc = affineCipher(text, a, b);
    cout<<"Encrypted text: "<<enc<<endl;
    int inverse_a = getInverse(a);
    if(inverse_a==-1){
        cout<<"Inverse of a does not exist. Cannot decrypt."<<endl;
        return 0;
    }
    string dcc = decipher(enc, inverse_a, b);
    cout<<"Decrypted text: "<<dcc<<endl;
}