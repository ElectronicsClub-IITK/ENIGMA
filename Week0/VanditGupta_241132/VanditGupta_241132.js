//add way to ensure when a key is pressed no other key can be pressed untill it is lifted.

import "graphics";

function Enigma() {
		
	// Defining the constants here itself and passing them as parameters	
		

	const KEY_LOCATIONS = [
  { x: 140, y: 566 }, /* A */
  { x: 471, y: 640 }, /* B */
  { x: 319, y: 639 }, /* C */
  { x: 294, y: 567 }, /* D */
  { x: 268, y: 495 }, /* E */
  { x: 371, y: 567 }, /* F */
  { x: 448, y: 567 }, /* G */
  { x: 523, y: 567 }, /* H */
  { x: 650, y: 496 }, /* I */
  { x: 598, y: 567 }, /* J */
  { x: 674, y: 567 }, /* K */
  { x: 699, y: 641 }, /* L */
  { x: 624, y: 641 }, /* M */
  { x: 547, y: 640 }, /* N */
  { x: 725, y: 497 }, /* O */
  { x:  92, y: 639 }, /* P */
  { x: 115, y: 494 }, /* Q */
  { x: 345, y: 495 }, /* R */
  { x: 217, y: 566 }, /* S */
  { x: 420, y: 496 }, /* T */
  { x: 574, y: 496 }, /* U */
  { x: 395, y: 639 }, /* V */
  { x: 192, y: 494 }, /* W */
  { x: 242, y: 639 }, /* X */
  { x: 168, y: 639 }, /* Y */
  { x: 497, y: 496 }  /* Z */
];

	const LAMP_LOCATIONS = [
   { x: 121, y: 309 } /* A */,
   { x: 449, y: 380 } /* B */,
   { x: 298, y: 379 } /* C */,
   { x: 273, y: 310 } /* D */,
   { x: 249, y: 242 } /* E */,
   { x: 349, y: 310 } /* F */,
   { x: 425, y: 311 } /* G */,
   { x: 501, y: 311 } /* H */,
   { x: 627, y: 243 } /* I */,
   { x: 577, y: 312 } /* J */,
   { x: 653, y: 312 } /* K */,
   { x: 677, y: 380 } /* L */,
   { x: 601, y: 380 } /* M */,
   { x: 526, y: 380 } /* N */,
   { x: 702, y: 244 } /* O */,
   { x:  71, y: 378 } /* P */,
   { x:  98, y: 241 } /* Q */,
   { x: 324, y: 242 } /* R */,
   { x: 197, y: 309 } /* S */,
   { x: 400, y: 242 } /* T */,
   { x: 551, y: 243 } /* U */,
   { x: 374, y: 379 } /* V */,
   { x: 174, y: 241 } /* W */,
   { x: 223, y: 379 } /* X */,
   { x: 147, y: 378 } /* Y */,
   { x: 476, y: 242 } /* Z */
];

const ROTOR_LOCATIONS = [
   { x: 221, y: 72 },
   { x: 306, y: 72 },
   { x: 389, y: 72 }
];
const ROTOR_PERMUTATIONS = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",        /* Permutation for slow rotor      */
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",        /* Permutation for medium rotor    */
  "BDFHJLCPRTXVZNYEIWGAKMUSQO"         /* Permutation for fast rotor      */
];

const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";
	

    const enigmaImage = GImage("EnigmaTopView.png");
    const gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
    gw.add(enigmaImage);
	var keyArr = new Array(26); // this is a array which will contain all the Keys
   var lampArr = new Array(26); // this is a array which will contain all the Lamps 
	var rotArr = new Array(3);
   var rotlinesArr = new Array(3);
   var enigma = {
				  		keyArr:keyArr , lampArr: lampArr, 
				  		rotArr: rotArr,rotlinesArr:rotlinesArr, 
				  		reflect_perm : REFLECTOR_PERMUTATION
				  	 };
    runEnigmaSimulation(gw, enigma, KEY_LOCATIONS,LAMP_LOCATIONS, ROTOR_LOCATIONS, ROTOR_PERMUTATIONS );
}

// for modularity, creating a new function to create keys

