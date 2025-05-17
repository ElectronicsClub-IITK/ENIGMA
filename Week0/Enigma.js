/*
 * File: Enigma.js
 * ---------------
 * This program implements a graphical simulation of the Enigma machine.
 */

import "graphics";
import "EnigmaConstants.js";

/* Main program */

function Enigma() {
   var enigmaImage = GImage("EnigmaTopView.png");
   var gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
   gw.add(enigmaImage);
   runEnigmaSimulation(gw);
}

// You are responsible for filling in the rest of the code.  Your
// implementation of runEnigmaSimulation should perform the
// following operations:
//
// 1. Create an object that encapsulates the state of the Enigma machine.
// 2. Create and add graphical objects that sit on top of the image.
// 3. Add listeners that forward mouse events to those objects.
var enigma={};
function rotorRotation(enigma){
   var rotor = enigma.rotors[2];
   enigma.rotorOffset[2] = (enigma.rotorOffset[2] + 1) % 26;
   var index = enigma.rotorOffset[2];
   rotor.setRotor(index);
   if (index === 0) {
      rotor = enigma.rotors[1];
      enigma.rotorOffset[1] = (enigma.rotorOffset[1] + 1) % 26;
      index = enigma.rotorOffset[1];
      rotor.setRotor(index);
      if (index === 0) {
         rotor = enigma.rotors[0];
         enigma.rotorOffset[0] = (enigma.rotorOffset[0] + 1) % 26;
         index = enigma.rotorOffset[0];
         rotor.setRotor(index);
      }
   }
}
function encryptLetter(letter, enigma) {
   var index = letter.charCodeAt(0) - 65;

   // Forward pass through rotors
   for (var i = 2; i >= 0; i--) {
      index = (index + enigma.rotorOffset[i]) % 26;
      var c = ROTOR_PERMUTATIONS[i].charCodeAt(index) - 65;
      index = c;
   }

   // Reflector
   index = REFLECTOR_PERMUTATION.charCodeAt(index) - 65;

   // Reverse pass through rotors
   for (var i = 0; i < 3; i++) {
      var shiftedIndex = (index + enigma.rotorOffset[i]) % 26;
      var letterAtIndex = String.fromCharCode(shiftedIndex + 65);
      index = ROTOR_PERMUTATIONS[i].indexOf(letterAtIndex);
      index = (index - enigma.rotorOffset[i] + 26) % 26;
   }

   rotorRotation(enigma);
   return String.fromCharCode(index + 65);
}

