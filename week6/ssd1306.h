/* 
 * File:   ssd1306.h
 * Author: Arushi Kondaskar
 *
 * Created on June 20, 2025, 6:42 PM
 */

#ifndef SSD1306_H
#define SSD1306_H

#include <stdint.h>

#define SSD1306_ADDRESS 0x3C

void ssd1306_init(void);
void ssd1306_clear(void);
void ssd1306_update(void);
void ssd1306_draw_char(char c, uint8_t x, uint8_t y);
void ssd1306_draw_string(const char* str, uint8_t x, uint8_t y);

#endif


