// Pin Definitions
const int pot1Pin = A0;  // Potentiometer 1 for buzzers
const int pot2Pin = A1;  // Potentiometer 2 for LED speed

const int buzzer1Pin = 2;
const int buzzer2Pin = 3;
const int buzzer3Pin = 4;

const int ledPins[5] = {5, 6, 7, 8, 9};

int currentLED = 0;
unsigned long lastUpdateTime = 0;

void setup() {
  pinMode(buzzer1Pin, OUTPUT);
  pinMode(buzzer2Pin, OUTPUT);
  pinMode(buzzer3Pin, OUTPUT);

  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }
}

void loop() {
  // ---- Potentiometer 1: Buzzer control ----
  int pot1Value = analogRead(pot1Pin);  // Range: 0 - 1023

  digitalWrite(buzzer1Pin, LOW);
  digitalWrite(buzzer2Pin, LOW);
  digitalWrite(buzzer3Pin, LOW);

  if (pot1Value <= 341) {
    digitalWrite(buzzer1Pin, HIGH);
  } else if (pot1Value <= 682) {
    digitalWrite(buzzer2Pin, HIGH);
  } else {
    digitalWrite(buzzer3Pin, HIGH);
  }

  // ---- Potentiometer 2: LED sequence delay ----
  int pot2Value = analogRead(pot2Pin);  // Range: 0 - 1023
  int delayTime = map(pot2Value, 0, 1023, 100, 1000);  // Delay between 100ms and 1000ms

  unsigned long currentTime = millis();
  if (currentTime - lastUpdateTime >= delayTime) {
    updateLEDs();
    lastUpdateTime = currentTime;
  }
}

void updateLEDs() {
  // Turn all LEDs off
  for (int i = 0; i < 5; i++) {
    digitalWrite(ledPins[i], LOW);
  }

  // Light up the current LED
  digitalWrite(ledPins[currentLED], HIGH);

  // Move to the next LED
  currentLED = (currentLED + 1) % 5;
}
//https://www.tinkercad.com/things/j3Iyq8fwZ53/editel
