export const KEY_RADIUS = 24;
export const KEY_BORDER = 3;
export const KEY_BORDER_COLOR = "#CCCCCC";
export const KEY_BGCOLOR = "#666666";
export const KEY_UP_COLOR = "#CCCCCC";
export const KEY_DOWN_COLOR = "#CC3333";
export const KEY_LABEL_DY = 10;
export const KEY_FONT = "20px Arial";

export const LAMP_RADIUS = 23;
export const LAMP_BORDER_COLOR = "#111111";
export const LAMP_BGCOLOR = "#333333";
export const LAMP_OFF_COLOR = "#666666";
export const LAMP_LABEL_DY = 9;
export const LAMP_FONT = "20px Arial";

export const ROTOR_PERMUTATIONS = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",        /* Permutation for slow rotor      */
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",        /* Permutation for medium rotor    */
  "BFHJLCPRTXVZNYEIWGAKMUSQO"         /* Permutation for fast rotor      */
];

export const ROTOR_BGCOLOR = "#BBAA77";       /* Background color for the rotor  */
export const ROTOR_WIDTH = 24;                /* Width of the setting indicator  */
export const ROTOR_HEIGHT = 26;               /* Height of the setting indicator */
export const ROTOR_COLOR = "Black";           /* Text color of the rotor         */
export const ROTOR_LABEL_DY = 9;              /* Offset from center to baseline  */
export const ROTOR_FONT = "Helvetica Neue-24";

export const ROTOR_LOCATIONS = [
   { x: 244, y: 95 },
   { x: 329, y: 95 },
   { x: 412, y: 95 }
];

export const posirot = ROTOR_LOCATIONS.map(loc => ({
  x: loc.x - ROTOR_WIDTH/2,  // 75, 175, 275
  y: loc.y - ROTOR_HEIGHT/2  // 100, 100, 100
}));

export const poserot = ROTOR_LOCATIONS.map(loc => ({
  x: loc.x + ROTOR_WIDTH/2,  // 125, 225, 325
  y: loc.y + ROTOR_HEIGHT/2  // 200, 200, 200
}));

export const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";

export const KEY_LOCATIONS = [
  { x: 140, y: 566 }, { x: 471, y: 640 }, { x: 319, y: 639 }, { x: 294, y: 567 },
  { x: 268, y: 495 }, { x: 371, y: 567 }, { x: 448, y: 567 }, { x: 523, y: 567 },
  { x: 650, y: 496 }, { x: 598, y: 567 }, { x: 674, y: 567 }, { x: 699, y: 641 },
  { x: 624, y: 641 }, { x: 547, y: 640 }, { x: 725, y: 497 }, { x:  92, y: 639 },
  { x: 115, y: 494 }, { x: 345, y: 495 }, { x: 217, y: 566 }, { x: 420, y: 496 },
  { x: 574, y: 496 }, { x: 395, y: 639 }, { x: 192, y: 494 }, { x: 242, y: 639 },
  { x: 168, y: 639 }, { x: 497, y: 496 }
];

export const LAMP_LOCATIONS = [
  { x: 144, y: 332 }, { x: 472, y: 403 }, { x: 321, y: 402 }, { x: 296, y: 333 },
  { x: 272, y: 265 }, { x: 372, y: 333 }, { x: 448, y: 334 }, { x: 524, y: 334 },
  { x: 650, y: 266 }, { x: 600, y: 335 }, { x: 676, y: 335 }, { x: 700, y: 403 },
  { x: 624, y: 403 }, { x: 549, y: 403 }, { x: 725, y: 267 }, { x:  94, y: 401 },
  { x: 121, y: 264 }, { x: 347, y: 265 }, { x: 220, y: 332 }, { x: 423, y: 265 },
  { x: 574, y: 266 }, { x: 397, y: 402 }, { x: 197, y: 264 }, { x: 246, y: 402 },
  { x: 170, y: 401 }, { x: 499, y: 265 }
];