function runEnigmaSimulation(gw) {
   enigma.keys = [];
   enigma.lamps = [];
   enigma.currKey = null;
   enigma.currLamp = null;
   enigma.rotors = [];
   enigma.rotorOffset = [];
   gw.addEventListener("mousedown", function(e) {
      for(var i=0;i<3;i++){
         if(enigma.rotors[i].contains(e.getX(), e.getY())){
            var rotor = enigma.rotors[i];
            enigma.rotorOffset[i] = (enigma.rotorOffset[i] + 1) % 26;
            var index = enigma.rotorOffset[i];
            rotor.setRotor(index);
            break;
         }
      }
      for(var i=0;i<26;i++){
         if(enigma.keys[i].contains(e.getX(), e.getY())){
            if(enigma.currLamp !==null){
               enigma.currLamp.turnOff();
            }
            enigma.currKey = enigma.keys[i];
            enigma.currKey.mousedownAction(enigma);
            break;
         }
      }

   });

   gw.addEventListener("mouseup", function(e) {
      if (enigma.currKey !== null) {
         var letter = enigma.currKey.letter;
         var encryptedLetter = encryptLetter(letter,enigma);
         var lampIndex = encryptedLetter.charCodeAt(0) - 65;
         enigma.currLamp = enigma.lamps[lampIndex];
         enigma.currLamp.turnOn();
         enigma.currKey.mouseupAction(enigma);
      }
   });

   for(var i=0;i<3;i++){
      var loc = ROTOR_LOCATIONS[i];
      var rotor = new GRect(-ROTOR_WIDTH/2, -ROTOR_HEIGHT/2, ROTOR_WIDTH, ROTOR_HEIGHT);
      rotor.setFilled(true);
      rotor.setFillColor(ROTOR_BGCOLOR);
      var label = new GLabel("A", -9, ROTOR_LABEL_DY);
      label.setFont(ROTOR_FONT);
      label.setColor(ROTOR_COLOR);
      var rotorSetting = new GCompound();
      rotorSetting.add(rotor);
      rotorSetting.add(label);
      rotorSetting.label = label;
      enigma.rotors.push(rotorSetting);
      enigma.rotorOffset.push(0);
      gw.add(rotorSetting,loc.x,loc.y);
      rotorSetting.setRotor = function(index) {
         var letter = String.fromCharCode(index + 65);
         this.label.setLabel(letter);
         this.label.setColor(ROTOR_COLOR);
      };
   }
   for(var i=0;i<26;i++){
      var letter = String.fromCharCode(i + 65);
      (function(i){
         //Key Setup
         var loc = KEY_LOCATIONS[i];
         var outer = new GOval(-KEY_RADIUS, -KEY_RADIUS, KEY_RADIUS * 2, KEY_RADIUS * 2);
         outer.setFilled(true);
         outer.setFillColor(KEY_BORDER_COLOR);
         
         var inner = new GOval(-KEY_RADIUS+KEY_BORDER, -KEY_RADIUS+KEY_BORDER,(KEY_RADIUS - KEY_BORDER) * 2, (KEY_RADIUS - KEY_BORDER) * 2);
         inner.setFilled(true);
         inner.setFillColor(KEY_BGCOLOR);
         
         var label = new GLabel(letter, -9, KEY_LABEL_DY);
         label.setFont(KEY_FONT);
         label.setColor(KEY_UP_COLOR);

         var key = new GCompound();
         key.add(outer);
         key.add(inner);
         key.add(label);
         key.letter = letter;
         gw.add(key,loc.x,loc.y);
         enigma.keys.push(key);  
         key.mousedownAction = function(enigma) {
            label.setColor(KEY_DOWN_COLOR);
         }; 

         key.mouseupAction = function(enigma) {
            label.setColor(KEY_UP_COLOR);
            enigma.currKey = null;
         };

      })(i);

      (function(i){
         //Lamp Setup
         var loc = LAMP_LOCATIONS[i];
         var outer = new GOval(-LAMP_RADIUS, -LAMP_RADIUS, LAMP_RADIUS * 2, LAMP_RADIUS * 2);
         outer.setFilled(true);
         outer.setFillColor(LAMP_BORDER_COLOR);
         var inner = new GOval(-LAMP_RADIUS+KEY_BORDER, -LAMP_RADIUS+KEY_BORDER,(LAMP_RADIUS - KEY_BORDER) * 2, (LAMP_RADIUS - KEY_BORDER) * 2);
         inner.setFilled(true);
         inner.setFillColor(LAMP_BGCOLOR);
         var label = new GLabel(letter, -9, LAMP_LABEL_DY);
         label.setFont(LAMP_FONT);
         label.setColor(LAMP_OFF_COLOR);
         var lamp = new GCompound();
         lamp.add(outer);
         lamp.add(inner);
         lamp.add(label);
         lamp.label = label;
         lamp.turnOn = function() {
            this.label.setColor(LAMP_ON_COLOR);
            this.setColor(LAMP_ON_COLOR);
         };

         lamp.turnOff = function() {
            this.label.setColor(LAMP_OFF_COLOR);
            this.setColor(LAMP_BORDER_COLOR);
         };
         gw.add(lamp,loc.x,loc.y);
         enigma.lamps.push(lamp);
      })(i);
   }
}
