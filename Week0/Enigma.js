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


function makeKey(letter) {
   var comp = new GCompound();

   var outer = new GOval(0, 0, 2 * KEY_RADIUS, 2 * KEY_RADIUS);
   outer.setFilled(true);
   outer.setColor(KEY_BORDER_COLOR);
   comp.add(outer);

   var inner = new GOval(KEY_BORDER, KEY_BORDER,
                         2 * KEY_RADIUS - 2 * KEY_BORDER,
                         2 * KEY_RADIUS - 2 * KEY_BORDER);
   inner.setFilled(true);
   inner.setColor(KEY_BGCOLOR);
   comp.add(inner);

   var label = new GLabel(letter);
   label.setFont(KEY_FONT);
   label.setColor(KEY_UP_COLOR);

   var x = (2 * KEY_RADIUS - label.getWidth()) / 2;
   var y = (2 * KEY_RADIUS + label.getAscent()) / 2 - KEY_LABEL_DY;
   comp.add(label, x, y);

   return { keyObj: comp, labelObj: label };
}

function makeLamp(letter) {
   var comp = new GCompound();

   var outer = new GOval(0, 0, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
   outer.setFilled(true);
   outer.setColor(LAMP_BORDER_COLOR);
   comp.add(outer);

   var inner = new GOval(1, 1, 2 * LAMP_RADIUS - 2, 2 * LAMP_RADIUS - 2);
   inner.setFilled(true);
   inner.setColor(LAMP_BGCOLOR);
   comp.add(inner);

   var label = new GLabel(letter);
   label.setFont(LAMP_FONT);
   label.setColor(LAMP_OFF_COLOR);
   var x = (2 * LAMP_RADIUS - label.getWidth()) / 2;
   var y = (2 * LAMP_RADIUS + label.getAscent()) / 2 - LAMP_LABEL_DY;
   comp.add(label, x, y);

   return { lampObj: comp, labelObj: label };
}


function makeRotor() {
   var comp = new GCompound();
   var rect = new GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
   rect.setFilled(true);
   rect.setColor(ROTOR_BGCOLOR);
   comp.add(rect);

   var label = new GLabel("A");
   label.setFont(ROTOR_FONT);
   label.setColor(ROTOR_COLOR);
   var x = (ROTOR_WIDTH - label.getWidth()) / 2;
   var y = (ROTOR_HEIGHT + label.getAscent()) / 2 - ROTOR_LABEL_DY;
   comp.add(label, x, y);

   return { rotorObj: comp, labelObj: label, setting: 0 };
}


function applyPermutation(index, permutation, offset) {
	var i=(index+offset)%26;
	var charCode = permutation[i].charCodeAt(0) - 65;  	
	return (charCode-offset+26)%26;
}


function invertKey(permutation) {
	var inverse=new Array(26);
	for (var i=0;i<26;i++){
		var ind=permutation[i].charCodeAt(0)-65;
		inverse[ind]=String.fromCharCode(i+65);
	}
	return inverse.join("");
}
// You are responsible for filling in the rest of the code.  Your
// implementation of runEnigmaSimulation should perform the
// following operations:
//
// 1. Create an object that encapsulates the state of the Enigma machine.
// 2. Create and add graphical objects that sit on top of the image.
// 3. Add listeners that forward mouse events to those objects.

function runEnigmaSimulation(gw) {
   // Fill this in, along with helper functions that decompose the work
   var keyList = [];
   var lampList = [];
   var rotorList = [];

   // Keys
   for (var i = 0; i < 26; i++) {
      var letter = String.fromCharCode(65 + i);
      var pos = KEY_LOCATIONS[i];
      var key = makeKey(letter);
      gw.add(key.keyObj, pos.x - KEY_RADIUS, pos.y - KEY_RADIUS);
      keyList.push(key);
   }

   // Lamps
   for (var i = 0; i < 26; i++) {
      var letter = String.fromCharCode(65 + i);
      var pos = LAMP_LOCATIONS[i];
      var lamp = makeLamp(letter);
      gw.add(lamp.lampObj, pos.x - LAMP_RADIUS, pos.y - LAMP_RADIUS);
      lampList.push(lamp);
   }

   // Rotors
   for (var i = 0; i < 3; i++) {
      var rotor = makeRotor();
      var loc = ROTOR_LOCATIONS[i];
      gw.add(rotor.rotorObj, loc.x - ROTOR_WIDTH / 2, loc.y - ROTOR_HEIGHT / 2);
      rotorList.push(rotor);
   }
	var fastct=0;
	var medct=0;

   // Mouse Events
   gw.addEventListener("mousedown", function(e) {
      // Key press
      for (var i = 0; i < 26; i++) {
         if (keyList[i].keyObj.contains(e.getX(), e.getY())) {
            keyList[i].labelObj.setColor(KEY_DOWN_COLOR);
				var ind=i;
				for (var j=2;j>-1;j--){
					var offset=rotorList[j].labelObj.getLabel().charCodeAt(0)-65;
					ind=applyPermutation(ind,ROTOR_PERMUTATIONS[j],offset);
				}
				ind=applyPermutation(ind,REFLECTOR_PERMUTATION,0);
				for (var k=0;k<3;k++){
					var offset=rotorList[k].labelObj.getLabel().charCodeAt(0)-65;
					var key=invertKey(ROTOR_PERMUTATIONS[k]);
					ind=applyPermutation(ind,key,offset);
				}
            lampList[ind].labelObj.setColor(LAMP_ON_COLOR);
				rotorList[2].setting = (rotorList[2].setting + 1) % 26;
            rotorList[2].labelObj.setLabel(String.fromCharCode(65+ rotorList[2].setting));
				fastct++;
				if(fastct === 26) {
    				rotorList[1].setting = (rotorList[1].setting + 1) % 26;
    				rotorList[1].labelObj.setLabel(String.fromCharCode(65 + rotorList[1].setting));
    				fastct = 0;
    				medct++;
				}
            if (medct===25) {
					rotorList[1].setting = (rotorList[1].setting + 1) % 26;
    				rotorList[1].labelObj.setLabel(String.fromCharCode(65 + rotorList[1].setting));
					medct++;
				}
				if (medct===26) {
					rotorList[0].setting = (rotorList[0].setting + 1) % 26;
            	rotorList[0].labelObj.setLabel(String.fromCharCode(65 + rotorList[0].setting));
					medct=0;
				}
         }
      }
      // Rotor click
      for (var i = 0; i < 3; i++) {
         var rotor = rotorList[i];
         if (rotor.rotorObj.contains(e.getX(), e.getY())) {
            rotor.setting = (rotor.setting + 1) % 26;
            rotor.labelObj.setLabel(String.fromCharCode(65 + rotor.setting));
         }
      }
   });

   gw.addEventListener("mouseup", function(e) {
      for (var i = 0; i < 26; i++) {
         keyList[i].labelObj.setColor(KEY_UP_COLOR);
         lampList[i].labelObj.setColor(LAMP_OFF_COLOR);
      }
   });

}
