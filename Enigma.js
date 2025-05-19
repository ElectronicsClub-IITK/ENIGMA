import "graphics";
import "EnigmaConstants.js";

/* Main program */
function Enigma() {
    var enigmaImage = new GImage("EnigmaTopView.png");
    var gw = new GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
    gw.add(enigmaImage);
    runEnigmaSimulation(gw);
}

function runEnigmaSimulation(gw) {
    // Create the enigma state object
    var enigma = {
        keys: [],       // Store references to all key objects
        lamps: [],      // Store references to all lamp objects
        currentLamp: null,  // Track currently lit lamp
        rotors: [],     // Store references to all rotor objects
        reflector: REFLECTOR_PERMUTATION
    };
    
    // Create the keyboard keys
    createKeyboard(gw, enigma);
    
    // Create the lamp panel
    createLampPanel(gw, enigma);
    
    // Create the rotors
    createRotors(gw, enigma);
    
    // Add mouse event listeners
    addMouseListeners(gw, enigma);
}

function createKeyboard(gw, enigma) {
    // Loop through all letters A-Z
    for (var i = 0; i < 26; i++) {
        var ch = String.fromCharCode("A".charCodeAt(0) + i);
        var key = createKey(ch);
        var loc = KEY_LOCATIONS[i];
        
        enigma.keys.push(key);
        gw.add(key, loc.x - KEY_RADIUS, loc.y - KEY_RADIUS);
    }
}

function createKey(ch) {
    var compound = new GCompound();
    
    var border = new GOval(0, 0, 2 * KEY_RADIUS, 2 * KEY_RADIUS);
    border.setFilled(true);
    border.setFillColor(KEY_BORDER_COLOR);
    compound.add(border);
    
    var bg = new GOval(KEY_BORDER, KEY_BORDER, 
                      2 * (KEY_RADIUS - KEY_BORDER), 
                      2 * (KEY_RADIUS - KEY_BORDER));
    bg.setFilled(true);
    bg.setFillColor(KEY_BGCOLOR);
    compound.add(bg);
    
    var label = new GLabel(ch);
    label.setFont(KEY_FONT);
    label.setColor(KEY_UP_COLOR);
    
    var x = KEY_RADIUS - label.getWidth() / 2;
    var y = KEY_RADIUS + KEY_LABEL_DY;
    compound.add(label, x, y);
    
    compound.label = label;
    compound.letter = ch;
    
    return compound;
}

function createLampPanel(gw, enigma) {
    for (var i = 0; i < 26; i++) {
        var ch = String.fromCharCode("A".charCodeAt(0) + i);
        var lamp = createLamp(ch);
        var loc = LAMP_LOCATIONS[i];
        
        enigma.lamps.push(lamp);
        gw.add(lamp, loc.x - LAMP_RADIUS, loc.y - LAMP_RADIUS);
    }
}

