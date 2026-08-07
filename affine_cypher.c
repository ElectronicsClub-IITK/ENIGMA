#include <stdio.h>
#include <string.h>
char encrypt(char x,int a,int b){
    a=a%26;
    int y = x - 'A';
    int z = (a*y+b)%26;
    return z + 'A';
}


char decrypt(char x, int a, int b) {
    int a_inv = Inverse(a, 26);
    if (a_inv == -1) {
        printf("Modular inverse does not exist. Decryption not possible.\n");
        ;
    }
    int y = x - 'A';
    int z = (a_inv * (y - b + 26)) % 26;  
    return z + 'A';
}

int main(){
    int a,b,m=26;
    scanf("%d %d",&a,&b);
    if(a < m){
    int coprime = 0;
    while (!coprime) {
        coprime = 1;  
        for(int i = 2; i <= a; i++){
            if(a % i == 0 && m % i == 0){
                printf("a and m are supposed to be coprime\n");
                printf("Enter a new value for a: ");
                scanf("%d", &a);
                coprime = 0; 
                break;
            }
        }
    }
}if(m<a){
    int coprime = 0;
    while (!coprime) {
        coprime = 1;  
        for(int i = 2; i <= m; i++){
            if(a % i == 0 && m % i == 0){
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
scanf("%s",s);
printf("Encrypted text: ");
for (int i = 0; i < strlen(s); i++) {
        printf("%c", encrypt(s[i], a, b));
    }
    printf("\n");


}
