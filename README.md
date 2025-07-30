# Project Enigma

**Electronics Club – IIT Kanpur**

---

The project is developed both as a software simulator and a hardware replica, offering insight into classical encryption systems and their implementation.

---

## 1. Introduction to Classical Ciphers

### 1.1 Caesar Cipher

A simple substitution cipher where each letter in the plaintext is shifted by a fixed number (key) of positions.

**Drawbacks:**

- Only 25 possible shifts – vulnerable to brute-force  
- Frequency analysis is easy due to unchanged letter frequency  
- Very small key space  
- Limited to alphabetical input  

---

### 1.2 Affine Cipher

A substitution cipher using the formula:  
`E(x) = (a·x + b) mod 26`, where `x` is the letter index.

**Decryption:**  
`D(x) = a⁻¹(x − b) mod 26`

**Example (a = 5, b = 8):**  
HELLO → RCLLA

**Drawbacks:**

- Limited key space  
- Vulnerable to frequency analysis  
- Susceptible to known-plaintext attacks  

---

### 1.3 Enigma Machine

A complex electro-mechanical cipher machine from WWII. Encryption varies with each keystroke due to rotor advancement.

**Components:**

1. **Plugboard:** Swaps letters  
2. **Rotors:** Substitute and rotate with each keypress  
3. **Reflector:** Sends signal back through rotors  
4. **Rotor Stepping:** Changes encryption path dynamically  
5. **Reversed Path:** Output reprocessed through plugboard  

**Advantages:**

- Dynamic substitution  
- Over 10¹¹⁴ possible configurations  
- Resistant to frequency analysis  

---

## 2. Objectives

### 2.1 Software-Based Enigma Simulator

- Full Enigma simulation: plugboard, rotors, reflector  
- User-configurable settings: rotor types, positions, plugboard  
- GUI implementation using JavaScript and PySimpleGUI  
- Support for encryption/decryption with the same settings  
- Import/export of configurations and messages  
- Modular, object-oriented codebase  

---

### 2.2 Hardware-Based Enigma Replica

- Replica using Arduino Nano/Uno  
- Pushbuttons or keyboard for input  
- Rotor logic with LEDs and motors  
- LCD output to display ciphertext  
- Manual rotor control using rotary encoders  
- Functional plugboard simulated via switches or digital interface  

---

## 3. Online Simulation

Initial inspiration came from a Stanford assignment on simulating the Enigma Machine.

