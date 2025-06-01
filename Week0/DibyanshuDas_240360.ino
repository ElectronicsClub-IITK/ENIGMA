// C++ code
//
int buzz1=13;
int buzz2=12;
int buzz3=11;
int buzz=-1;
int potentio1=A0;


int led[5]={6,5,4,3,2};
int lednum=0;
int potentio2=A1;


void setup()
{
  pinMode(buzz1, OUTPUT);
  pinMode(buzz2, OUTPUT);
  pinMode(buzz3, OUTPUT);
  pinMode(potentio1, INPUT);
  
  for (int i=0;i<5;i++){
    pinMode(led[i], OUTPUT);
  }
  pinMode(potentio2, INPUT);
  
  
  Serial.begin(9600);
}

void loop()
{
  // FOR POTENTIOMETER 1
  
  int inp1=(int)(analogRead(potentio1)/341.5);
  if (inp1==0 && buzz!=buzz1){
    digitalWrite(buzz, LOW);
    buzz=buzz1;
  }
  else if (inp1==1 && buzz!=buzz2){
    digitalWrite(buzz, LOW);
    buzz=buzz2;
  }
  else if (inp1==2 && buzz!=buzz3){
    digitalWrite(buzz, LOW);
    buzz=buzz3;
  }
  digitalWrite(buzz, HIGH);
  
  
  // FOR POTENTIOMETER 2
  
  int inp2=analogRead(potentio2)/256;
  int time=pow(6,inp2+1);
  digitalWrite(led[lednum], HIGH);
  delay(50);
  digitalWrite(led[lednum], LOW);
  delay(time);
  lednum++;
  lednum=lednum%5;
  
  
  
  Serial.print(inp1);
  Serial.println(inp2);
  
  
  
  // https://www.tinkercad.com/things/c8tQQKlNmCh-shiny-jaagub-hango?sharecode=MyXXgRLoPboGuc3xK2h-knEAp-Pbb04SrIPC9A3KKFU
}