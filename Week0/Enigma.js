import "graphics";
import "EnigmaConstants.js";

/* Main program */
function Enigma() {
   var enigmaImage = GImage("EnigmaTopView.png");
   var gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
   gw.add(enigmaImage);
   runEnigmaSimulation(gw);
}

function runEnigmaSimulation(gw) {
 var enigma = {
     keys: {},
     lamps: {},
     rotors: []
 };

const ROTOR_TURNOVERS = ['B'.charCodeAt(0) - 65, 'C'.charCodeAt(0) - 65, 'D'.charCodeAt(0) - 65];


// Lamps
for(var i=0; i<26; i++){
  var dh =  String.fromCharCode("A".charCodeAt(0)+i);
  var loc = LAMP_LOCATIONS[i];
  var lamp = GCompound();

  var dh1 = GOval(loc.x-LAMP_RADIUS,loc.y-LAMP_RADIUS,LAMP_RADIUS*2,LAMP_RADIUS*2);
  dh1.setFilled(true);
  dh1.setColor(LAMP_BGCOLOR);
  lamp.add(dh1, 0, 0);

  var lamplabel = GLabel(dh);
  lamplabel.setFont(LAMP_FONT);
  lamplabel.setColor("#666666");
  lamp.add(lamplabel, LAMP_RADIUS - lamplabel.getWidth()/2, LAMP_RADIUS+LAMP_LABEL_DY);
  lamp.label = lamplabel;

  gw.add(lamp, loc.x-LAMP_RADIUS, loc.y-LAMP_RADIUS);
  enigma.lamps[dh] = lamplabel;
}

// Keys
for(var i=0; i < 26; i++){
  var ch = String.fromCharCode("A".charCodeAt(0)+i);
  var loc = KEY_LOCATIONS[i];
  var key = GCompound();

  var ch1 = GOval(loc.x-KEY_RADIUS,loc.y- KEY_RADIUS,KEY_RADIUS*2,KEY_RADIUS*2);
  ch1.setFilled(true);
  ch1.setColor(KEY_BORDER_COLOR);
  key.add(ch1, 0, 0);

  var ch2 = GOval(loc.x-KEY_RADIUS,loc.y-KEY_RADIUS,(KEY_RADIUS-3)*2, (KEY_RADIUS-3)*2);
  ch2.setFilled(true);
  ch2.setColor(KEY_BGCOLOR);
  key.add(ch2, 3, 3);

  var label = GLabel(ch);
  label.setFont(KEY_FONT);
  label.setColor("#CCCCCC");
  key.add(label, KEY_RADIUS - label.getWidth()/2, KEY_RADIUS+KEY_LABEL_DY);
  key.label = label;

  label.linkedLamp = enigma.lamps[ch];

 key.mousedownAction = function () {
   this.label.setColor("red");
   stepRotor(enigma.rotors[2]);
   if(enigma.rotors[2].offset === ROTOR_TURNOVERS[2] || enigma.rotors[1].offset === ROTOR_TURNOVERS[1]){
      stepRotor(enigma.rotors[1]);}
   if(enigma.rotors[1].offset === ROTOR_TURNOVERS[1]){
      stepRotor(enigma.rotors[0]);
      }
   if (this.label !== undefined && this.label.linkedLamp !== undefined && this.label.linkedLamp !== null) {
    var char = this.label.getLabel();
    var index = char.charCodeAt(0) - 65;

    for (var r = 2; r >= 0; r--) {
      var rotor = enigma.rotors[r];
      index = applyPermutation(index, rotor.permutation, rotor.offset);
    }

	 index = reflector(index);

	 for (var r = 0; r < 3; r++) {
      var rotor = enigma.rotors[r];
      index = applyInversePermutation(index, rotor.permutation, rotor.offset);
    }

    var mappedLetter = String.fromCharCode(index + 65);

    if (enigma.lamps[mappedLetter] !== undefined && enigma.lamps[mappedLetter] !== null) {
      enigma.lamps[mappedLetter].setColor(LAMP_ON_COLOR);
      this.label.litLamp = enigma.lamps[mappedLetter];
    }
  }
};


key.mouseupAction = function () {
  this.label.setColor("#CCCCCC");

  if (this.label !== undefined && this.label !== null && this.label.litLamp !== undefined && this.label.litLamp !== null) {
    this.label.litLamp.setColor(LAMP_OFF_COLOR);
    this.label.litLamp = null;
  }
};


  ch1.label = label;
  ch2.label = label;
  label.label = label;

  ch1.mousedownAction = key.mousedownAction;
  ch2.mousedownAction = key.mousedownAction;
  label.mousedownAction = key.mousedownAction;

  ch1.mouseupAction = key.mouseupAction;
  ch2.mouseupAction = key.mouseupAction;
  label.mouseupAction = key.mouseupAction;

  gw.add(key, loc.x - KEY_RADIUS, loc.y - KEY_RADIUS);
  enigma.keys[ch] = {outer: ch1, inner: ch2, label: label};
}

// Rotors
for(var i = 0; i < 3; i++){
  var rotLet = "A";
  var loc = ROTOR_LOCATIONS[i];
  var rotor = GCompound();

  var rotorbox = GRect(0, 0, ROTOR_WIDTH, ROTOR_HEIGHT);
  rotorbox.setFilled(true);
  rotorbox.setColor(ROTOR_BGCOLOR);
  rotor.add(rotorbox);

  var rotorLabel = GLabel(rotLet);
  rotorLabel.setFont(ROTOR_FONT);
  rotorLabel.setColor(ROTOR_COLOR);
  rotor.add(rotorLabel, ROTOR_WIDTH/2 - rotorLabel.getWidth()/2, ROTOR_HEIGHT/2 + ROTOR_LABEL_DY);

  rotor.label = rotorLabel;
  rotor.offset = 0;
  rotor.permutation = ROTOR_PERMUTATIONS[2-i];
  rotor.offset = rotor.label.getLabel().charCodeAt(0) - 65;

  rotor.mousedownAction = function() {
    var currentChar = this.label.getLabel();
    var nextChar = String.fromCharCode(((currentChar.charCodeAt(0) - 65 + 1) % 26) + 65);
    this.label.setLabel(nextChar);
    this.offset = nextChar.charCodeAt(0) - 65;
  };

  gw.add(rotor, loc.x - ROTOR_WIDTH/2, loc.y - ROTOR_HEIGHT/2);
  enigma.rotors.push(rotor);
}

var mousedownAction = function(e) {
  var obj = gw.getElementAt(e.getX(), e.getY());
  if (obj !== null && obj.mousedownAction !== undefined) {
    obj.mousedownAction(enigma);
  }
};
gw.addEventListener("mousedown", mousedownAction);

var mouseupAction = function(e) {
  var obj = gw.getElementAt(e.getX(), e.getY());
  if (obj !== null && obj.mouseupAction !== undefined) {
    obj.mouseupAction(enigma);
  }
};
gw.addEventListener("mouseup", mouseupAction);
}

function applyPermutation(index, permutation, offset){
  var index1 = (index + offset) % 26;
  var letter = permutation.charAt(index1);
  var index2 = letter.charCodeAt(0) - 65; 
  var index3 = (index2 - offset + 26) % 26;
  return index3;
}
function applyInversePermutation(index, permutation, offset) {
  var index1 = (index + offset) % 26;
  var letter = String.fromCharCode(index1 + 65);
  var index2 = permutation.indexOf(letter);
  var index3 = (index2 - offset + 26) % 26;
  return index3;
}

function reflector(index){
	var letter = REFLECTOR_PERMUTATION.charAt(index);
	return letter.charCodeAt(0)-65;
}
function stepRotor(rotor){
  rotor.offset = (rotor.offset + 1) % 26;
  var newChar = String.fromCharCode(rotor.offset + 65);
  rotor.label.setLabel(newChar);
}
