//tinkercad link https://www.tinkercad.com/things/0wUnoEvlHE6/editel?returnTo=%2Fdashboard%2Fdesigns%2Fcircuits

const int pot1Pin = A0;
const int pot2Pin = A1;

const int buzzer1 = 2;
const int buzzer2 = 3;
const int buzzer3 = 4;

const int ledPins[5] = {5, 6, 7, 8, 9};

void setup() {
  Serial.begin(9600);
  
  pinMode(buzzer1, OUTPUT);
  pinMode(buzzer2, OUTPUT);
  pinMode(buzzer3, OUTPUT);
  
  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  
  int pot1Val = analogRead(pot1Pin);  
  int pot2Val = analogRead(pot2Pin);
  
  digitalWrite(buzzer1, LOW);
  digitalWrite(buzzer2, LOW);
  digitalWrite(buzzer3, LOW);

  if (pot1Val >= 0 && pot1Val <= 341) {
    digitalWrite(buzzer1, HIGH);
  } else if (pot1Val >= 342 && pot1Val <= 682) {
    digitalWrite(buzzer2, HIGH);
  } else if (pot1Val >= 683 && pot1Val <= 1023) {
    digitalWrite(buzzer3, HIGH);
  }


  int delayTime;


 if (pot2Val >= 0 && pot2Val <= 341) {
  delayTime = 100;     
 }

 else if (pot2Val >= 342 && pot2Val <= 682) {
   delayTime = 200;   
 }
 else {  
  delayTime = 300;   
 } 


  for (int i = 0; i < 5; i++) {
      		for (int j = 0; j < 5; j++) {
    		digitalWrite(ledPins[i], LOW);
  				}
    digitalWrite(ledPins[i], HIGH);
    delay(delayTime);
  }
}




