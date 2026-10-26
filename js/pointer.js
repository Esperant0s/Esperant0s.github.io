// Cursor position shared by the eyes and the background field.
export const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

window.addEventListener(
  "pointermove",
  (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  },
  { passive: true }
);
document.addEventListener("pointerleave", () => (pointer.active = false));

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
