import { updateDirection } from './ws-connect.js';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function handleInput(x, y) {
  const direction = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(direction);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
}
