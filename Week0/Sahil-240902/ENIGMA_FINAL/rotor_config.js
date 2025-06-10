import { ROTOR_PERMUTATIONS, ALPHABET } from './constants.js';
import { offsets, redrawAll_wo_ctx, userOffsets } from './enigma.js';

const rotorsArea = document.getElementById('rotors-area');
const offsetArea = document.getElementById('offset-area');
const saveBtn = document.getElementById('rotor-save-btn');
const rotorSound = new Audio("rotorsound.wav");

// Rotor data
let userRotors = ROTOR_PERMUTATIONS.slice(0, 5);
let selectedRotors = [0, 1, 2]; // Default selected rotors

function playRotorSound() {
  rotorSound.currentTime = 0;
  rotorSound.volume = 0.3;
  rotorSound.play().catch(() => {});
  setTimeout(() => { rotorSound.pause(); rotorSound.currentTime = 0; }, 50);
}

function renderRotors() {
  rotorsArea.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const row = document.createElement('div');
    row.className = 'rotor-row';
    
    // Add gear icon
    const gear = document.createElement('div');
    gear.className = 'gear-icon';
    gear.innerHTML = '⚙️';
    row.appendChild(gear);
    
    // Rotor box with permutation string
    const box = document.createElement('div');
    box.className = 'rotor-box';
    box.textContent = userRotors[i];
    box.title = "Double-click to edit wiring";
    
    box.addEventListener('dblclick', () => {
      box.classList.add('editing');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = userRotors[i];
      input.maxLength = 26;
      input.size = 28;
      
      input.addEventListener('blur', () => {
        if (/^[A-Z]{26}$/.test(input.value)) {
          userRotors[i] = input.value;
          box.textContent = input.value;
        }
        box.classList.remove('editing');
      });
      
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') input.blur();
      });
      
      box.innerHTML = '';
      box.appendChild(input);
      input.focus();
    });
    
    // Checkbox for selecting this rotor
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'rotor-checkbox';
    checkbox.checked = selectedRotors.includes(i);
    
    checkbox.addEventListener('change', () => {
      playRotorSound();
      if (checkbox.checked) {
        // Only allow 3 rotors to be selected
        if (selectedRotors.length < 3) selectedRotors.push(i);
        else checkbox.checked = false;
      } else {
        selectedRotors = selectedRotors.filter(idx => idx !== i);
      }
      
      // Re-render to update position labels
      renderRotors();
      renderOffsets();
    });
    
    // Add position label if selected
    const pos = selectedRotors.indexOf(i);
    if (pos !== -1) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'rotor-pos-label';
      
      // Show Left, Middle, Right based on position
      switch(pos) {
        case 0: labelSpan.textContent = 'Left'; break;
        case 1: labelSpan.textContent = 'Middle'; break;
        case 2: labelSpan.textContent = 'Right'; break;
      }
      
      row.appendChild(box);
      row.appendChild(checkbox);
      row.appendChild(labelSpan);
    } else {
      row.appendChild(box);
      row.appendChild(checkbox);
    }
    
    rotorsArea.appendChild(row);
  }
  
  renderOffsets();
}

function renderOffsets() {
  offsetArea.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'offset-row';
  
  // Labels for the selected rotors
  const positions = ['Left', 'Middle', 'Right'];
  
  // Create offset boxes for selected rotors
  selectedRotors.sort().forEach((rotorIdx, pos) => {
    const container = document.createElement('div');
    container.className = 'offset-container';
    
    const label = document.createElement('div');
    label.className = 'offset-label';
    label.textContent = positions[pos] + ' Rotor';
    
    const offsetBox = document.createElement('div');
    offsetBox.className = 'offset-box';
    offsetBox.textContent = ALPHABET[userOffsets[pos]];
    offsetBox.title = "Click to change offset";
    
    offsetBox.addEventListener('click', () => {
      offsetBox.classList.add('editing');
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = offsetBox.textContent;
      input.maxLength = 1;
      input.size = 1;
      
      input.addEventListener('blur', () => {
        const val = input.value.toUpperCase();
        if (/^[A-Z]$/.test(val)) {
          userOffsets[pos] = ALPHABET.indexOf(val);
          offsetBox.textContent = val;
          playRotorSound();
        }
        offsetBox.classList.remove('editing');
      });
      
      offsetBox.innerHTML = '';
      offsetBox.appendChild(input);
      input.focus();
    });
    
    container.appendChild(label);
    container.appendChild(offsetBox);
    row.appendChild(container);
  });
  
  offsetArea.appendChild(row);
}

// Change the save button to return to main screen
saveBtn.addEventListener('click', () => {
  if (selectedRotors.length !== 3) {
    alert("Select exactly 3 rotors.");
    return;
  }
  
  // Save configuration
  offsets[0] = userOffsets[0];
  offsets[1] = userOffsets[1];
  offsets[2] = userOffsets[2];
  
  window.userRotorWiring = selectedRotors.map(i => userRotors[i]);
  window.userRotorOffsets = userOffsets.slice();
  
  playRotorSound();
  
  // Return to main screen instead of alert
  const rotorsScreen = document.getElementById('rotors-screen');
  rotorsScreen.style.animation = 'fadeOut 0.4s ease-out';
  setTimeout(() => {
    rotorsScreen.style.display = 'none';
    rotorsScreen.style.animation = 'fadeIn 0.4s ease-out';
    document.getElementById('app-container').style.display = 'flex';
    redrawAll_wo_ctx(); // <-- show main window
  }, 350);
});

document.addEventListener('DOMContentLoaded', renderRotors);
window.renderRotors = renderRotors;
