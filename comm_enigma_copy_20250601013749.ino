#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); 
int cursor_pos = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.clear();
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();


    if (c == '\n' || c == '\r') return;

    lcd.setCursor(cursor_pos % 16, cursor_pos / 16);
    lcd.print(c);
    cursor_pos++;

    if (cursor_pos >= 32) { 
      delay(2000);       
      lcd.clear();
      cursor_pos = 0;
    }
  }
}