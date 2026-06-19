#include <xc.h>
#include "pt_cornell_1_3_2.h"

// Configuration bits for PIC32MX250F128B (adjust if needed)
#pragma config FPLLMUL = MUL_20, FPLLIDIV = DIV_2, FPLLODIV = DIV_2
#pragma config FNOSC = PRIPLL, FPBDIV = DIV_1
#pragma config FWDTEN = OFF, POSCMOD = XT

// System clock
#define SYS_FREQ 40000000L

static struct pt pt_led, pt_uart;
volatile unsigned int ms_count = 0;

// Timer2 ISR: 1ms system tick
void __ISR(_TIMER_2_VECTOR, IPL2SOFT) Timer2Handler(void) {
    ms_count++;
    IFS0bits.T2IF = 0; // Clear interrupt flag
}

// Protothread: Blink LED every 500ms
PT_THREAD (protothread_led(struct pt *pt)) {
    PT_BEGIN(pt);
    while(1) {
        LATAbits.LATA0 = !LATAbits.LATA0;
        PT_YIELD_TIME_msec(500);
    }
    PT_END(pt);
}

// Protothread: Print to UART every 1000ms
PT_THREAD (protothread_uart(struct pt *pt)) {
    PT_BEGIN(pt);
    while(1) {
        PT_YIELD_TIME_msec(1000);
        putsUART1("Hello from Protothread!\r\n");
    }
    PT_END(pt);
}

int main(void) {
    // Set up LED pin (RA0)
    TRISAbits.TRISA0 = 0;
    LATAbits.LATA0 = 0;

    // Set up UART1: 115200 baud, 8N1
    U1MODE = 0;
    U1BRG = (SYS_FREQ/16/115200)-1;
    U1STA = 0;
    U1MODESET = 0x8000; // Enable UART
    U1STASET = 0x1400;  // Enable TX, RX

    // Set up Timer2 for 1ms tick
    T2CON = 0;
    TMR2 = 0;
    PR2 = SYS_FREQ/1000-1; // 1 ms period
    T2CONSET = 0x8000; // Turn on Timer2
    IPC2bits.T2IP = 2; // Priority
    IFS0bits.T2IF = 0;
    IEC0bits.T2IE = 1;

    // Initialize protothreads
    PT_INIT(&pt_led);
    PT_INIT(&pt_uart);

    INTEnableSystemMultiVectoredInt();

    while(1) {
        PT_SCHEDULE(protothread_led(&pt_led));
        PT_SCHEDULE(protothread_uart(&pt_uart));
    }
}
