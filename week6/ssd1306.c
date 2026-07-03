#include "ssd1306.h"
#include "i2c_master.h"
#include "fonts.h"

#define WIDTH 128
#define HEIGHT 64
#define PAGES (HEIGHT / 8)

uint8_t buffer[WIDTH * PAGES];

static void ssd1306_command(uint8_t cmd) {
    i2c_master_start();
    i2c_master_send((SSD1306_ADDRESS << 1) | 0);
    i2c_master_send(0x00);
    i2c_master_send(cmd);
    i2c_master_stop();
}

void ssd1306_init(void) {
    i2c_master_setup();
    ssd1306_command(0xAE); // Display off
    ssd1306_command(0xA8); ssd1306_command(0x3F);
    ssd1306_command(0xD3); ssd1306_command(0x00);
    ssd1306_command(0x40);
    ssd1306_command(0xA1);
    ssd1306_command(0xC8);
    ssd1306_command(0xDA); ssd1306_command(0x12);
    ssd1306_command(0x81); ssd1306_command(0x7F);
    ssd1306_command(0xA4);
    ssd1306_command(0xA6);
    ssd1306_command(0xD5); ssd1306_command(0x80);
    ssd1306_command(0x8D); ssd1306_command(0x14);
    ssd1306_command(0x20); ssd1306_command(0x00);
    ssd1306_command(0x21); ssd1306_command(0); ssd1306_command(127);
    ssd1306_command(0x22); ssd1306_command(0); ssd1306_command(7);
    ssd1306_command(0xAF); // Display on
}

void ssd1306_clear(void) {
    for (int i = 0; i < sizeof(buffer); i++) {
        buffer[i] = 0;
    }
}

void ssd1306_update(void) {
    for (uint8_t page = 0; page < PAGES; page++) {
        ssd1306_command(0xB0 + page);
        ssd1306_command(0x00);
        ssd1306_command(0x10);

        i2c_master_start();
        i2c_master_send((SSD1306_ADDRESS << 1) | 0);
        i2c_master_send(0x40);

        for (uint8_t col = 0; col < WIDTH; col++) {
            i2c_master_send(buffer[page * WIDTH + col]);
        }

        i2c_master_stop();
    }
}

void ssd1306_draw_char(char c, uint8_t x, uint8_t y) {
    if (c < 32 || c > 127) c = '?';
    for (uint8_t i = 0; i < 5; i++) {
        buffer[x + (y * WIDTH) + i] = font[c - 32][i];
    }
}

void ssd1306_draw_string(const char* str, uint8_t x, uint8_t y) {
    while (*str) {
        ssd1306_draw_char(*str++, x, y);
        x += 6;
    }
}

