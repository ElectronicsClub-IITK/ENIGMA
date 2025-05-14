int pot1 = A0;
int pot2 = A1;

int buzz[] = {2, 3, 4};

int led[] = {5, 6, 7, 8, 9};
int ledIndex = 0;



void setup() {
  // put your setup code here, to run once:
  for (int i = 0; i < 3; i++){
    pinMode(buzz[i], OUTPUT);
  }

  for (int i = 0; i < 5; i++){
    pinMode(led[i], OUTPUT);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  int pot1Value = analogRead(pot1);

  digitalWrite(buzz[0],LOW);
  digitalWrite(buzz[1],LOW);
  digitalWrite(buzz[2],LOW);

  if ((pot1Value >= 0) && (pot1Value <= 341)){
    digitalWrite(buzz[0],HIGH);
  }
  else if ((pot1Value >= 342) && (pot1Value <= 683)){
    digitalWrite(buzz[1],HIGH);
  }
  else if ((pot1Value >= 684) && (pot1Value <= 1023)){
    digitalWrite(buzz[2],HIGH);
  }
  
  int pot2Value = analogRead(pot2);
  int delayTime = map(pot2, 0, 1023, 100, 1000);

  for (int i = 0; i < 5 ; i++){
    digitalWrite(led[i],LOW);
    digitalWrite(led[ledIndex],HIGH);
    ledIndex = (ledIndex + 1) % 5;

    delay(delayTime);
  }






}
//tinkercad project link
//https://www.tinkercad.com/things/6N1AsLUWFnk-terrific-jaban-gaaris/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard&sharecode=Ad3gkpanl1spBJenS_Mh0FzlA8VIh5IesDCnTnGOw-U