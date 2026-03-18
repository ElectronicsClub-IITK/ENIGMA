#include "i2c_master.h"

void i2c_master_setup(void) {
    I2C1BRG = 233;              // 100 kHz @ 48 MHz PBCLK
    I2C1CONbits.ON = 1;
}

void i2c_master_start(void) {
    I2C1CONbits.SEN = 1;
    while (I2C1CONbits.SEN);
}

void i2c_master_restart(void) {
    I2C1CONbits.RSEN = 1;
    while (I2C1CONbits.RSEN);
}

void i2c_master_send(uint8_t byte) {
    I2C1TRN = byte;
    while (I2C1STATbits.TRSTAT);
    while (I2C1STATbits.ACKSTAT); // wait for ACK
}

uint8_t i2c_master_recv(void) {
    I2C1CONbits.RCEN = 1;
    while (!I2C1STATbits.RBF);
    return I2C1RCV;
}

void i2c_master_ack(int val) {
    I2C1CONbits.ACKDT = val;
    I2C1CONbits.ACKEN = 1;
    while (I2C1CONbits.ACKEN);
}

void i2c_master_stop(void) {
    I2C1CONbits.PEN = 1;
    while (I2C1CONbits.PEN);
}

