/*
 * File: EnigmaConstants.js
 * ------------------------
 * This file defines the constants used in the Enigma simulator.
 */

/*
 * The early German Enigma machines include three rotors, which advance
 * at different speeds.  The rotor on the right is the "fast" rotor,
 * which advances on every keystroke.  The rotor in the middle is the
 * "medium" rotor, which advances when the fast rotor has made a
 * complete revolution.  The rotor at the left is the "slow" rotor,
 * which advances when the medium rotor has made a complete cycle.
 * The ROTOR_PERMUTATION array lists the three rotors from left to
 * right: the slow rotor, the medium rotor, and the fast rotor.
 *
 * Each rotor implements a letter-substitution cipher, which is
 * represented by a string of 26 uppercase letters that shows how
 * the letters in the alphabet are mapped to new letters as the
 * internal signal flows across the rotor from right to left.  For
 * example, the slow rotor corresponds to the following mapping
 * when it is in its initial position:
 *
 *    A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
 *    | | | | | | | | | | | | | | | | | | | | | | | | | |
 *    E K M F L G D Q V Z N T O W Y H X U S P A I B R C J
 */

const ROTOR_PERMUTATIONS = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",        /* Permutation for slow rotor      */
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",        /* Permutation for medium rotor    */
    "BDFHJLCPRTXVZNYEIWGAKMUSQO"         /* Permutation for fast rotor      */
  ];
  
  /* Constants that control the display of the current rotor setting */
  
  const ROTOR_BGCOLOR = "#BBAA77";       /* Background color for the rotor  */
  const ROTOR_WIDTH = 24;                /* Width of the setting indicator  */
  const ROTOR_HEIGHT = 26;               /* Height of the setting indicator */
  const ROTOR_COLOR = "Black";           /* Text color of the rotor         */
  const ROTOR_LABEL_DY = 9;              /* Offset from center to baseline  */
  const ROTOR_FONT = "Helvetica Neue-24";
  
  /* This array specifies the coordinates of each rotor display */
  
  const ROTOR_LOCATIONS = [
     { x: 244, y: 95 },
     { x: 329, y: 95 },
     { x: 412, y: 95 }
  ];
  
  /*
   * To the left of the slow rotor, the Enigma machine includes a
   * component called the "reflector," which implements a fixed
   * permutation that remains unchanged as the rotors advance.  The
   * constant REFLECTOR_PERMUTATION defines the mapping of the reflector.
   * Note that the reflector is symmetric.  If A is transformed to I,
   * then I is transformed to A.
   */
  
  const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";
  
  /* Constants that define the keys on the Enigma keyboard */
  
  const KEY_RADIUS = 24;                 /* Outer radius of a key in pixels */
  const KEY_BORDER = 3;                  /* Width of the key border         */
  const KEY_BORDER_COLOR = "#CCCCCC";    /* Fill color of the key border    */
  const KEY_BGCOLOR = "#666666";         /* Background color of the key     */
  const KEY_UP_COLOR = "#CCCCCC";        /* Text color when the key is up   */
  const KEY_DOWN_COLOR = "#CC3333";      /* Text color when the key is down */
  const KEY_LABEL_DY = 10;               /* Offset from center to baseline  */
  const KEY_FONT = "Helvetica Neue-Bold-28";
  
  /* This array determines the coordinates of a key for each letter index */
  
  const KEY_LOCATIONS = [
     { x: 140, y: 566 } /* A */,
     { x: 471, y: 640 } /* B */,
     { x: 319, y: 639 } /* C */,
     { x: 294, y: 567 } /* D */,
     { x: 268, y: 495 } /* E */,
     { x: 371, y: 567 } /* F */,
     { x: 448, y: 567 } /* G */,
     { x: 523, y: 567 } /* H */,
     { x: 650, y: 496 } /* I */,
     { x: 598, y: 567 } /* J */,
     { x: 674, y: 567 } /* K */,
     { x: 699, y: 641 } /* L */,
     { x: 624, y: 641 } /* M */,
     { x: 547, y: 640 } /* N */,
     { x: 725, y: 497 } /* O */,
     { x:  92, y: 639 } /* P */,
     { x: 115, y: 494 } /* Q */,
     { x: 345, y: 495 } /* R */,
     { x: 217, y: 566 } /* S */,
     { x: 420, y: 496 } /* T */,
     { x: 574, y: 496 } /* U */,
     { x: 395, y: 639 } /* V */,
     { x: 192, y: 494 } /* W */,
     { x: 242, y: 639 } /* X */,
     { x: 168, y: 639 } /* Y */,
     { x: 497, y: 496 } /* Z */
  ];
  
  /* Constants that define the lamps above the Enigma keyboard */
  
  const LAMP_RADIUS = 23;                /* Radius of a lamp in pixels      */
  const LAMP_BORDER_COLOR = "#111111";   /* Line color of the lamp border   */
  const LAMP_BGCOLOR = "#333333";        /* Background color of the lamp    */
  const LAMP_OFF_COLOR = "#666666";      /* Text color when the lamp is off */
  const LAMP_ON_COLOR = "#FFFF99";       /* Text color when the lamp is on  */
  const LAMP_LABEL_DY = 9;               /* Offset from center to baseline  */
  const LAMP_FONT = "Helvetica Neue-Bold-24";
  
  /* This array determines the coordinates of a lamp for each letter index */
  
  const LAMP_LOCATIONS = [
     { x: 144, y: 332 } /* A */,
     { x: 472, y: 403 } /* B */,
     { x: 321, y: 402 } /* C */,
     { x: 296, y: 333 } /* D */,
     { x: 272, y: 265 } /* E */,
     { x: 372, y: 333 } /* F */,
     { x: 448, y: 334 } /* G */,
     { x: 524, y: 334 } /* H */,
     { x: 650, y: 266 } /* I */,
     { x: 600, y: 335 } /* J */,
     { x: 676, y: 335 } /* K */,
     { x: 700, y: 403 } /* L */,
     { x: 624, y: 403 } /* M */,
     { x: 549, y: 403 } /* N */,
     { x: 725, y: 267 } /* O */,
     { x:  94, y: 401 } /* P */,
     { x: 121, y: 264 } /* Q */,
     { x: 347, y: 265 } /* R */,
     { x: 220, y: 332 } /* S */,
     { x: 423, y: 265 } /* T */,
     { x: 574, y: 266 } /* U */,
     { x: 397, y: 402 } /* V */,
     { x: 197, y: 264 } /* W */,
     { x: 246, y: 402 } /* X */,
     { x: 170, y: 401 } /* Y */,
     { x: 499, y: 265 } /* Z */
  ];