**Assignment Link:**  
[https://web.stanford.edu/class/cs106j/handouts/37-Assignment5.pdf](https://web.stanford.edu/class/cs106j/handouts/37-Assignment5.pdf)

---

## 4. Hardware Implementation

### 4.1 Arduino Microcontroller

- Receives data from PC via serial  
- Executes encryption  
- Displays ciphertext on 16x2 LCD  
- Uses rotary encoder for real-time rotor adjustments  

### 4.2 LCD Display

- I2C/Parallel interface  
- Displays rotor positions and encrypted output  
- Feedback for user actions  

### 4.3 Rotary Encoder

- Rotate to change rotor offsets  
- Push to switch active rotor  
- Updates displayed configuration  

### 4.4 Serial Communication Protocol

*To be defined depending on system design*

### 4.5 Circuit and PCB Design

Includes wiring diagrams and PCB schematics for:

- Rotary Encoder  
- LCD  
- Arduino Connections  

---

## 5. Software Architecture

### 5.1 Protothreads in Embedded Systems

**What are Protothreads?**  
Lightweight, stackless cooperative threads (coroutines) for memory-limited systems.

```c
Thread SerialInputThread:
    PT_BEGIN()
    loop forever:
        PT_WAIT_UNTIL(serialAvailable())
        message = readSerial()
        parseMessage(message)
    PT_END()

Thread EncryptionThread:
    PT_BEGIN()
    loop forever:
        PT_WAIT_UNTIL(newMessageAvailable)
        for each letter in message:
            StepRotors()
            encrypted = EncryptLetter(letter, rotorPositions, plugboard)
            append encrypted to output
    PT_END()

Thread DisplayThread:
    PT_BEGIN()
    loop forever:
        updateLCD(output)
        delay(100 ms)
    PT_END()
```

---

### 5.2 Enigma Logic in C

This section covers the core Enigma encryption process implemented in C.

**Includes:**

- Fixed rotor and reflector wirings  
- Rotor stepping mechanism  
- Plugboard and sketcherboard support  
- Letter-to-index conversions  
- Encryption buffer handling  

```pseudocode
Function EncryptLetter(inputLetter, rotorPositions, plugboardMap):
    // Step 1: Plugboard
    letter = plugboardMap[inputLetter]

    // Step 2: Forward through rotors
    for rotor in rotors (from right to left):
        index = (alphabetIndex(letter) + rotor.position) % 26
        letter = rotor.mapping[index]

    // Step 3: Reflector
    letter = reflectorMap[letter]

    // Step 4: Reverse through rotors
    for rotor in rotors (from left to right):
        index = rotor.mapping.index(letter)
        letter = alphabet[(index - rotor.position + 26) % 26]

    // Step 5: Plugboard again
    letter = plugboardMap[letter]

    return letter
```

```pseudocode
Function StepRotors():
    // Rightmost rotor always steps
    rotor[0].position += 1
    if rotor[0].position == notch[0]:
        rotor[1].position += 1
        if rotor[1].position == notch[1]:
            rotor[2].position += 1
```

---

## Physical Input Interface

### Hardware Options Compared

### 1. Matrix Keypad

**Pros:**
- Direct selection of any letter.
- Easy to implement using libraries (e.g., `Keypad.h`).

**Cons:**
- Requires 6+ pins (more wiring complexity).
- No scrolling support—selection is discrete.
- Requires debounce and matrix scanning logic.

---

### 2. Rotary Encoder

**Pros:**
- Only uses 3 pins.
- Button built-in for rotor switching.

**Cons:**
- Scrolling through 26 letters takes time.
- Requires rotation direction logic and debounce.

---

### 3. Joystick (Final Choice)

**Pros:**
- Smooth analog scrolling using tilt (Y-axis).
- Button click switches rotors.
- Requires only 3 connections (X, Y, button).
- Debouncing mostly handled via analog thresholds.

**Cons:**
- Analog input requires calibration.
- Needs threshold tuning for accuracy.

---

## Alternative Concept: Radial Wheel

An experimental joystick-driven interface inspired by game-style selection wheels.

**Pros:**
- Fast access to any letter.
- Intuitive circular navigation.

**Cons:**
- Requires angle-based letter mapping.
- Hard to implement without visual feedback.

---

## GUI Synchronization Logic

###  Original Issues
- Rotor values shown in the GUI did not always match hardware states.
- Race conditions between GUI and Arduino caused flickers or mismatches.

### Fixes Implemented
- Added flags like `last_sent_offsets` and `last_update_from_gui` to avoid redundant or conflicting updates.
- Shifted to **event-driven communication**:
  - Updates only triggered by hardware input or GUI action.
- Standardized serial protocol: ROT A-B-C, RING X-Y-Z
- GUI parses the incoming message and updates its dropdowns accordingly.
- Outgoing messages are only sent when the user makes a change.

---

## Plugboard Input Bug & Fix

### Problem
- The `encrypt_char()` function used `input()` to request plugboard character pairs, which worked in CLI but broke in GUI.

### Solution
- Plugboard logic moved to `encrypt_message()` for batch configuration.
- GUI popup introduced for entering plugboard configuration interactively.
- Configuration stored for the session and reflected in the GUI display.

---

# XC32 Simulation & Protothread Validation

- **MCU:** PIC32MX250F128B  
- **Tools:** MPLAB X IDE, XC32 Compiler  
- **Libraries:** Protothreads, I2C (SSD1306), UART, Timer2  
- **Display:** SSD1306 OLED (via I2C)

---

## File Structure

- `main.c` – Application logic and protothreads
- `uart_handler.c` – UART RX/TX and parsing
- `oled_display.c` – SSD1306 OLED text rendering
- `pt_cornell_1_3_2.h` – Protothread definitions

---
Enigma Machine Hardware Interface

## Hardware Summary

### Components Mounted on Zero PCB

- **Arduino Nano** – Main controller running encryption and interface logic  
- **2.2" ILI9341 TFT Display** – SPI-driven screen for input/output visualization  
- **Joystick Module** – Used for adjusting rotor and ring settings  
- **Two Tactile Buttons** – Toggle input modes and switch rotors  
---

## TFT Display Integration

- **Driver:** ILI9341 (SPI protocol, 3.3V logic)  
- **Library:** [`Ucglib`](https://github.com/olikraus/ucglib) for fast rendering  
- **Voltage Protection:** SPI lines use voltage dividers to prevent damage  

### UI Layout
- **Left:** User-entered plaintext  
- **Right:** Encrypted output  
- **Middle:** Rotor/ring settings, active rotor, and current input mode  

---

## Input Interface

### Joystick (A0, A1, D2)
- Tilt to scroll rotor/ring values
- Press to confirm/reset (optional behavior)

### Buttons
- **Button 1 (D3):** Toggle between Rotor and Ring modes  
- **Button 2 (D4):** Cycle through Rotor 1 → Rotor 2 → Rotor 3  

### Real-Time Feedback
All inputs are reflected immediately on the TFT, providing:
- Instant visual confirmation  
- Smooth interaction  
- Easier detection of logic/input issues  

---

## Circuit Diagram

![Circuit Diagram](circuitd.png)

**Key Connections:**
- TFT via SPI (MOSI, SCK, CS, DC) with voltage dividers  
- Joystick → A0 (X), A1 (Y), D2 (press)  
- Buttons → D3, D4  
- Power: 5V for Arduino, 3.3V for TFT  

---
Cryptography

## Modern Cryptography

### AES – Advanced Encryption Standard (Symmetric)
- Uses the **same key** for encryption and decryption.

### RSA – Rivest-Shamir-Adleman (Asymmetric)
- Uses a **public/private key pair**.
- Steps:
  1. Select primes \( p \), \( q \)
  2. Compute \( n = pq \), \( \phi(n) = (p-1)(q-1) \)
  3. Choose public key \( e \)
  4. Compute private key \( d = e^{-1} \mod \phi(n) \)
- Used for secure key exchange and digital signatures.

---

## Hardware Implementations

### RSA
- Uses **Montgomery multiplication** and pipelined modular exponentiation.
- Implemented on FPGA/ASIC for performance.

### AES
- Optimized with **ROM-based S-boxes**, **loop unrolling**, and **pipelining**.
- Hardware AES cores provide 5–10× speedup over software.

### Hybrid AES-RSA
- **AES** encrypts the message, **RSA** encrypts the AES key.
- Balances speed and security, ideal for IoT and embedded systems.

---

## Physical-Layer Cryptography

### OFDM-Based Encryption
- Encrypts data across frequency subcarriers.
- Uses **CORDIC** modules for real-time trigonometric ops.
- FPGA implementation offers low-latency protection.

### Physical Security Concepts
- **PUFs (Physical Unclonable Functions)** for device-bound identity.
- **Channel-based keying** uses wireless reciprocity.
- Enhances security using physical randomness.

---

## Enigma and Bombe Cryptanalysis

### Purpose
The **Bombe** machine automated the process of breaking daily Enigma keys during WWII, using logic-based simulations of rotor wirings and plugboard settings.

### Key Components
- **Scramblers**: Simulate Enigma rotors and reflector.
- **Rotor Drums**: Mechanically rotate through 26³ settings.
- **Diagonal Board**: Cross-checks plugboard logic; filters false positives.
- **Test Register**: Flags valid, contradiction-free configurations.

### Crib-Based Search
- A **crib** is a guessed plaintext-ciphertext pair.
- Used to wire scramblers and identify logical loops.
- **Loop-based filtering** and **selective steckering** reduced computation time.
