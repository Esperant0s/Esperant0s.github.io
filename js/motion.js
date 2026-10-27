import { setPaused } from "./field.js";

// A button that pauses everything that moves on its own: the background
// characters, the flickering spikes and glows. The choice is remembered.
// (Visitors whose device asks for reduced motion get a still page already.)

const STORAGE_KEY = "motion-paused";

export const motionPaused = () => document.documentElement.classList.contains("motion-paused");

function apply(paused) {
  document.documentElement.classList.toggle("motion-paused", paused);
  setPaused(paused);
  // The flicker on the eye's spikes is an SVG animation, paused separately.
  const defs = document.querySelector("svg.defs");
  if (paused) defs?.pauseAnimations();
  else defs?.unpauseAnimations();
}

const icons = {
  pause: `<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="2" y="1.5" width="2" height="7" /><rect x="6" y="1.5" width="2" height="7" /></svg>`,
  play: `<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.5 L8.5 5 L2.5 8.5 Z" /></svg>`,
};

export function mountMotionToggle(button) {
  let paused = false;
  try {
    paused = localStorage.getItem(STORAGE_KEY) === "1";
  } catch {}

  function render() {
    button.innerHTML = paused ? icons.play : icons.pause;
    button.setAttribute("aria-pressed", String(paused));
    button.title = paused ? "Resume animations" : "Pause animations";
  }

  button.setAttribute("aria-label", "Pause animations");
  button.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem(STORAGE_KEY, paused ? "1" : "0");
    } catch {}
    apply(paused);
    render();
  });

  apply(paused);
  render();
}
