int pot1Pin = A0;
int pot2Pin = A1;

int buzzer1 = 2;
int buzzer2 = 3;
int buzzer3 = 4;

int leds[5] = {5, 6, 7, 8, 9};

void setup() {
  pinMode(buzzer1, OUTPUT);
  pinMode(buzzer2, OUTPUT);
  pinMode(buzzer3, OUTPUT);

  for (int i = 0; i < 5; i++) {
    pinMode(leds[i], OUTPUT);
  }

  Serial.begin(9600);
}

void loop() {
  int pot1Value = analogRead(pot1Pin);
  int pot2Value = analogRead(pot2Pin);

  Serial.print("POT.1 (Buzzer): ");
  Serial.print(pot1Value);
  if (pot1Value <= 341) {
    Serial.println("Buzzer 1");
  } else if (pot1Value <= 682) {
    Serial.println("Buzzer 2");
  } else {
    Serial.println("Buzzer 3");
  }
  
  digitalWrite(buzzer1, pot1Value <= 341 ? HIGH : LOW);
  digitalWrite(buzzer2, (pot1Value > 341 && pot1Value <= 682) ? HIGH : LOW);
  digitalWrite(buzzer3, pot1Value > 682 ? HIGH : LOW);

  Serial.print("POT2 (LED): ");
  Serial.print(pot2Value);

  int delayTime = map(pot2Value, 0, 1023, 100, 1000);
  Serial.print(delayTime);
  Serial.println(" ms delay");


  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      digitalWrite(leds[j], j == i ? HIGH : LOW);
    }
    delay(delayTime);
  }
}
//LINk https://www.tinkercad.com/things/6vFHFkAIlQt-mighty-blad