function createKeys(gw, enigma, KEY_LOCATIONS) {
// this loop creates border and backround of keys	
	for (var i =0;i<26;i++){
		var big_circle = GOval(48,48);
		big_circle.setColor("#CCCCCC");
		big_circle.setFilled(true);
	 
		var small_circle = GOval(42,42);
		small_circle.setColor("#666666");
		small_circle.setFilled(true);	
		small_circle.index = i;
		
		gw.add(big_circle,KEY_LOCATIONS[i].x-24,KEY_LOCATIONS[i].y-24);		// the x and y we specify must be coordinates 
		gw.add(small_circle,KEY_LOCATIONS[i].x-21,KEY_LOCATIONS[i].y-21); 	// of the top left edge so we subtract raduis

		var label_a = GLabel(String.fromCharCode(65 + i));
		label_a.setFont("Helvetica Neue-Bold-28");
		label_a.originalColor = "#CCCCCC";
		label_a.pressedColor = "#CC3333";
		label_a.setColor(label_a.originalColor);
		label_a.index = i; //creating an index so that we can connect the letter to the index in lamp and key arr

		enigma.keyArr[i] = label_a;
		
		(function(lbl,crcl) {
			lbl.mousedownAction = function(_enigma) {
				lbl.setColor(lbl.pressedColor);
			};
			lbl.mouseupAction = function(_enigma) {
				lbl.setColor(lbl.originalColor);
			};

			crcl.mousedownAction = function(_enigma) {
				lbl.setColor(lbl.pressedColor);
			};
			crcl.mouseupAction = function(_enigma) {
				lbl.setColor(lbl.originalColor);
			};
		})(label_a,small_circle);

	gw.add(label_a,KEY_LOCATIONS[i].x-10,KEY_LOCATIONS[i].y+10); //offeset manually done
	}
	
	
	var mousedownAction = function(e) {
 		var obj = gw.getElementAt(e.getX(), e.getY());
 		if (obj !== null && obj.mousedownAction !== undefined) {
 			obj.mousedownAction(enigma);
			var index = obj.index;
            //apply whole enigma bs
                for(var i = 2; i>=0;i--){index = applyPermutation(index,enigma.rotArr[i].perm_rtl,enigma.rotArr[i].offset);}
                index = enigma.reflect_perm[index].charCodeAt(0)-65;
                for(var i =0;i<3;i++){index = applyPermutation(index,enigma.rotArr[i].perm_ltr,enigma.rotArr[i].offset);} 
				turnonLamp(enigma,index);
 		}
        //adding rotoradvancement for rotors when clicked.
        if(obj !== null && (obj.advanceRotor !== undefined && obj.index !== undefined)){
			obj.advanceRotor(enigma,obj.index,true);
        }
	};
	gw.addEventListener("mousedown", mousedownAction);

	var mouseupAction = function(e) {
 		var obj = gw.getElementAt(e.getX(), e.getY());
 		if (obj !== null && obj.mousedownAction !== undefined) {
 			obj.mouseupAction(enigma);
            var index =obj.index ;
				//apply whole enigma bs
            for(var i = 2; i>=0;i--){index = applyPermutation(index,enigma.rotArr[i].perm_rtl,enigma.rotArr[i].offset);}
            index = enigma.reflect_perm[index].charCodeAt(0)-65;
            for(var i =0;i<3;i++){index = applyPermutation(index,enigma.rotArr[i].perm_ltr,enigma.rotArr[i].offset);}    
            turnoffLamp(enigma,index);
			   //advance the rotors in fashion due to pressing of the key (lifting actually)
            enigma.rotlinesArr[0].advanceRotor(enigma, 0,
															enigma.rotlinesArr[1].advanceRotor(enigma, 1,
														enigma.rotlinesArr[2].advanceRotor(enigma, 2,true)));
 		}
        
	};
	gw.addEventListener("mouseup", mouseupAction);
}

