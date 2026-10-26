import { reduceMotion } from "./pointer.js";

// The eye's laser blast and the lockout that follows it. The lockout time is
// kept in the visitor's browser so reloading doesn't get them back in early.

const STORAGE_KEY = "eye-locked-until";
export const LOCKOUT_MS = 5 * 60 * 1000;

// Timestamp (ms) the lockout ends, or 0 if the visitor isn't locked out.
export function lockedUntil() {
  try {
    const until = Number(localStorage.getItem(STORAGE_KEY));
    return until > Date.now() ? until : 0;
  } catch {
    return 0;
  }
}

function lockOut() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + LOCKOUT_MS));
  } catch {
    // Without storage the lockout only lasts until the page is reloaded.
  }
}

export function forgive() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Fires the laser from (x, y): a beam of the theme's color bursts out from
// the eye and floods the screen, then fades away to reveal the lockout page.
// `reveal` is called while the screen is fully covered, to swap the page.
export async function blast({ x, y }, reveal) {
  lockOut();

  const flash = document.createElement("div");
  flash.className = "laser-flash";
  flash.innerHTML = `<div class="laser-core"></div><div class="laser-ring"></div>`;
  flash.style.setProperty("--x", `${x}px`);
  flash.style.setProperty("--y", `${y}px`);
  // Start as a single point on the eye, set before it's on the page, so not
  // even one frame of full-screen color shows before the burst begins.
  const point = `circle(0px at ${x}px ${y}px)`;
  if (!reduceMotion) flash.style.clipPath = point;
  document.body.append(flash);
  const [core, ring] = flash.children;

  if (!reduceMotion) {
    // The farthest screen corner from the eye: the burst must reach it.
    const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // The beam: a disc of color bursting out of the eye (fast at first, so its
    // origin is obvious), a white-hot shockwave ring leading it, and a bright
    // core at the eye that lingers.
    await Promise.all([
      flash.animate([{ clipPath: point }, { clipPath: `circle(${reach}px at ${x}px ${y}px)` }], {
        duration: 520,
        easing: "cubic-bezier(0.2, 0.7, 0.4, 1)",
        fill: "forwards",
      }).finished,
      ring.animate([{ transform: "translate(-50%, -50%) scale(0)", opacity: 1 }, { transform: `translate(-50%, -50%) scale(${reach / 50})`, opacity: 0 }], {
        duration: 520,
        easing: "cubic-bezier(0.2, 0.7, 0.4, 1)",
        fill: "forwards",
      }).finished,
      core.animate([{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 700, fill: "forwards" }).finished,
    ]);
  } else {
    await flash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: "forwards" }).finished;
  }

  reveal();

  // Hold the solid color for a beat, then let it fade away.
  await flash.animate([{ opacity: 1 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], {
    duration: reduceMotion ? 400 : 1400,
    easing: "ease-out",
    fill: "forwards",
  }).finished;
  flash.remove();
}
