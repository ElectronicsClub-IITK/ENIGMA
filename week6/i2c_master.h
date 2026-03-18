/* 
 * File:   i2c_master.h
 * Author: Arushi Kondaskar
 *
 * Created on June 20, 2025, 6:41 PM
 */

#ifndef I2C_MASTER_H
#define I2C_MASTER_H

#include <xc.h>
#include <stdint.h>

void i2c_master_setup(void);
void i2c_master_start(void);
void i2c_master_restart(void);
void i2c_master_send(uint8_t byte);
uint8_t i2c_master_recv(void);
void i2c_master_ack(int val);
void i2c_master_stop(void);

#endif


