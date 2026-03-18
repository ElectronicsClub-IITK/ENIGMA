#include <Wire.h>
#include "Ucglib.h"

// ---------------- OLED Replacement with TFT ----------------
Ucglib_ILI9341_18x240x320_HWSPI ucg(9, 10, 8);  // A0, CS, RESET

// ---------------- Enigma Data ----------------
char rotors[3] = {'A', 'A', 'A'}; // R, M, L
char rings[3] = {'A', 'A', 'A'};  // R, M, L

int currentRotor = 0;
bool wasDown = false;
bool wasPressedRotor = false;
bool wasPressedMode = false;
short y;

bool offsetMode = true; // true = Offset mode, false = Ring mode

String lastMessage = "";
String lastEncrypted = "";
// ---------------- Message Parser ----------------
void parseEncryptedMessage(String input) {
  int msgIndex = input.indexOf("MSG:");
  int encIndex = input.indexOf("|ENC:");
  if (msgIndex != -1 && encIndex != -1) {
    lastMessage = input.substring(msgIndex + 4, encIndex);
    lastEncrypted = input.substring(encIndex + 5);
  }
}

bool isAlpha(char c) {
  return (c >= 'A' && c <= 'Z');
}


// ---------------- Display Update ----------------
void updateTFTStatus(){
  ucg.setFont(ucg_font_7x14_mr);
  
  //Left (Original)
  ucg.setColor(0,255,255);
  ucg.setPrintPos(10, 30); ucg.print("Originial Text:");
  ucg.setPrintPos(10, 60); ucg.print(lastMessage);
  //Right (Encrypted)
  ucg.setPrintPos(230, 30); ucg.print("Encrypted:");
  ucg.setPrintPos(230, 60); ucg.print(lastEncrypted);

  // --- Middle: Rotor Info ---
  ucg.setPrintPos(100, 80); ucg.print("ROTOR");
  ucg.setPrintPos(140, 80); ucg.print("OFFSET");
  ucg.setPrintPos(190, 80); ucg.print("RING");
  
  ucg.setPrintPos(110, 110); ucg.print("1");
  ucg.setPrintPos(110, 140); ucg.print("2");
  ucg.setPrintPos(110, 170); ucg.print("3");

  ucg.setPrintPos(150, 110); ucg.print(rotors[0]);
  ucg.setPrintPos(150, 140); ucg.print(rotors[1]);
  ucg.setPrintPos(150, 170); ucg.print(rotors[2]);

  ucg.setPrintPos(200, 110); ucg.print(rings[0]);
  ucg.setPrintPos(200, 140); ucg.print(rings[1]);
  ucg.setPrintPos(200, 170); ucg.print(rings[2]);

  
  // --- Serial Feedback ---
  Serial.print("ROT:");
  Serial.print(rotors[0]); Serial.print("-");
  Serial.print(rotors[1]); Serial.print("-");
  Serial.print(rotors[2]);
  Serial.print("|RING:");
  Serial.print(rings[0]); Serial.print("-");
  Serial.print(rings[1]); Serial.print("-");
  Serial.println(rings[2]);

  // Mode Display
  ucg.setPrintPos(120, 200);
  ucg.setColor(255, 255, 0);
  ucg.print("Mode: ");
  ucg.print(offsetMode ? "OFFSET" : "RING");

  ucg.setPrintPos(120, 220);
  ucg.print("Rotor #: ");
  ucg.print(currentRotor + 1);

  //Serial Debug Info
  if(Serial.available()){
    Serial.print("ROT:");
    Serial.print(rotors[0]); Serial.print("-");
    Serial.print(rotors[1]); Serial.print("-");
    Serial.print(rotors[2]);
    Serial.print(" | RING:");
    Serial.print(rings[0]); Serial.print("-");
    Serial.print(rings[1]); Serial.print("-");
    Serial.print(rings[2]);
    Serial.print(" | Mode: ");
    Serial.print(offsetMode ? "OFFSET " : "RINGSET");
    Serial.print(" | Index: ");
    Serial.println(currentRotor+1);
  }
}

