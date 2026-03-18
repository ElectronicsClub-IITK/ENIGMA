#include <LiquidCrystal.h>

// LCD pin connections: RS, E, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

String incomingMessage = "";
bool messageComplete = false;

unsigned long lastScrollTime = 0;
int scrollIndex = 0;
const int scrollDelay = 500;  // milliseconds between scrolls

void setup() {
  lcd.begin(16, 2);
  Serial.begin(9600);
  lcd.print("Waiting...");
}

void loop() {
  // Receive characters until newline
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      messageComplete = true;
      scrollIndex = 0;
      lcd.clear();
      break;
    } else {
      incomingMessage += c;
    }
  }

  // Scroll logic
  if (messageComplete) {
    // Only scroll if message is longer than 32 characters
    if (incomingMessage.length() <= 32) {
      // Just print and stop scrolling
      lcd.setCursor(0, 0);
      lcd.print(incomingMessage.substring(0, min(16, incomingMessage.length())));
      if (incomingMessage.length() > 16) {
        lcd.setCursor(0, 1);
        lcd.print(incomingMessage.substring(16, min(32, incomingMessage.length())));
      }
    } else {
      unsigned long currentTime = millis();
      if (currentTime - lastScrollTime > scrollDelay) {
        lastScrollTime = currentTime;

        // Get 32-character window
        String window = incomingMessage.substring(scrollIndex, scrollIndex + 32);
        lcd.setCursor(0, 0);
        lcd.print(window.substring(0, 16));
        lcd.setCursor(0, 1);
        lcd.print(window.substring(16, 32));

        scrollIndex++;
        if (scrollIndex + 32 > incomingMessage.length()) {
          scrollIndex = 0;  // Restart scrolling
        }
      }
    }
  }
}