import "graphics";

  function Enigma() {
    const enigmaImage = GImage("EnigmaTopView.png");
    const gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
    gw.add(enigmaImage);
    runEnigmaSimulation(gw);
 }
 

function runEnigmaSimulation(gw) {
   var enigma = {
      keys: [],
      lamps: [],
      rotors: []
   };

   enigma.rotorOffsets = [0, 0, 0]; // [slow, medium, fast]

   createKeys(gw, enigma);
   createLamps(gw, enigma);
   createRotors(gw, enigma);

   gw.addEventListener("mousedown", function (e) {
      var obj = gw.getElementAt(e.getX(), e.getY());
      if (obj && obj.mousedownAction) {
         obj.mousedownAction(enigma);
      }
   });

   gw.addEventListener("mouseup", function (e) {
      var obj = gw.getElementAt(e.getX(), e.getY());
      if (obj && obj.mouseupAction) {
         obj.mouseupAction(enigma);
      }
   });
}
 
 function createKeys(gw, enigma) {
    for (var i = 0; i < 26; i++) {
       var ch = String.fromCharCode("A".charCodeAt(0) + i);
       var center = KEY_LOCATIONS[i];
 
       var key = createKey(ch);
       key.setLocation(center.x - KEY_RADIUS, center.y - KEY_RADIUS);
       gw.add(key);
       enigma.keys.push(key);
    }
 }
 
 function createKey(letter) {
    var key = GCompound();
 
    var outer = GOval(0, 0, 2 * KEY_RADIUS, 2 * KEY_RADIUS);
    outer.setFilled(true);
    outer.setFillColor(KEY_BORDER_COLOR);
    key.add(outer);
 
    var inner = GOval(KEY_BORDER, KEY_BORDER,
       2 * (KEY_RADIUS - KEY_BORDER),
       2 * (KEY_RADIUS - KEY_BORDER));
    inner.setFilled(true);
    inner.setFillColor(KEY_BGCOLOR);
    key.add(inner);
 
    var label = GLabel(letter);
    label.setFont(KEY_FONT);
    label.setColor(KEY_UP_COLOR);
    label.setLocation(KEY_RADIUS - label.getWidth() / 2, KEY_RADIUS + KEY_LABEL_DY);
    key.add(label);
 
    
    key.mousedownAction = function (enigma) {
       label.setColor(KEY_DOWN_COLOR);
    };

    key.mouseupAction = function (enigma) {
      label.setColor(KEY_UP_COLOR);
      
      // Encrypt the letter
      const inputIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);
      const outputIndex = encrypt(letter, enigma);

      // Light the corresponding lamp
      enigma.lamps[outputIndex].label.setColor(LAMP_ON_COLOR);

      // Turn off the lamp after a short delay
     // Turn off the lamp after a short delay
setTimeout(function() {
  enigma.lamps[outputIndex].label.setColor(LAMP_OFF_COLOR);
}, 500);


      // Rotate the rotors
      rotateRotors(enigma);
    };
 
    return key;
 }


