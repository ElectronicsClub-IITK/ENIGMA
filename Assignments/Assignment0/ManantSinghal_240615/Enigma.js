import "graphics";
import "EnigmaConstants.js";

function Enigma() {
   var enigmaImage = GImage("EnigmaTopView.png");
   var gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
   gw.add(enigmaImage);
   runEnigmaSimulation(gw);
}

function runEnigmaSimulation(gw) {
   var enigma = {
      KEYS: [],
      lamps: [],
      rotors: []
   };

   // Add KEYS and lamps
   for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode("A".charCodeAt(0) + i);
      var center = KEY_LOCATIONS[i];
      var key = createKey(ch);
      key.setLocation(center.x - KEY_RADIUS, center.y - KEY_RADIUS);
      gw.add(key);
      enigma.KEYS.push(key);

      var center2 = LAMP_LOCATIONS[i];
      var lamp = createLamp(ch);
      lamp.setLocation(center2.x - LAMP_RADIUS, center2.y - LAMP_RADIUS);
      gw.add(lamp);
      enigma.lamps.push(lamp);
   }

   // Add rotors
   for (var i = 0; i < 3; i++) {
      var loc = ROTOR_LOCATIONS[i];
      var rotor = createRotor("A");
      rotor.setLocation(loc.x - ROTOR_WIDTH / 2, loc.y - ROTOR_HEIGHT / 2);
      gw.add(rotor);
      enigma.rotors.push(rotor);
   }

   // Mouse event listeners
   gw.addEventListener("mousedown", function (e) {
      var obj = gw.getElementAt(e.getX(), e.getY());
      if (obj !== null && obj.mousedownAction !== undefined) {
         obj.mousedownAction(enigma);
      }
   });

   gw.addEventListener("mouseup", function (e) {
      var obj = gw.getElementAt(e.getX(), e.getY());
      if (obj !== null && obj.mouseupAction !== undefined) {
         obj.mouseupAction(enigma);
      }
   });
}

