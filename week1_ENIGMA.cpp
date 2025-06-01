#include <iostream>
using namespace std;
int inverse_a(int a){
    for (int i=1;i<128;i++){
        if ((a*i)%128==1){
            return i;
        }
    }
    return -1;
}
string affine_decode(string s, int a, int b){
    string result = "";
    for (char c:s){
        result+=(char)(((a*(c-b))%128+128)%128);
    }
    return result;
}
string affine_encode(string s, int a, int b){
    string result = "";
    for (char c:s){
        result+=(char)(((a*c+b)%128+128)%128);
    }
    return result;
}
    
int main(){
    int a, b;
    cin>>a>>b;
    if (inverse_a(a)==-1){
        cout<<"a must be co-prime to 128"<<endl;
        return 0;
    }
    a=a%128;
    b=b%128;
    string s;
    int choice;
    cin>>choice;
    cin.ignore();
    getline(cin, s);
    if (choice==1){
        cout<<affine_encode(s, a, b)<<endl;
    } else if (choice==2){
        cout<<affine_decode(s, inverse_a(a), b)<<endl;
    } else {
        cout<<"Invalid choice"<<endl;
    }
}