function createLamps(gw, enigma) {
   for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode("A".charCodeAt(0) + i);
      var center = LAMP_LOCATIONS[i];

      var lamp = GCompound();
      var oval = GOval(0, 0, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
      oval.setFilled(true);
      oval.setFillColor(LAMP_BGCOLOR);
      oval.setColor(LAMP_BORDER_COLOR);
      lamp.add(oval);

      var label = GLabel(ch);
      label.setFont(LAMP_FONT);
      label.setColor(LAMP_OFF_COLOR);
      label.setLocation(LAMP_RADIUS - label.getWidth() / 2, LAMP_RADIUS + LAMP_LABEL_DY);
      lamp.add(label);
      lamp.label = label;

      lamp.setLocation(center.x - LAMP_RADIUS, center.y - LAMP_RADIUS);
      gw.add(lamp);
      enigma.lamps.push(lamp);
   }
}

function createRotors(gw, enigma) {
  for (var i = 0; i < 3; i++) {
    const rotor = GCompound();
    rotor.permutation = ROTOR_PERMUTATIONS[i];
    rotor.offset = 0;
	 var location = {
  x: -0.5 * ROTOR_LOCATIONS[i].x,
  y: -0.5 * ROTOR_LOCATIONS[i].y
};

    const rect = GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
    rect.setFilled(true);
    rect.setFillColor(ROTOR_BGCOLOR);
    rotor.add(rect);

    const label = GLabel("A");
    label.setFont(ROTOR_FONT);
    label.setColor(ROTOR_COLOR);
    label.setLocation(
      ROTOR_WIDTH / 2 - label.getWidth() / 2,
      ROTOR_HEIGHT / 2 + ROTOR_LABEL_DY
    );
    rotor.add(label);
    rotor.label = label;

    rotor.setLocation(location.x, location.y);

    rotor.clickAction = function () {
      advanceRotor(rotor);
    };

    gw.add(rotor);
    enigma.rotors.push(rotor);
  }

  gw.addEventListener("click", function (e) {
    const obj = gw.getElementAt(e.getX(), e.getY());
    if (obj && obj.clickAction) {
      obj.clickAction();
    }
  });
}

function advanceRotor(rotor) {
  rotor.offset = (rotor.offset + 1) % 26;
  const newChar = String.fromCharCode("A".charCodeAt(0) + rotor.offset);
  rotor.label.setLabel(newChar);
  return rotor.offset === 0;
}
function applyPermutation(index, permutation, offset) {
    index = (index + offset) % 26;
    var outputIndex = permutation.charCodeAt(index) - 'A'.charCodeAt(0);
    outputIndex = (outputIndex - offset + 26) % 26;
    return outputIndex;
  }

function invertkey(permutation) {
    var inverse = new Array(26).fill('');
    for (var i = 0; i < permutation.length; i++) {
      var inverted = permutation[i];
      var index = (inverted.charCodeAt(0) - 'A'.charCodeAt(0) + 26) % 26;
      inverse[index] = String.fromCharCode(i + 'A'.charCodeAt(0));
    }
    return inverse.join('');
  }

function encrypt(letter, enigma) {
  var index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
  var slow   = ROTOR_PERMUTATIONS[0];
	var medium = ROTOR_PERMUTATIONS[1];
	var fast   = ROTOR_PERMUTATIONS[2];
var sOffset = enigma.rotorOffsets[0];
var mOffset = enigma.rotorOffsets[1];
var fOffset = enigma.rotorOffsets[2];


  // Forward through rotors (right to left)
  var i = applyPermutation(index, fast, fOffset);
  i = applyPermutation(i, medium, mOffset);
  i = applyPermutation(i, slow, sOffset);

  // Reflector
  var reflected = REFLECTOR_PERMUTATION.charCodeAt(i) - 'A'.charCodeAt(0);

  // Backward through rotors (left to right)
  i = applyPermutation(reflected, invertkey(slow), sOffset);
  i = applyPermutation(i, invertkey(medium), mOffset);
  i = applyPermutation(i, invertkey(fast), fOffset);

  return i;
}

function rotateRotors(enigma) {
  const fastRotor = enigma.rotors[2];
  const mediumRotor = enigma.rotors[1];
  const slowRotor = enigma.rotors[0];

  const carryFast = advanceRotor(fastRotor);
  if (carryFast) {
    const carryMedium = advanceRotor(mediumRotor);
    if (carryMedium) {
      advanceRotor(slowRotor);
    }
  }

  // Update enigma.rotorOffsets to match visible rotor states
  enigma.rotorOffsets[0] = slowRotor.offset;
  enigma.rotorOffsets[1] = mediumRotor.offset;
  enigma.rotorOffsets[2] = fastRotor.offset;
}