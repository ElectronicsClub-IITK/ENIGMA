
const int pot1Pin = A0;
const int pot2Pin = A1; 

const int buzzerPins[] = {8, 9, 10}; 
const int ledPins[] = {2, 3, 4, 5, 6}; 

int currentLED = 0; 

void setup() {
 
  for (int i = 0; i < 3; i++) {
    pinMode(buzzerPins[i], OUTPUT);
    digitalWrite(buzzerPins[i], LOW);
  }

 
  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }
}

void loop() {
  
  int pot1Value = analogRead(pot1Pin); 
  int pot2Value = analogRead(pot2Pin); 

  
  int buzzerIndex = pot1Value / 342; 
  buzzerIndex = constrain(buzzerIndex, 0, 2); 
  
  for (int i = 0; i < 3; i++) {
    digitalWrite(buzzerPins[i], (i == buzzerIndex) ? HIGH : LOW);
  }

  
  int delayTime = map(pot2Value, 0, 1023, 100, 1000);

  
  for (int i = 0; i < 5; i++) {
    digitalWrite(ledPins[i], LOW);
  }

 
  digitalWrite(ledPins[currentLED], HIGH);

  
  currentLED = (currentLED + 1) % 5;

  
  delay(delayTime);
}
//https://www.tinkercad.com/things/3HcXwTzPyIQ/editel?returnTo=%2FdashboardS