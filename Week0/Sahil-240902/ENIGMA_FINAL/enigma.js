console.log("🔧 enigma.js module loaded, exports available:");
import {
  drawKey, drawLamp, activateKeyDown, activateKeyUp,
  drawRotor, redrawAll, applyPermutation, make_inverse_rotor_permutation
} from './helper.js';

import {
  KEY_RADIUS, ROTOR_PERMUTATIONS, KEY_LOCATIONS, LAMP_LOCATIONS,
  REFLECTOR_PERMUTATION, posirot, poserot
} from './constants.js';

export let offsets = [0, 0, 0];
export let userOffsets=[0,0,0];
export let enigmaImage;
// Plugboard mapping: { A: "M", M: "A", ... }
export let plugboardPairs = {};
export let ctx,canvas;

const keySound4= new Audio("clicksound.wav");
const keySound1= new Audio("clicksound1.wav");
const keySound2= new Audio("clicksound2.wav");
const keySound3= new Audio("clicksound3.wav");
const rotorSound = new Audio("rotorsound.wav");
const keysound = [keySound1, keySound2, keySound3, keySound4];

const INVERSE_ROTOR_PERMUTATIONS = make_inverse_rotor_permutation(ROTOR_PERMUTATIONS);

window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d"); // ✅ now modifies the top-level ctx
  console.log("🔧 enigma.js module loaded, exports available:");
  enigmaImage = new Image();
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
      drawRotor(ctx, i, offsets[i]);
    }

    let currentKey = null;
    let currentLamp = null;

    canvas.addEventListener("mousedown", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let letter in keyMap) {
        const key = keyMap[letter];
        const dx = x - key.x;
        const dy = y - key.y;
        if (dx * dx + dy * dy < KEY_RADIUS * KEY_RADIUS) {
          currentKey = key;

          let keySound = keysound[Math.floor(Math.random() * 4)];
          keySound.currentTime = 0;
          keySound.volume = 0.2;
          keySound.play().catch(e => {});

          let plugLetter = letter;
          if (plugboardPairs[letter]) plugLetter = plugboardPairs[letter];
          let index = alphabet.indexOf(plugLetter);

          advanceRotor(2);

          for (let j = 2; j >= 0; j--) {
            index = applyPermutation(index, ROTOR_PERMUTATIONS[j], offsets[j]);
          }
          index = REFLECTOR_PERMUTATION[index].charCodeAt(0) - 65;
          for (let j = 0; j < 3; j++) {
            index = applyPermutation(index, INVERSE_ROTOR_PERMUTATIONS[j], offsets[j]);
          }

          let outputLetter = String.fromCharCode(index + 65);
          if (plugboardPairs[outputLetter]) {
            outputLetter = plugboardPairs[outputLetter];
            index = alphabet.indexOf(outputLetter);
          }

          redrawAll(ctx, offsets, enigmaImage);
          currentLamp = lightMap[outputLetter];
          activateKeyDown(ctx, currentKey, currentLamp);
          break;
        }
      }
    });

    canvas.addEventListener("mouseup", function () {
      if (currentKey && currentLamp) {
        activateKeyUp(ctx, currentKey, currentLamp);
        currentKey = null;
        currentLamp = null;
      }
    });

    canvas.addEventListener("click", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        const { x: x1, y: y1 } = posirot[i];
        const { x: x2, y: y2 } = poserot[i];

        if (x > x1 && x < x2 && y > y1 && y < y2) {
          advanceRotor(i);

          rotorSound.currentTime = 0;
          rotorSound.volume = 0.3;
          rotorSound.play().catch(e => {});
          setTimeout(() => {
            rotorSound.pause();
            rotorSound.currentTime = 0;
          }, 50);

          redrawAll(ctx, offsets, enigmaImage);
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
    }
  };
};

export function redrawAll_wo_ctx(){
  redrawAll(ctx,offsets,enigmaImage);
}