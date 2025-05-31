/*
 * File: Enigma.js
 * ---------------
 * This program implements a graphical simulation of the Enigma machine.
 */

import "graphics";

const ROTOR_PERMUTATIONS = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",        		/* Permutation for slow rotor     */
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",        		/* Permutation for medium rotor   */
  "BDFHJLCPRTXVZNYEIWGAKMUSQO"         		/* Permutation for fast rotor     */
];

/* Constants that control the display of the current rotor setting */
const ROTOR_BGCOLOR = "#BBAA77";       		/* Background color for the rotor  */
const ROTOR_WIDTH = 24;                		/* Width of the setting indicator  */
const ROTOR_HEIGHT = 26;               		/* Height of the setting indicator */
const ROTOR_COLOR = "Black";           		/* Text color of the rotor         */
const ROTOR_LABEL_DY = 9;              		/* Offset from center to baseline  */
const ROTOR_FONT = "Helvetica Neue-24";


/* This array specifies the coordinates of each rotor display */
const ROTOR_LOCATIONS = [
   { x: 232, y: 82 },
   { x: 317, y: 82 },
   { x: 400, y: 82 }
];


const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";


const KEY_RADIUS = 24;                 		/* Outer radius of a key in pixels */
const KEY_BORDER = 3;                  		/* Width of the key border         */
const KEY_BORDER_COLOR = "#CCCCCC";    		/* Fill color of the key border    */
const KEY_BGCOLOR = "#666666";         		/* Background color of the key     */
const KEY_UP_COLOR = "#CCCCCC";        		/* Text color when the key is up   */
const KEY_DOWN_COLOR = "#CC3333";      		/* Text color when the key is down */
const KEY_LABEL_DY = 10;               		/* Offset from center to baseline  */
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


/* Main program */

function Enigma() {
   var enigmaImage = GImage("EnigmaTopView.png");
   var gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
   gw.add(enigmaImage);
   var keyArr = new Array(26);
   var lampArr = new Array(26);
   var rotArr = new Array(3);
   var enigma = {
			keyArr:keyArr ,
			lampArr: lampArr, 
			rotArr: rotArr
		 };
   runEnigmaSimulation(gw, enigma);
}


function runEnigmaSimulation(gw, enigma) {
   createKeys(gw, enigma);
   createLamps(gw, enigma);
   createRotors(gw, enigma);
}

function createKeys(gw, enigma) {
      for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode("A".charCodeAt(0) + i);

      var point = KEY_LOCATIONS[i];
      var key = createKey(ch);
      key.setLocation(point.x - KEY_RADIUS, point.y - KEY_RADIUS);
      gw.add(key);
      enigma.keys.push(key);
      }
}

function createLamps(gw, enigma) {
     for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode("A".charCodeAt(0) + i);
     var point = LAMP_LOCATIONS[i];
     var lamp = createLamp(ch);
 lamp.setLocation(point.x-LAMP_RADIUS, point.y-LAMP_RADIUS);
     gw.add(lamp);
     enigma.lamps.push(lamp);
     }
}

function createRotors(gw, enigma) {
     for (var i = 0; i < 3; i++) {
      var coord = ROTOR_LOCATIONS[i];
      var rotor = createRotor("A");
      rotor.setLocation(coord.x-ROTOR_WIDTH/2, coord.y-ROTOR_HEIGHT/2);
      gw.add(rotor);
      enigma.rotors.push(rotor);
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
   label.setLocation(KEY_RADIUS - label.getWidth() / 2,
      KEY_RADIUS + KEY_LABEL_DY);
   key.add(label);

   var index = letter.charCodeAt(0) - "A".charCodeAt(0);

  key.mousedownAction = function(enigma) {
   label.setColor(KEY_DOWN_COLOR);
   fwdRotors(enigma);
   lampOn(rotorEncrypt(reflector(rotorEncrypt(letter, enigma, 1)), enigma, 0), enigma);
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

function createLamp(letter) {
   var lamp = GCompound();

   var outer = GOval(0, 0, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
   outer.setFilled(true);
   outer.setFillColor(LAMP_BORDER_COLOR);
   lamp.add(outer);

   var label = GLabel(letter);
   label.setFont(LAMP_FONT);
   label.setColor(LAMP_OFF_COLOR);
   label.setLocation(LAMP_RADIUS - label.getWidth() / 2, LAMP_RADIUS + LAMP_LABEL_DY);
   lamp.add(label);

   lamp.label = label;
   return lamp;
}

function createRotor(letter) {
   var rotor = GCompound();

   var outer = GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
   outer.setFilled(true);
   outer.setFillColor(ROTOR_BGCOLOR);
   rotor.add(outer);

   var label = GLabel(letter);
   label.setFont(ROTOR_FONT);
   label.setColor(ROTOR_COLOR);
   label.setLocation((ROTOR_WIDTH - label.getWidth())/2, ROTOR_HEIGHT-ROTOR_LABEL_DY);
   rotor.add(label);

   rotor.label = label;

   rotor.mouseupAction = function (enigma) {
      var current = rotor.label.getLabel();
      var next = String.fromCharCode((current.charCodeAt(0)-12)%26+65);
      rotor.label.setLabel(next);
   };
   return rotor;
}


/* Following is the code for the actual encryption
 *to implement - forward/backward rotor encryption, reflector
*/

function rotorEncrypt(letter, enigma, dir) {
   var ch = letter.charCodeAt(0) - 65;
   var newChar = "";
   if(dir === 1)
   for (var i = 2; i >= 0; i--) {
      var rotor = ROTOR_PERMUTATIONS[i];

      var rotorLetter = enigma.rotors[i].label.getLabel();
      var off = rotorLetter.charCodeAt(0) - 65;
      var shiftCh = (index + off) % 26;
      newChar = rotor.charAt(shiftCh);
      ch = newChar.charCodeAt(0) - 65;
   }
   else if(dir === 0)
   for (var i = 0; i <= 2; i++) {
      var rotor = ROTOR_PERMUTATIONS[i];

      var rotorLetter = enigma.rotors[i].label.getLabel();
      var off = rotorLetter.charCodeAt(0) - 65;
      var shiftCh = (index + off) % 26;
      newChar = rotor.charAt(shiftCh);
      ch = newChar.charCodeAt(0) - 65;
   }

   return newChar;

}

function reflector(letter) {
   var index= letter.charAtCode(0) - 65;
   var new= REFLECTOR_PERMUTATION.charAt(index);
   return new;
}

fwdRotors()
{
   //forward fast
   var fastLetter = enigma.rotors[2].label.getLabel();
   var fastNext = String.fromCharCode((fastLetter.charCodeAt(0) - 12)%26 + 65);
   enigma.rotors[2].label.setLabel(fastNext);

   //forward middle
   if(fastNext==="A") {
      var midLetter = enigma.rotors[1].label.getLabel();
      var midNext = String.fromCharCode((midLetter.charCodeAt(0) - 12)%26 + 65);
      enigma.rotors[1].label.setLabel(midNext);
   }

   //forward slow
   if(midNext=="A") {
      var slowLetter = enigma.rotors[1].label.getLabel();
      var slowNext = String.fromCharCode((slowLetter.charCodeAt(0) - 12)%26 + 65);
      enigma.rotors[1].label.setLabel(slowNext);
   }
}

function lampOn(letter, enigma) {
   var ch = letter.charCodeAt(0) - 65;
   var label = enigma.lamps[ch].label;     
   label.setColor(LAMP_ON_COLOR);
}






