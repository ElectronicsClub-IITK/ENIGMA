#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// OLED Config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

char rotors[3] = {'A', 'A', 'A'};
int currentRotor = 0; 
bool wasDown = false;
bool wasPressed = false;          
short y;

String lastMessage = "";
String lastEncrypted = "";

void setup() {
  pinMode(3, INPUT_PULLUP);     // Button to switch rotor
  pinMode(A2, INPUT);           // Joystick vertical input
  Serial.begin(9600);

  // OLED init
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    while (true); // OLED init failed
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  rotor_status();
}

void loop() {
  y = analogRead(A2);
  bool buttonState = digitalRead(3);

  // ---- Joystick rotor offset adjustment ----
  if (y < 400 && !wasDown) {
    wasDown = true;
    rotors[currentRotor]++;
    if (rotors[currentRotor] > 'Z') rotors[currentRotor] = 'A';
    rotor_status();
  } 
  else if (y > 680 && !wasDown) {
    wasDown = true;
    rotors[currentRotor]--;
    if (rotors[currentRotor] < 'A') rotors[currentRotor] = 'Z';
    rotor_status();
  } 
  if (y >= 400 && y <= 680) {
    wasDown = false;
  }

  // ---- Button press to change rotor ----
  if (buttonState == LOW && !wasPressed) {
    wasPressed = true;
    currentRotor++;
    if (currentRotor > 2) currentRotor = 0;
    Serial.print("Switched to Rotor ");
    Serial.println(currentRotor + 1);
  }
  if (buttonState == HIGH) {
    wasPressed = false;
  }

  // ---- Serial input from Python ----
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    
    if (input.length() == 5 && input.charAt(1) == '-' && input.charAt(3) == '-') {
      // Format: A-B-C (rotor values from GUI)
      char r = input.charAt(0);
      char m = input.charAt(2);
      char l = input.charAt(4);
      if (isAlpha(r) && isAlpha(m) && isAlpha(l)) {
        rotors[0] = r;
        rotors[1] = m;
        rotors[2] = l;
        rotor_status();
      }
    } else if (input.indexOf(":") != -1) {
      // Format: MSG:HELLO|ENC:ABCDX
      parseEncryptedMessage(input);
      display_all();  // Show everything on OLED
    }
  }

  delay(200);
}

void rotor_status() {
  Serial.print(rotors[0]);
  Serial.print("-");
  Serial.print(rotors[1]);
  Serial.print("-");
  Serial.println(rotors[2]);
  display_all();
}

void parseEncryptedMessage(String input) {
  int msgIndex = input.indexOf("MSG:");
  int encIndex = input.indexOf("|ENC:");
  
  if (msgIndex != -1 && encIndex != -1) {
    lastMessage = input.substring(msgIndex + 4, encIndex);
    lastEncrypted = input.substring(encIndex + 5);
  }
}

void display_all() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("Rotor: ");
  display.print(rotors[0]); display.print("-");
  display.print(rotors[1]); display.print("-");
  display.println(rotors[2]);

  display.println("Msg: " + lastMessage);
  display.println("Enc: " + lastEncrypted);
  display.display();
}

bool isAlpha(char c) {
  return (c >= 'A' && c <= 'Z');
}