function createLamp(ch) {
    var compound = new GCompound();
    
    var lamp = new GOval(0, 0, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
    lamp.setFilled(true);
    lamp.setFillColor(LAMP_BGCOLOR);
    lamp.setColor(LAMP_BORDER_COLOR);
    compound.add(lamp);
    
    var label = new GLabel(ch);
    label.setFont(LAMP_FONT);
    label.setColor(LAMP_OFF_COLOR);
    
    var x = LAMP_RADIUS - label.getWidth() / 2;
    var y = LAMP_RADIUS + LAMP_LABEL_DY;
    compound.add(label, x, y);
    
    compound.label = label;
    compound.letter = ch;
    
    return compound;
}

function createRotors(gw, enigma) {
    // Create three rotors (slow, medium, fast)
    for (var i = 0; i < 3; i++) {
        var rotor = createRotor(i);
        var loc = ROTOR_LOCATIONS[i];
        
        // Store rotor in enigma object
        enigma.rotors.push(rotor);
        
        // Add to window
        gw.add(rotor, loc.x - ROTOR_WIDTH/2, loc.y - ROTOR_HEIGHT/2);
    }
}

function createRotor(rotorIndex) {
    var compound = new GCompound();
    
    // Create rotor background rectangle
    var bg = new GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
    bg.setFilled(true);
    bg.setFillColor(ROTOR_BGCOLOR);
    compound.add(bg);
    
    // Create rotor label (initially 'A')
    var label = new GLabel("A");
    label.setFont(ROTOR_FONT);
    label.setColor(ROTOR_COLOR);
    
    // Center the label
    var x = ROTOR_WIDTH/2 - label.getWidth()/2;
    var y = ROTOR_HEIGHT/2 + ROTOR_LABEL_DY;
    compound.add(label, x, y);
    
    // Store important properties
    compound.label = label;
    compound.offset = 0;  // Initial position (A)
    compound.permutation = ROTOR_PERMUTATIONS[rotorIndex];
    compound.inversePermutation = invertKey(ROTOR_PERMUTATIONS[rotorIndex]);
    
    return compound;
}

function invertKey(permutation) {
    var inverse = new Array(26);
    for (var i = 0; i < 26; i++) {
        var currentChar = permutation.charAt(i);
        var index = currentChar.charCodeAt(0) - "A".charCodeAt(0);
        inverse[index] = String.fromCharCode("A".charCodeAt(0) + i);
    }
    return inverse.join("");
}

function applyPermutation(index, permutation, offset, isInverse) {
    // Apply the offset to the input index
    var shiftedIndex = (index + offset) % 26;
    if (shiftedIndex < 0) shiftedIndex += 26;
    
    // Get the permuted character
    var permutedChar = permutation.charAt(shiftedIndex);
    
    // Convert back to index and remove the offset
    var resultIndex = (permutedChar.charCodeAt(0) - "A".charCodeAt(0) - offset);
    if (resultIndex < 0) resultIndex += 26;
    
    return resultIndex % 26;
}

function advanceRotor(rotor) {
    // Increment the offset (wrapping around at 26)
    rotor.offset = (rotor.offset + 1) % 26;
    
    // Update the displayed letter
    var newChar = String.fromCharCode("A".charCodeAt(0) + rotor.offset);
    rotor.label.setLabel(newChar);
    
    // Return true if we wrapped around (for carry)
    return rotor.offset === 0;
}

function advanceRotors(enigma) {
    // Always advance the fast rotor (rightmost)
    var carry = advanceRotor(enigma.rotors[2]);
    
    // Check if medium rotor needs to advance (double-stepping)
    if (carry || enigma.rotors[1].offset === 25) {
        carry = advanceRotor(enigma.rotors[1]);
        
        // Check if slow rotor needs to advance
        if (carry) {
            advanceRotor(enigma.rotors[0]);
        }
    }
}

function encryptLetter(index, enigma) {
    // Advance rotors before encryption (real Enigma behavior)
    advanceRotors(enigma);
    
    // Right to left through fast, medium, then slow rotor
    var result = index;
    
    // Fast rotor (rightmost)
    result = applyPermutation(result, enigma.rotors[2].permutation, enigma.rotors[2].offset, false);
    
    // Medium rotor
    result = applyPermutation(result, enigma.rotors[1].permutation, enigma.rotors[1].offset, false);
    
    // Slow rotor (leftmost)
    result = applyPermutation(result, enigma.rotors[0].permutation, enigma.rotors[0].offset, false);
    
    // Reflector (no offset)
    var reflectedChar = enigma.reflector.charAt(result);
    result = reflectedChar.charCodeAt(0) - "A".charCodeAt(0);
    
    // Left to right back through slow, medium, then fast rotor (using inverse permutations)
    // Slow rotor
    result = applyPermutation(result, enigma.rotors[0].inversePermutation, enigma.rotors[0].offset, true);
    
    // Medium rotor
    result = applyPermutation(result, enigma.rotors[1].inversePermutation, enigma.rotors[1].offset, true);
    
    // Fast rotor
    result = applyPermutation(result, enigma.rotors[2].inversePermutation, enigma.rotors[2].offset, true);
    
    return result;
}

function addMouseListeners(gw, enigma) {
    // Mouse down handler
    var mousedownAction = function(e) {
        var obj = gw.getElementAt(e.getX(), e.getY());
        if (obj !== null && obj.mousedownAction !== undefined) {
            obj.mousedownAction(enigma);
        }
    };
    
    // Mouse up handler
    var mouseupAction = function(e) {
        var obj = gw.getElementAt(e.getX(), e.getY());
        if (obj !== null && obj.mouseupAction !== undefined) {
            obj.mouseupAction(enigma);
        }
    };
    
    // Click handler for rotors
    var clickAction = function(e) {
        var obj = gw.getElementAt(e.getX(), e.getY());
        if (obj !== null && obj.clickAction !== undefined) {
            obj.clickAction(enigma);
        }
    };
    
    // Add event listeners
    gw.addEventListener("mousedown", mousedownAction);
    gw.addEventListener("mouseup", mouseupAction);
    gw.addEventListener("click", clickAction);
    
    // Add action methods to each key
    for (var i = 0; i < enigma.keys.length; i++) {
        var key = enigma.keys[i];
        
        key.mousedownAction = function(enigma) {
            // Change key color to indicate press
            this.label.setColor(KEY_DOWN_COLOR);
            
            // Turn off previously lit lamp if any
            if (enigma.currentLamp !== null) {
                enigma.currentLamp.label.setColor(LAMP_OFF_COLOR);
            }
            
            // Get the index of the pressed key (0-25)
            var keyIndex = this.letter.charCodeAt(0) - "A".charCodeAt(0);
            
            // Encrypt the letter through the full Enigma path
            var lampIndex = encryptLetter(keyIndex, enigma);
            
            // Light up the corresponding lamp
            enigma.currentLamp = enigma.lamps[lampIndex];
            enigma.currentLamp.label.setColor(LAMP_ON_COLOR);
        };
        
        key.mouseupAction = function(enigma) {
            // Change key color back to normal
            this.label.setColor(KEY_UP_COLOR);
        };
    }
    
    // Add click action to rotors
    for (var i = 0; i < enigma.rotors.length; i++) {
        enigma.rotors[i].clickAction = function(enigma) {
            // Advance this rotor when clicked
            advanceRotor(this);
        };
    }
}