function createLamps(gw,enigma,LAMP_LOCATIONS) {
	for (var i =0;i<26;i++){
		var circle = GOval(46,46);
		circle.setColor("#111111");
		circle.setFillColor("#333333");
		circle.setFilled(true);
	 
		gw.add(circle,LAMP_LOCATIONS[i].x,LAMP_LOCATIONS[i].y); //dont know why raduis need not be subtracted here
	
		var label_lamp = GLabel(String.fromCharCode(65 + i));
		label_lamp.setFont("Helvetica Neue-Bold-24");
		label_lamp.offColor = "#666666";
		label_lamp.onColor = "#FFFF99";
		label_lamp.setColor(label_lamp.offColor);
		label_lamp.index = i; //creating index to reference the element corresponing for key and lamp arr
		
		enigma.lampArr[i] = label_lamp;

	gw.add(label_lamp,LAMP_LOCATIONS[i].x+14,LAMP_LOCATIONS[i].y+32); // the offset values are manually calculated, no formula
	}
}

function turnonLamp(enigma, index){
    var lamp = enigma.lampArr[index];
    lamp.setColor(lamp.onColor);
}

function turnoffLamp(enigma,index){
    var lamp = enigma.lampArr[index];
    lamp.setColor(lamp.offColor);
}
function createRotors(gw,enigma,ROTOR_LOCATIONS,ROTOR_PERMUTATIONS){
    //creating rotors 1 = slow, 2 = med, 3 = fast
    for (var i =0;i<3;i++){

        var rotor = GCompound();
        var rect = GRect(24,26); //width,height
        rect.setColor("#BBAA77");
        rect.setFilled(true);
        var label_rot = GLabel("A");
        label_rot.setFont("Helvetica Neue-24");
        rotor.add(rect);
        rotor.add(label_rot,5,21);
        rotor.label_rot = label_rot;
        rotor.index = i;
        rotor.offset = 0; // original offset 

        //creating the lines which detect if rotor is being advanced
        var lines = GRect(3,150); //these dimentions were manually gotten
        lines.setColor("White");
        lines.setFilled(true);
		  lines.index =i;
		  enigma.rotlinesArr[i] = lines;
        gw.add(lines,ROTOR_LOCATIONS[i].x+63,ROTOR_LOCATIONS[i].y-56); // this offset manually done
        

        rotor.perm_rtl = ROTOR_PERMUTATIONS[i];
        rotor.perm_ltr = invertKey(rotor.perm_rtl);
        gw.add(rotor,ROTOR_LOCATIONS[i].x+11,ROTOR_LOCATIONS[i].y+9);
        enigma.rotArr[i] = rotor;


		//creating click action for each rotor
		(function(lin) {
            lin.advanceRotor = function(_enigma,index,carry){
                //this function will only change the rotor when carry = true, 
                // we will also return true/false depending on if the offset turned to 0
				if (carry)
                {
                    var rot = enigma.rotArr[index];
						  if (rot.offset !== 25) {
							  rot.offset = rot.offset + 1;
							  carry = false;
						  } else {
							  rot.offset = 0;
							  carry = true;
						  }	
                    rot.label_rot.setLabel(String.fromCharCode(65+rot.offset));
						  return carry;
                }
                return false;
            };
        })(lines);
    }
}


function applyPermutation(index,permutation, offset){
    // take index and add offset mod 26
    // get the letter after putting in the permutation
    // convert the letter to another index
    // output the index - offset mod 26
    var output = index;
    index = (index + offset < 26) ? index + offset  : index + offset -26;
    var letter = permutation[index];
    index = letter.charCodeAt(0) -65;
    index = (index < offset) ? index-offset + 26: index-offset;
    return index;
}

function invertKey(perm_rtl) {
    var perm_ltr = new Array(26); // use array instead of string

    for (var i = 0; i < 26; i++) {
        var index_inv = perm_rtl[i].charCodeAt(0) - 65;
        perm_ltr[index_inv] = String.fromCharCode(65 + i);
    }

    return perm_ltr.join(""); // convert array to string
}

function runEnigmaSimulation(gw, enigma, KEY_LOCATIONS,LAMP_LOCATIONS,ROTOR_LOCATIONS,ROTOR_PERMUTATIONS) {
	
	createKeys(gw,enigma,KEY_LOCATIONS);
	createLamps(gw,enigma,LAMP_LOCATIONS);
    createRotors(gw,enigma,ROTOR_LOCATIONS,ROTOR_PERMUTATIONS);
	
}
