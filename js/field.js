import { pointer, reduceMotion } from "./pointer.js";

// Background "heat shimmer": a grid of text characters that only appear where
// a slowly drifting wave field crosses certain levels. The visible bands look
// like contour lines, and they rise up the screen like heat off a fire.

// Grid sizes in rem, so the characters scale with the rest of the site.
const CELL_W_REM = 0.875;
const CELL_H_REM = 1.125;
const FONT_REM = 0.75;
const IDLE_FRAME_MS = 50; // ~20fps is plenty for slow drift
const BURST_FRAME_MS = 16;
const BURST_MS = 2800;

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let dpr = 1;
let rem = 16;
let bursts = [];
let lastFrame = 0;
const look = { x: 0.5, y: 0.5 }; // eased pointer, in 0..1 screen units
let base = [198, 101, 16]; // character color, from the theme's --field
let hot = [244, 220, 123]; // color characters heat up to in a burst, --field-hot

// Reads a hex color custom property from the page as [r, g, b].
function cssColor(name, fallback) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback;
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function readTheme() {
  base = cssColor("--field", base);
  hot = cssColor("--field-hot", hot);
}

// Cheap repeatable pseudo-random number in [0, 1) for a grid cell.
function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth value noise: blends the hashes of the four surrounding corners.
function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const top = hash(xi, yi) * (1 - sx) + hash(xi + 1, yi) * sx;
  const bottom = hash(xi, yi + 1) * (1 - sx) + hash(xi + 1, yi + 1) * sx;
  return top * (1 - sy) + bottom * sy;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// The wave field. `u`/`v` are 0..1 screen coordinates, `t` is seconds.
// Adding time to `v` makes every feature drift upward.
function heat(u, v, t, aspect) {
  const rise = v + t * 0.035;
  const ux = u * aspect;
  const warp =
    (noise(ux * 3 + t * 0.05, rise * 3) - 0.5) * 0.8 + (noise(ux * 7 + 5, rise * 7 + 11) - 0.5) * 0.3;
  return (
    Math.sin(ux * 6 + rise * 3 + warp * 2) * 0.9 +
    Math.sin(rise * 13 - ux * 3 + t * 0.3) * 0.5 +
    Math.sin((ux + rise) * 15 + t * 0.2) * 0.25 +
    warp
  );
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  draw(performance.now());
}

function draw(now) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / h;
  const t = reduceMotion ? 0 : now / 1000;

  if (pointer.active) {
    look.x += (pointer.x / w - look.x) * 0.12;
    look.y += (pointer.y / h - look.y) * 0.12;
  }

  // Bursts: bright rings of embers expanding from a point. Several can be
  // in flight at once, e.g. when the eye is clicked repeatedly.
  bursts = bursts.filter((b) => now - b.start < BURST_MS);
  const rings = bursts.map((b) => {
    const p = (now - b.start) / BURST_MS;
    return { x: b.x / w, y: b.y / h, radius: p * Math.hypot(aspect, 1), fade: clamp01((1 - p) / 0.3) };
  });

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const cellW = CELL_W_REM * rem;
  const cellH = CELL_H_REM * rem;
  ctx.font = `${FONT_REM * rem}px "Monocraft", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let row = 1; row * cellH < h; row++) {
    for (let col = 1; col * cellW < w; col++) {
      const x = col * cellW;
      const y = row * cellH;
      const u = x / w;
      const v = y / h;

      // The cursor pushes the field up locally, bending nearby contours.
      const pdx = (u - look.x) * aspect;
      const pdy = v - look.y;
      const near = clamp01(1 - Math.hypot(pdx, pdy) / 0.28);
      const level = heat(u, v, t, aspect) + near * near * 0.7;

      const contour = Math.abs(Math.sin(level * 2.6));
      const r = hash(col, row);
      const shown = clamp01((contour - (0.9 + r * 0.08) + 0.03) / 0.05);

      let flare = 0;
      for (const ring of rings) {
        const d = Math.hypot((u - ring.x) * aspect, v - ring.y);
        const band = (d - ring.radius) / 0.12;
        flare = Math.max(flare, Math.exp(-band * band * 2) * ring.fade * (0.25 + contour * 0.75));
      }
      if (shown < 0.01 && flare < 0.01) continue;

      // Fade out near the screen edges.
      const edge = Math.min(1, u / 0.04, (1 - u) / 0.04) * Math.min(1, v / 0.05, (1 - v) / 0.05);
      const alpha = ((0.3 + Math.max(0, contour - 0.9) * 0.9) * shown + flare * 0.85) * edge;
      // Blend from the base color toward the hot color inside a burst.
      const heatUp = clamp01(flare * 1.8);
      const [red, green, blue] = base.map((c, i) => Math.round(c + (hot[i] - c) * heatUp));

      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      ctx.fillText(r > 0.93 ? "*" : r > 0.66 ? ":" : ".", x, y);
    }
  }
}

// Paused by the visitor (the pause-motion button): the field freezes on its
// current frame until resumed.
let paused = false;

export function setPaused(value) {
  if (value === paused) return;
  paused = value;
  bursts = [];
  if (!paused && !reduceMotion) requestAnimationFrame(loop);
}

function loop(now) {
  if (paused) return;
  const interval = bursts.length ? BURST_FRAME_MS : IDLE_FRAME_MS;
  if (now - lastFrame >= interval) {
    draw(now);
    lastFrame = now;
  }
  requestAnimationFrame(loop);
}

// Send a ring of light across the field from (x, y) in viewport pixels.
export function burstAt(x, y) {
  if (reduceMotion || paused) return;
  bursts.push({ x, y, start: performance.now() });
}

window.addEventListener("resize", resize);
document.addEventListener("themechange", () => {
  readTheme();
  draw(performance.now());
});
readTheme();
resize();
if (!reduceMotion) requestAnimationFrame(loop);
