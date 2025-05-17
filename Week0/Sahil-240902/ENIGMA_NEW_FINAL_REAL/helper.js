import {
  KEY_RADIUS, KEY_BORDER, KEY_BORDER_COLOR, KEY_BGCOLOR,
  KEY_UP_COLOR, KEY_DOWN_COLOR, KEY_LABEL_DY, KEY_FONT,
  LAMP_RADIUS, LAMP_BORDER_COLOR, LAMP_BGCOLOR, LAMP_OFF_COLOR,
  LAMP_LABEL_DY, LAMP_FONT, ROTOR_PERMUTATIONS, ROTOR_BGCOLOR,
  ROTOR_WIDTH, ROTOR_HEIGHT, ROTOR_COLOR, ROTOR_LABEL_DY,
  ROTOR_FONT, ROTOR_LOCATIONS, REFLECTOR_PERMUTATION, KEY_LOCATIONS,
  LAMP_LOCATIONS, posirot, poserot
} from './constants.js';


const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


export function drawKey(ctx, x, y, letter, pressed) {
  ctx.beginPath();
  ctx.arc(x, y, KEY_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = KEY_BORDER_COLOR;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, KEY_RADIUS - KEY_BORDER, 0, Math.PI * 2);
  ctx.fillStyle = pressed ? "yellow" : KEY_BGCOLOR;
  ctx.fill();

  ctx.fillStyle = pressed ? KEY_DOWN_COLOR : KEY_UP_COLOR;
  ctx.font = KEY_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x, y);
}

export function drawLamp(ctx, x, y, letter, on) {
  ctx.beginPath();
  ctx.arc(x, y, LAMP_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = on ? "yellow" : LAMP_BGCOLOR;
  ctx.fill();
  ctx.strokeStyle = LAMP_BORDER_COLOR;
  ctx.stroke();

  ctx.fillStyle = on ? "black" : LAMP_OFF_COLOR;
  ctx.font = LAMP_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x, y );
}
export function activateKeyDown(ctx, key, lamp) {
  drawKey(ctx, key.x, key.y, key.letter, true);
  drawLamp(ctx, lamp.x, lamp.y, lamp.letter, true);
}

export function activateKeyUp(ctx, key, lamp) {
  drawKey(ctx, key.x, key.y, key.letter, false);
  drawLamp(ctx, lamp.x, lamp.y, lamp.letter, false);
}
export function drawRotor(ctx, number, offset) {
  const pos = ROTOR_LOCATIONS[number];
  
  // Rotor background
  ctx.fillStyle = ROTOR_BGCOLOR;
  ctx.fillRect(pos.x-ROTOR_WIDTH/2, pos.y-ROTOR_HEIGHT/2, ROTOR_WIDTH, ROTOR_HEIGHT);

  // Rotor text (show position/offset)
  ctx.fillStyle = ROTOR_COLOR;
  ctx.font = ROTOR_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    String.fromCharCode('A'.charCodeAt(0)+offset),  // Show current rotor position
    pos.x ,
    pos.y 
  );
}


export function redrawAll(ctx,offsets,enigmaImage) {
    // Clear canvas and redraw everything
    ctx.drawImage(enigmaImage, 0, 0);

    // Redraw keys and lamps
    for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    drawKey(ctx, KEY_LOCATIONS[i].x, KEY_LOCATIONS[i].y, letter, false);
    drawLamp(ctx, LAMP_LOCATIONS[i].x, LAMP_LOCATIONS[i].y, letter, false);
    }

    // Redraw rotors with current offsets
    for (let i = 0; i < 3; i++) {
    drawRotor(ctx, i, offsets[i]);
    }
}

export function applyPermutation(index, permutation, offset) {
    let adjustedIndex = (index + offset +26) % 26;
    const charCode = permutation.charCodeAt(adjustedIndex) - 'A'.charCodeAt(0);
    return (charCode + 26 - offset) % 26;
}

export function invertKey(perm) {
    const arr = new Array(26).fill('');
    for (let i = 0; i < 26; i++) {
        const targetIndex = perm.charCodeAt(i) - 'A'.charCodeAt(0);
        arr[targetIndex] = String.fromCharCode('A'.charCodeAt(0) + i);
    }
    return arr.join('');
}

export function make_inverse_rotor_permutation(rotorperm) {
  return rotorperm.map(perm => {
    const inverse = new Array(26).fill('');
    for (let i = 0; i < 26; i++) {
      const outputChar = perm[i];
      const outputIndex = outputChar.charCodeAt(0) - 65;
      inverse[outputIndex] = String.fromCharCode(65 + i);
    }
    return inverse.join('');
  });
}


