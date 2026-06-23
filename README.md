## 1. Enigma Machine

The **Enigma Machine** was a complex electro-mechanical cipher device used during World War II for secure communication. Its encryption changed with every keystroke because the internal rotors advanced after each input, making the cipher highly dynamic and difficult to break.

### Working Principle
When a key is pressed, the electrical signal passes through multiple stages inside the Enigma Machine before producing the encrypted output. Due to rotor movement after each keypress, the same input letter can map to different output letters over time.

### Main Components
- **Plugboard** – Swaps pairs of letters before and after rotor encryption
- **Rotors** – Perform letter substitution and rotate with each keypress, continuously changing the cipher path
- **Reflector** – Redirects the electrical signal back through the rotors using a different route
- **Rotor Stepping Mechanism** – Advances the rotors after each keypress, ensuring dynamic encryption
- **Reverse Signal Path** – After reflection, the signal travels back through the rotors and plugboard to generate the encrypted letter

### Advantages
- **Dynamic substitution:** The same letter can encrypt differently each time it is pressed
- **Massive keyspace:** The machine had over **10¹¹⁴** possible configurations
- **Strong security for its time:** It was highly resistant to simple frequency analysis techniques

---

## 2. Software-Based Enigma Simulator

The **Software-Based Enigma Simulator** is a digital implementation of the historic Enigma Machine, designed to replicate its encryption and decryption mechanisms while providing an interactive and configurable user experience. The simulator models the complete signal path of the original machine and allows users to experiment with different settings, just like the real Enigma.

### Features
- Full Enigma simulation including **plugboard, rotors, and reflector**
- **User-configurable settings** such as rotor types, rotor starting positions, and plugboard connections
- **GUI implementation** using **JavaScript** and **PySimpleGUI**
- Support for both **encryption and decryption** using the same machine settings
- Ability to **import/export configurations and messages**
- **Modular, object-oriented codebase** for easier maintenance, debugging, and extension
