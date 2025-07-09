
import { offsets, redrawAll_wo_ctx ,userOffsets} from './enigma.js';
//import { redrawAll_wo_ctx } from './enigma.js';
console.log("🧩 config.js imported redrawAll_wo_ctx:");

document.addEventListener('DOMContentLoaded', () => {
  const configBtn = document.getElementById('config-btn');
  const configModal = document.getElementById('config-modal');
  const configRotorsBtn = document.getElementById('config-rotors-btn');
  const configPlugboardBtn = document.getElementById('config-plugboard-btn');
  const plugboardScreen = document.getElementById('plugboard-screen');
  const rotorsScreen = document.getElementById('rotors-screen');
  const plugboardBackBtn = document.getElementById('plugboard-back');
  const rotorsBackBtn = document.getElementById('rotors-back');
  // Initial screen setup
  document.getElementById('intro-screen').style.display = 'flex';
  document.getElementById('app-container').style.display = 'none';
  configModal.style.display = 'none';
  rotorsScreen.style.display = 'none';
  plugboardScreen.style.display = 'none';

  // Start button
  document.getElementById('start-btn').addEventListener('click', () => {
    const intro = document.getElementById('intro-screen');
    intro.classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('app-container').style.display = 'flex';
      intro.style.display = 'none';
    }, 300);
  });

  // Rotor back button
  rotorsBackBtn.addEventListener('click', () => {
    rotorsScreen.style.animation = 'fadeOut 0.4s ease-out';
    setTimeout(() => {
      rotorsScreen.style.display = 'none';
      rotorsScreen.style.animation = 'fadeIn 0.4s ease-out';
      document.getElementById('app-container').style.display = 'flex';
      redrawAll_wo_ctx();
    }, 350);
  });

  // Reset rotor positions
  document.getElementById('reset-offsets-btn').addEventListener('click', () => {
    offsets[0] = userOffsets[0];
    offsets[1] = userOffsets[1];
    offsets[2] = userOffsets[2];

    if (typeof redrawAll_wo_ctx === 'function') {
      try {
        redrawAll_wo_ctx();
      } catch (e) {
        console.error("redrawAll_wo_ctx failed:", e);
      }
    }
  });

  // Configuration modal
  configBtn.addEventListener('click', () => {
    configModal.style.display = 'flex';
  });

  configPlugboardBtn.addEventListener('click', () => {
    configModal.style.display = 'none';
    plugboardScreen.style.display = 'flex';
    if (window.setupPlugboardUI) window.setupPlugboardUI();
  });

  configRotorsBtn.addEventListener('click', () => {
    configModal.style.display = 'none';
    rotorsScreen.style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
    if (window.renderRotors) window.renderRotors();
  });

  plugboardBackBtn.addEventListener('click', () => {
    plugboardScreen.style.animation = 'fadeOut 0.4s ease-out';
    setTimeout(() => {
      plugboardScreen.style.display = 'none';
      plugboardScreen.style.animation = 'fadeIn 0.4s ease-out';
    }, 350);
  });
});
