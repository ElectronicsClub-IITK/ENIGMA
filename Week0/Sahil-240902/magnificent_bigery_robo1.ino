int pot1 = A0;
int pot2 = A1;
int buz1 = 2;
int buz2 = 3;
int buz3 = 4;
int led1 = 8;
int led2 = 9;
int led3 = 10;
int led4 = 11;
int led5 = 12;
unsigned long time=0;
int curled=1;

void setup() {
  Serial.begin(9600);
  pinMode(pot1,INPUT);
  pinMode(pot2,INPUT);
  pinMode(buz1,OUTPUT);
  pinMode(buz2,OUTPUT);
  pinMode(buz3,OUTPUT);
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  pinMode(led3,OUTPUT);
  pinMode(led4,OUTPUT);
  pinMode(led5,OUTPUT);

}

void loop() {
  int x= analogRead(pot1);
  int y= analogRead(pot2);
  y=y*500/1023+50;;
  unsigned long z= millis();
  if(x<342){
  digitalWrite(buz1, HIGH);
  digitalWrite(buz2, LOW);
  digitalWrite(buz3, LOW);
  }
  else if(x<683){
  digitalWrite(buz2, HIGH);
  digitalWrite(buz1, LOW);
  digitalWrite(buz3, LOW);
  }
  else{
  digitalWrite(buz3, HIGH);
  digitalWrite(buz2, LOW);
  digitalWrite(buz1, LOW);
  }
  
  if(z-time>y){
    time=z;
    if(curled==5){
      digitalWrite(led1, HIGH);   
      digitalWrite(led5, LOW); 
      curled=1;
    }
    else if(curled==1){
      digitalWrite(led2, HIGH);   
      digitalWrite(led1, LOW); 
      curled=2;
    }
    else if(curled==2){
      digitalWrite(led3, HIGH);   
      digitalWrite(led2, LOW); 
      curled=3;
    }
    else if(curled==3){
      digitalWrite(led4, HIGH);   
      digitalWrite(led3, LOW); 
      curled=4;
    }
    else if(curled==4){
      digitalWrite(led5, HIGH);   
      digitalWrite(led4, LOW); 
      curled=5;
    }
  }
  
  
  Serial.print(x);
  Serial.print(" ' ");
  Serial.println(y);
  
}


//   https://www.tinkercad.com/things/0tP2L69zihn-magnificent-bigery-robo