function createKey(letter) {
   var key = GCompound();
   var border = GOval(0, 0, 2 * KEY_RADIUS, 2 * KEY_RADIUS);
   border.setFilled(true);
   border.setFillColor(KEY_BORDER_COLOR);
   key.add(border);

   var inner = GOval(KEY_BORDER, KEY_BORDER,
      2 * (KEY_RADIUS - KEY_BORDER),
      2 * (KEY_RADIUS - KEY_BORDER));
   inner.setFilled(true);
   inner.setFillColor(KEY_BGCOLOR);
   key.add(inner);

   var label = GLabel(letter);
   label.setFont(KEY_FONT);
   label.setColor(KEY_UP_COLOR);
   label.setLocation(KEY_RADIUS - label.getWidth() / 2,
      KEY_RADIUS + KEY_LABEL_DY);
   key.add(label);

  key.mousedownAction = function(enigma) {
   label.setColor(KEY_DOWN_COLOR);//milestone 2
   advance_rotors(enigma);//milestone 9
   var first = forward(letter, enigma);
   var second = reflector(first);
   var third = backward(second, enigma);
   lamp_on(third, enigma);
};

   key.mouseupAction = function (enigma) {
      label.setColor(KEY_UP_COLOR);
      // Turn off all lamps on key release
      for (var i = 0; i < enigma.lamps.length; i++) {
         enigma.lamps[i].label.setColor(LAMP_OFF_COLOR);
      }
   };

   return key;
}
//MILESTONE 3
function createLamp(letter) {
   var lamp = GCompound();

   var border = GOval(0, 0, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
   border.setFilled(true);
   border.setFillColor(LAMP_BORDER_COLOR);
   lamp.add(border);

   var label = GLabel(letter);
   label.setFont(LAMP_FONT);
   label.setColor(LAMP_OFF_COLOR);
   label.setLocation(LAMP_RADIUS - label.getWidth() / 2,
      LAMP_RADIUS + LAMP_LABEL_DY);
   lamp.add(label);

   lamp.label = label;  // Attach label so you can change color later

   return lamp;
}
//MILESTONE 5
function createRotor(letter) {
   var rotor = GCompound();

   var border = GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
   border.setFilled(true);
   border.setFillColor(ROTOR_BGCOLOR);
   rotor.add(border);

   var label = GLabel(letter);
   label.setFont(ROTOR_FONT);
   label.setColor(ROTOR_COLOR);
   label.setLocation((ROTOR_WIDTH - label.getWidth()) / 2,
      ROTOR_HEIGHT - ROTOR_LABEL_DY+5);//manual positioning
   rotor.add(label);

   rotor.label = label;

   //MILESTONE 6(Clickaction)
   rotor.mouseupAction = function (enigma) {//only mouseup action needed for rotor part
      var current = rotor.label.getLabel();
      var next = String.fromCharCode((current.charCodeAt(0) - 65 + 1) % 26 + 65);
      rotor.label.setLabel(next);
   };

   return rotor;
}

// Basic single rotor encryption function

function reflector(letter) {
   var index = letter.charCodeAt(0) - "A".charCodeAt(0);
   return REFLECTOR_PERMUTATION.charAt(index);
}

function forward(letter, enigma) {
   var index = letter.charCodeAt(0) - "A".charCodeAt(0);
   var mappedChar = "";
   var mappedIndex = 0;

   for (var i = 2; i >= 0; i--) {
      var rotor = ROTOR_PERMUTATIONS[i];

      // Get the rotor offset from the label
      var rotorLetter = enigma.rotors[i].label.getLabel();
      var offset = rotorLetter.charCodeAt(0) - "A".charCodeAt(0);

      var shiftedIndex = (index + offset) % 26;//DOUBT>>rotor.charAt(index+offset))-"A".charCodeAt(offset)
      mappedChar = rotor.charAt(shiftedIndex);
        index = (mappedChar.charCodeAt(0) - "A".charCodeAt(0) - offset + 26) % 26;
   }
   mappedIndex = index;
    return String.fromCharCode(index + "A".charCodeAt(0));
}
// use .indexOf method to find the index which would have been created into the letter during backward encryption (inverse permutations)
//Milestone 7
function backward(letter, enigma) {
   var index = letter.charCodeAt(0) - "A".charCodeAt(0);
   
   for (var i = 0; i < 3; i++) {
      var rotor = ROTOR_PERMUTATIONS[i];
      var rotorLetter = enigma.rotors[i].label.getLabel();
      var offset = rotorLetter.charCodeAt(0) - "A".charCodeAt(0);
      
      // Adjust for offset before finding inverse mapping
      var shiftedIndex = (index + offset) % 26;
      var shiftedChar = String.fromCharCode(shiftedIndex + 65);

      // Inverse lookup: find position where rotor maps to shiftedChar
      var inverseIndex = rotor.indexOf(shiftedChar);

      // Undo the offset
      index = (inverseIndex - offset + 26) % 26;
   }
   return String.fromCharCode(index + 65);
}

//MILESTONE 4
function lamp_on(letter, enigma) {
   var index = letter.charCodeAt(0) - "A".charCodeAt(0);
   var lamp = enigma.lamps[index];

   if (lamp !== undefined && lamp !== null) {
      var label = lamp.label;
      if (label !== undefined && label !== null) {
         label.setColor(LAMP_ON_COLOR);
      }
   } 
   else {
      println("Lamp is missing at index " + index);
   }
}

//MILESTONE 9
function advance_rotors(enigma) {
   var r2 = enigma.rotors[2]; // fast
   var r1 = enigma.rotors[1]; // medium
   var r0 = enigma.rotors[0]; // slow

   // Advance fast rotor
   var fastLetter = r2.label.getLabel();
   var fastNext = String.fromCharCode((fastLetter.charCodeAt(0) - 65 + 1) % 26 + 65);
   r2.label.setLabel(fastNext);

   // If fast rotor wraps from Z → A, step middle
   if (fastLetter === "Z") {
      var midLetter = r1.label.getLabel();
      var midNext = String.fromCharCode((midLetter.charCodeAt(0) - 65 + 1) % 26 + 65);
      r1.label.setLabel(midNext);

      // If middle wraps, step slow
      if (midLetter === "Z") {
         var slowLetter = r0.label.getLabel();
         var slowNext = String.fromCharCode((slowLetter.charCodeAt(0) - 65 + 1) % 26 + 65);
         r0.label.setLabel(slowNext);
      }
   }
}

