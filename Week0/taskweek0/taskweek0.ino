
int pot1=A0;
int pot2=A1;
int bz1=3,bz2=4,bz3=5;
int white=8,green=9,yellow=10,orange=11,red=12;
int timer=0,led=0;
void setup()
{
  Serial.begin(9600);
  pinMode(pot1, INPUT);
  pinMode(bz1, OUTPUT);
  pinMode(bz2, OUTPUT);
  pinMode(bz3, OUTPUT);
  
  pinMode(pot2, INPUT);
  pinMode(white, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(orange, OUTPUT);
  pinMode(red, OUTPUT);
  digitalWrite(white, HIGH);
  timer=analogRead(pot2);
}
int time=0;
void loop()
{
  if(time%100==0){
  digitalWrite(bz3,LOW);
  digitalWrite(bz2,LOW);
  digitalWrite(bz1,LOW);
  int fre=analogRead(pot1);
  if(fre<=341){
    digitalWrite(bz1,HIGH);
  }
  else if(fre<=682){
    digitalWrite(bz2,HIGH);
  }
  else{
    digitalWrite(bz3,HIGH);
  }
  }
  if(timer==0){
    timer=analogRead(pot2);
    digitalWrite(led+8,LOW);
    led=(led+1)%5;
    digitalWrite(led+8,HIGH);
  }
  time++;
  timer--;
  if(time>10000)time-=10000;
  delay(1);
}
//https://www.tinkercad.com/things/f5dLJcZCVPw/editel?returnTo=%2Fdashboard