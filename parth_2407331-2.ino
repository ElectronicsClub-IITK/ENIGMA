
const int pot1Pin = A0;
const int pot2Pin = A1;

const int buzzerPins[3] = {2, 3, 4};
const int ledPins[5] = {5, 6, 7, 8, 9};

int currentLED = 0;

void setup() {

  for (int i = 0; i < 3; i++) {
    pinMode(buzzerPins[i], OUTPUT);
  }

  
  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {

  int pot1Value = analogRead(pot1Pin);

  
  for (int i = 0; i < 3; i++) {
    digitalWrite(buzzerPins[i], LOW);
  }


  if (pot1Value <= 341) {
    digitalWrite(buzzerPins[0], HIGH);
  } else if (pot1Value <= 682) {
    digitalWrite(buzzerPins[1], HIGH);
  } else {
    digitalWrite(buzzerPins[2], HIGH);
  }


  int pot2Value = analogRead(pot2Pin); 
  int delayTime = map(pot2Value, 0, 1023, 100, 500);

  
  for (int i = 0; i < 5; i++) {
    digitalWrite(ledPins[i], i == currentLED ? HIGH : LOW);
  }

  currentLED = (currentLED + 1) % 5;

  delay(delayTime);
}

//https://www.tinkercad.com/things/5UmRVYgGREp-incredible-stantia-kup/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard%2Fdesigns%2Fcircuits&sharecode=Au6TwuLmppfGQWowT8H5J_qrEWgqyqQofConJueyFPc