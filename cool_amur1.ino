// C++ code
//
const int pot1Pin = A0;
const int pot2Pin = A1;
const int buzzerPins[3] = {3, 4, 5};        // Buzzer 1, 2, 3
const int ledPins[5] = {6, 7, 8, 9, 10};    // LED sequence
void setup()
{
   for (int i = 0; i < 3; i++) {
    pinMode(buzzerPins[i], OUTPUT);
  }

  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop()
{
  // --- POT1: Buzzer Control ---
  int pot1Value = analogRead(pot1Pin);
  
  // Turn off all buzzers first
  for (int i = 0; i < 3; i++) {
    digitalWrite(buzzerPins[i], LOW);
  }

  // Activate buzzer based on value range
  if (pot1Value <= 341) {
    digitalWrite(buzzerPins[0], HIGH);
  } else if (pot1Value <= 682) {
    digitalWrite(buzzerPins[1], HIGH);
  } else {
    digitalWrite(buzzerPins[2], HIGH);
  }
  
  
  // --- POT2: LED Sequence Speed Control ---
  int pot2Value = analogRead(pot2Pin);
  
  // Map analog value to delay (e.g., 50 to 1000 ms)
  int delayTime = map(pot2Value, 0, 1023, 50, 1000);

  // Light up one LED at a time
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      digitalWrite(ledPins[j], (i == j) ? HIGH : LOW);
    }
    delay(delayTime);
  }
}