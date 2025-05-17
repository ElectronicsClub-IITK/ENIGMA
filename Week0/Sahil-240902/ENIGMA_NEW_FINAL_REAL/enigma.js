import { drawKey, drawLamp, activateKeyDown, activateKeyUp, 
  drawRotor, redrawAll, applyPermutation, invertKey,
  make_inverse_rotor_permutation
} from './helper.js';

import {
  KEY_RADIUS, KEY_BORDER, KEY_BORDER_COLOR, KEY_BGCOLOR,
  KEY_UP_COLOR, KEY_DOWN_COLOR, KEY_LABEL_DY, KEY_FONT,
  LAMP_RADIUS, LAMP_BORDER_COLOR, LAMP_BGCOLOR, LAMP_OFF_COLOR,
  LAMP_LABEL_DY, LAMP_FONT, ROTOR_PERMUTATIONS, ROTOR_BGCOLOR,
  ROTOR_WIDTH, ROTOR_HEIGHT, ROTOR_COLOR, ROTOR_LABEL_DY,
  ROTOR_FONT, ROTOR_LOCATIONS, REFLECTOR_PERMUTATION, KEY_LOCATIONS,
  LAMP_LOCATIONS, posirot, poserot
} from './constants.js';


let offsets=[0,0,0];
const INVERSE_ROTOR_PERMUTATIONS= make_inverse_rotor_permutation(ROTOR_PERMUTATIONS);


window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const enigmaImage = new Image();
  enigmaImage.src = "EnigmaTopView.png";

  enigmaImage.onload = () => {
    canvas.width = enigmaImage.width;
    canvas.height = enigmaImage.height;
    ctx.drawImage(enigmaImage, 0, 0);

    const keyMap = {};
    const lightMap = {};
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const keyPos = KEY_LOCATIONS[i];
      keyMap[letter] = { ...keyPos, letter };
      drawKey(ctx, keyPos.x, keyPos.y, letter, false);
    }

    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const lampPos = LAMP_LOCATIONS[i];
      lightMap[letter] = { ...lampPos, letter };
      drawLamp(ctx, lampPos.x, lampPos.y, letter, false);
    }
    for (let i = 0; i < 3; i++) {
      drawRotor(ctx, i, 0);  // Pass context and offset
    }

    let currentKey = null;
    let currentLamp = null;


    canvas.addEventListener("mousedown", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let letter in keyMap) {
        const key = keyMap[letter];
        let index = alphabet.indexOf(key.letter);
        const dx = x - key.x;
        const dy = y - key.y;
        if (dx * dx + dy * dy < KEY_RADIUS * KEY_RADIUS) {
          currentKey = keyMap[letter];

          advanceRotor(2);

          for(let j=2;j>=0;j-- ){
            index= applyPermutation(index, ROTOR_PERMUTATIONS[j],offsets[j]);
          }
          index= REFLECTOR_PERMUTATION[index].charCodeAt(0)-65;
          for(let j=0;j<3;j++){
            index= applyPermutation(index, INVERSE_ROTOR_PERMUTATIONS[j],offsets[j]);
          }

          redrawAll(ctx, offsets, enigmaImage );
          currentLamp = lightMap[String.fromCharCode(index+65)];
          activateKeyDown(ctx, currentKey, currentLamp);
          break;
        }
      }
    });

    canvas.addEventListener("mouseup", function (e) {
      if (currentKey && currentLamp) {
        activateKeyUp(ctx, currentKey, currentLamp);
        currentKey = null;
        currentLamp = null;
      }
    });


    canvas.addEventListener("click", function(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        const {x: x1, y: y1} = posirot[i];
        const {x: x2, y: y2} = poserot[i];

        if (x > x1 && x < x2 && y > y1 && y < y2) {
          advanceRotor(i)
          redrawAll(ctx, offsets, enigmaImage ); // ← This is critical
          break;
        }
      }
    });

    function advanceRotor(number){
      if(offsets[number]==25 && number !=0) {
        advanceRotor(number-1);
        offsets[number]=0;
      }
      else if (offsets[number]==25 && number ==0) offsets[number]=0;
      else{
        offsets[number]++;
      }
    };

  };
};