void setDesign(){
  ucg.clearScreen();
  ucg.setRotate90(); // Landscape mode
  //Left box
  ucg.setColor(255, 55, 25);
  ucg.drawBox(0, 0, 100, 240);
  
  //Right box
  ucg.setColor(0,255,255);
  ucg.drawBox(220, 0, 100, 239);
}

void setup() {
    pinMode(6, INPUT_PULLUP); // Button to switch rotor/ring index
    pinMode(4, INPUT_PULLUP); // Button to switch between modes
    pinMode(A7, INPUT);       // Joystick Y-axis
  Serial.begin(9600);

  // --- TFT Setup ---
  ucg.begin(UCG_FONT_MODE_SOLID);
   setDesign();
}

 void loop() { 
  
  updateTFTStatus();
  y = analogRead(A7);
  if (y >= 400 && y <= 680) {
    wasDown = false;
  }
  bool rotorBtn = digitalRead(6);
  bool modeBtn  = digitalRead(4);
  Serial.println(rotorBtn);
  if(rotorBtn==LOW){
    currentRotor=(currentRotor+1)%3;updateTFTStatus();
  }
  if(modeBtn==LOW){
    offsetMode=!offsetMode;updateTFTStatus();
   
  }
  // --- Joystick Movement ---
  if (y < 400 && !wasDown) {
    wasDown = true;
    if (offsetMode) {
      rotors[currentRotor]++;
      if (rotors[currentRotor] > 'Z') rotors[currentRotor] = 'A';
    } else {
      rings[currentRotor]++;
      if (rings[currentRotor] > 'Z') rings[currentRotor] = 'A';
    }
    updateTFTStatus();
   
  } else if (y > 680 && !wasDown) {
    wasDown = true;
    if (offsetMode) {
      rotors[currentRotor]--;
      if (rotors[currentRotor] < 'A') rotors[currentRotor] = 'Z';
    } else {
      rings[currentRotor]--;
      if (rings[currentRotor] < 'A') rings[currentRotor] = 'Z';
    }
    updateTFTStatus();
     
  }

  // --- Serial Input ---
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input.startsWith("ROT:") && input.indexOf("|RING:") != -1) {
      int ringIndex = input.indexOf("|RING:");
      String rotStr = input.substring(4, ringIndex);
      String ringStr = input.substring(ringIndex + 6);

      if (rotStr.length() == 5 && ringStr.length() == 5 &&
          rotStr.charAt(1) == '-' && rotStr.charAt(3) == '-' &&
          ringStr.charAt(1) == '-' && ringStr.charAt(3) == '-') {

        char r = rotStr.charAt(0);
        char m = rotStr.charAt(2);
        char l = rotStr.charAt(4);
        char rr = ringStr.charAt(0);
        char rm = ringStr.charAt(2);
        char rl = ringStr.charAt(4);

        if (isAlpha(r) && isAlpha(m) && isAlpha(l) &&
            isAlpha(rr) && isAlpha(rm) && isAlpha(rl)) {
          rotors[0] = r; rotors[1] = m; rotors[2] = l;
          rings[0] = rr; rings[1] = rm; rings[2] = rl;
          updateTFTStatus();
        }
      }
    } else if (input.length() == 5 && input.charAt(1) == '-' && input.charAt(3) == '-') {
      char r = input.charAt(0);
      char m = input.charAt(2);
      char l = input.charAt(4);
      if (isAlpha(r) && isAlpha(m) && isAlpha(l)) {
        rotors[0] = r; rotors[1] = m; rotors[2] = l;
        updateTFTStatus();
      }
    } else if (input.indexOf("MSG:") != -1 && input.indexOf("|ENC:") != -1) {
      parseEncryptedMessage(input);
      updateTFTStatus();
    }
  }
}