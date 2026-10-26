import { pointer, reduceMotion } from "./pointer.js";

let count = 0;

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const f = (n) => n.toFixed(2);

// The eye sits at the centre of a tall 100×160 drawing, surrounded by a
// starburst of jagged spikes that reach furthest straight up and down.
const CX = 50;
const CY = 80;
const EYE_W = 16; // half-width when fully open
const EYE_H = 28; // half-height of the eye opening (it stands upright)
const IRIS_SCALE = 0.85; // shrinks the iris and pupil around the eye's centre

// Seeded random numbers, so every eye on the page gets the same spikes.
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const polar = (angle, radius) => [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius];

// Distance from the centre to the edge of the eye opening at a given angle.
function eyeRadius(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return (EYE_W * EYE_H) / Math.hypot(EYE_H * c, EYE_W * s);
}

// Builds the spiky burst once: its outline and the scratchy strokes inside
// the spikes.
function buildBurst() {
  const rnd = seeded(11);
  const spikes = 20; // a multiple of 4, so there is a spike straight up and down
  const step = (Math.PI * 2) / spikes;
  const outline = [];
  const hatches = [];
  const point = ([x, y]) => `L${f(x)} ${f(y)}`;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  // Small barbs jutting outward along an edge make it look torn, like flame.
  function edge(from, to, angle, barbs) {
    const pts = [];
    for (let b = 1; b <= barbs; b++) {
      const q = b / (barbs + 1) + (rnd() - 0.5) * 0.1;
      const base = lerp(from, to, q);
      const out = 2.5 + rnd() * 4;
      pts.push(point(base), point([base[0] + Math.cos(angle) * out, base[1] + Math.sin(angle) * out]), point(lerp(from, to, q + 0.07)));
    }
    return pts;
  }

  let prevValley = polar(-step / 2, eyeRadius(-step / 2) + 4);
  const first = prevValley;
  for (let i = 0; i < spikes; i++) {
    const angle = i * step;
    // How many spikes away from straight up or down: those spikes are longest,
    // and their neighbours taper off, so the burst reads as a tall diamond.
    const fromVertical = Math.min(Math.abs(i - spikes / 4), Math.abs(i - (spikes * 3) / 4));
    const length = [79, 58, 47][fromVertical] ?? 31 + rnd() * 8;

    const tip = polar(angle + (rnd() - 0.5) * 0.08, length);
    const valleyAngle = angle + step / 2;
    const valley = polar(valleyAngle, eyeRadius(valleyAngle) + 3 + rnd() * 4);
    const barbs = length > 55 ? 3 : length > 44 ? 2 : 1;

    outline.push(...edge(prevValley, tip, angle, barbs), point(tip), ...edge(tip, valley, angle, barbs), point(valley));
    prevValley = valley;

    // Scratchy strokes running out along each spike.
    const strokes = length > 50 ? 4 : 2;
    for (let k = 0; k < strokes; k++) {
      const a = angle + (rnd() - 0.5) * 0.12;
      const start = eyeRadius(a) + 2 + rnd() * 4;
      const end = start + (length - start) * (0.45 + rnd() * 0.4);
      const [x1, y1] = polar(a, start);
      const [x2, y2] = polar(a + (rnd() - 0.5) * 0.05, end);
      const roll = rnd();
      const tone = roll > 0.85 ? "cyan" : roll > 0.65 ? "gold" : "red";
      hatches.push(`<path class="hatch ${tone}" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" />`);
    }
  }
  const d = `M${f(first[0])} ${f(first[1])} ${outline.join(" ")} Z`;

  return { d, hatches: hatches.join("") };
}

// Iris details: a golden spiral, fine fibres radiating out, a cyan rim.
function buildIris() {
  const rnd = seeded(5);
  const spiral = [];
  for (let t = 0; t <= Math.PI * 7; t += 0.25) {
    const r = 2.2 + (t / (Math.PI * 7)) * 8.5;
    spiral.push(`${f(CX + Math.cos(t) * r)} ${f(CY + Math.sin(t) * r)}`);
  }
  const fibres = [];
  for (let k = 0; k < 36; k++) {
    const a = (k / 36) * Math.PI * 2 + rnd() * 0.1;
    const r1 = 4 + rnd() * 2;
    const r2 = 10 + rnd() * 3;
    const mid = (r1 + r2) / 2;
    const bend = (rnd() - 0.5) * 0.35;
    const [x1, y1] = polar(a, r1);
    const [xm, ym] = polar(a + bend, mid);
    const [x2, y2] = polar(a, r2);
    fibres.push(`M${f(x1)} ${f(y1)} Q${f(xm)} ${f(ym)} ${f(x2)} ${f(y2)}`);
  }
  return { spiral: `M${spiral.join(" L")}`, fibres: fibres.join(" ") };
}

// Bloodshot veins for when the eye is irritated: red threads creeping in from
// the edge of the eyeball toward the iris, each with a small side branch.
function buildAngryVeins() {
  const rnd = seeded(23);
  const veins = [];
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2 + (rnd() - 0.5) * 0.3;
    const edge = eyeRadius(a);
    const [x1, y1] = polar(a, edge + 1);
    const [xm, ym] = polar(a + (rnd() - 0.5) * 0.35, edge * 0.75);
    const [x2, y2] = polar(a + (rnd() - 0.5) * 0.3, 11 + rnd() * 4);
    veins.push(`M${f(x1)} ${f(y1)} Q${f(xm)} ${f(ym)} ${f(x2)} ${f(y2)}`);
    const [bx, by] = polar(a + (rnd() < 0.5 ? -1 : 1) * (0.25 + rnd() * 0.2), edge * 0.7);
    veins.push(`M${f(xm)} ${f(ym)} L${f(bx)} ${f(by)}`);
  }
  return veins.join(" ");
}

let shapes;

// Builds a spiked, slit-pupilled eye inside `slot`. It keeps blinking and
// tracking the cursor until it is removed from the page.
//   intro:  play the slow wake-up sequence instead of starting open
//   onOpen: called with the eye's centre (in viewport px) once it is fully open
//   onPoke: if given, clicking the eye irritates it (rapid blinks, bloodshot
//           veins, an angry squint), then calls this with the eye's centre
export function mountEye(slot, { intro = false, onOpen, onPoke } = {}) {
  shapes ??= { burst: buildBurst(), iris: buildIris(), angryVeins: buildAngryVeins() };
  const { burst, iris: irisShape, angryVeins } = shapes;
  const id = `eye-clip-${++count}`;

  slot.innerHTML = `
    <svg class="eye" viewBox="0 0 100 160" role="img" aria-label="Esper logo: a spiked, burning eye">
      <defs>
        <clipPath id="${id}"><path class="lid" /></clipPath>
        <!-- Hides the eye's outline wherever the frowning lid covers it. -->
        <mask id="${id}-frown" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="160">
          <rect width="100" height="160" fill="white" />
          <path class="frown-mask" fill="black" />
        </mask>
      </defs>
      <g class="burst">
        <path class="halo" d="${burst.d}" />
        <g filter="url(#flicker)">
          <path class="spikes" d="${burst.d}" />
          ${burst.hatches}
        </g>
      </g>
      <path class="lid sclera" />
      <g clip-path="url(#${id})">
        <path class="lid flush" />
        <path class="vein" d="M50 53 q-3 8 -1 14 M50 107 q3 -7 0 -13 M46 56 q1 6 3 10 M54 104 q-1 -5 -3 -9" />
        <path class="angry-veins" d="${angryVeins}" />
        <g class="iris">
          <g transform="translate(${CX} ${CY}) scale(${IRIS_SCALE}) translate(${-CX} ${-CY})">
            <circle cx="${CX}" cy="${CY}" r="13" fill="url(#iris-fill)" />
            <path class="fibres" d="${irisShape.fibres}" />
            <path class="spiral" d="${irisShape.spiral}" />
            <circle class="rim" cx="${CX}" cy="${CY}" r="12.6" />
            <path class="pupil" />
          </g>
        </g>
        <path class="upper-lid" />
      </g>
      <path class="lid outline" mask="url(#${id}-frown)" />
      <!-- The frown: a heavy V-shaped lid line. -->
      <g class="frown">
        <path class="lid-line" />
        <path class="lid-glow" />
      </g>
    </svg>`;

  const svg = slot.querySelector("svg");
  const lids = svg.querySelectorAll(".lid");
  const iris = svg.querySelector(".iris");
  const pupil = svg.querySelector(".pupil");
  const burstEl = svg.querySelector(".burst");
  const upperLid = svg.querySelector(".upper-lid");
  const frownEl = svg.querySelector(".frown");
  const [lidLine, lidGlow] = frownEl.querySelectorAll("path");
  const frownMask = svg.querySelector(".frown-mask");
  const alive = () => svg.isConnected;

  // openness: 0 = shut, 1 = fully open. The eye stands upright, so the lids
  // are left/right quadratic curves whose control points close toward the
  // vertical centre line. The slit pupil is a little wider while the eye is
  // half shut, as if adjusting to the light.
  function setOpenness(o) {
    const reach = EYE_W * 2 * o;
    const d = `M${CX} ${CY - EYE_H} Q${CX - reach} ${CY} ${CX} ${CY + EYE_H} Q${CX + reach} ${CY} ${CX} ${CY - EYE_H} Z`;
    for (const el of lids) el.setAttribute("d", d);
    const slit = 1.4 + (1 - o) * 1.6;
    pupil.setAttribute("d", `M${CX} ${CY - 11} Q${CX + slit * 2} ${CY} ${CX} ${CY + 11} Q${CX - slit * 2} ${CY} ${CX} ${CY - 11} Z`);
    burstEl.style.opacity = 0.75 + o * 0.25;
  }

  // frown: 0 = relaxed, 1 = full scowl. The upper lid drops into a sharp V
  // that cuts across the top of the eye and over the iris, with a heavy line
  // along its edge, like an angry cartoon eye. The eye's own outline is masked
  // out above the V so it doesn't show through the lid.
  function setFrown(amount) {
    const top = CY - EYE_H;
    const vertex = top + 22 * amount; // the V's point, pressing down the middle
    const ends = top + 6 * amount; // its outer ends, just past the eye's edges
    const v = `M${CX - 20} ${f(ends)} L${CX} ${f(vertex)} L${CX + 20} ${f(ends)}`;
    const cover = `M${CX - 20} ${top - 10} L${CX + 20} ${top - 10} L${CX + 20} ${f(ends)} L${CX} ${f(vertex)} L${CX - 20} ${f(ends)} Z`;
    upperLid.setAttribute("d", cover);
    frownMask.setAttribute("d", amount > 0.01 ? cover : "");
    lidLine.setAttribute("d", v);
    lidGlow.setAttribute("d", v);
    frownEl.style.opacity = Math.min(1, amount * 3);
  }

  function animate(from, to, ms, apply) {
    return new Promise((resolve) => {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / ms, 1);
        apply(from + (to - from) * ease(t));
        t < 1 ? requestAnimationFrame(step) : resolve();
      }
      requestAnimationFrame(step);
    });
  }

  function animateOpenness(from, to, ms) {
    return new Promise((resolve) => {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / ms, 1);
        setOpenness(from + (to - from) * ease(t));
        t < 1 ? requestAnimationFrame(step) : resolve();
      }
      requestAnimationFrame(step);
    });
  }

  // Only one lid animation at a time, so a click can't collide with an idle blink.
  let busy = false;

  async function blink() {
    if (busy) return;
    busy = true;
    await animateOpenness(1, 0, 170);
    await animateOpenness(0, 1, 280);
    busy = false;
  }

  const centre = () => {
    const rect = svg.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  function opened() {
    onOpen?.(centre());
  }

  async function wakeUp() {
    busy = true;
    setOpenness(0);
    await wait(400);
    await animateOpenness(0, 0.35, 500); // groggy half-open
    await wait(250);
    await animateOpenness(0.35, 0, 160);
    await wait(200);
    await animateOpenness(0, 1, 450);
    opened();
    busy = false;
    await wait(300);
    await blink();
  }

  // No idle blinking while the cursor is over the eye: it holds your gaze.
  let hovering = false;
  svg.addEventListener("pointerenter", () => (hovering = true));
  svg.addEventListener("pointerleave", () => (hovering = false));

  async function idleBlinks() {
    while (alive()) {
      await wait(6000 + Math.random() * 6000);
      if (!alive()) break;
      if (hovering) continue;
      await blink();
      if (Math.random() < 0.1) await blink(); // rare double blink
    }
  }

  // Iris follows the cursor, eased so it glides instead of snapping. The eye
  // is tall and narrow, so the iris travels mostly up and down.
  const look = { x: 0, y: 0 };
  const MAX_X = 4;
  const MAX_Y = 12;

  function trackIris() {
    if (!alive()) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let tx = 0;
    let ty = 0;
    if (pointer.active) {
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      // Reach full deflection at ~300px away; closer points look less far.
      const reach = Math.min(dist / 300, 1);
      tx = (dx / dist) * MAX_X * reach;
      ty = (dy / dist) * MAX_Y * reach;
    }

    look.x += (tx - look.x) * 0.12;
    look.y += (ty - look.y) * 0.12;
    iris.setAttribute("transform", `translate(${look.x.toFixed(2)} ${look.y.toFixed(2)})`);
    requestAnimationFrame(trackIris);
  }

  if (onPoke) {
    svg.classList.add("pokeable");
    svg.setAttribute("role", "button");
    svg.setAttribute("tabindex", "0");
    svg.setAttribute("aria-label", "Esper logo: a spiked, burning eye. Click to annoy it.");
    // Clicking irritates the eye: it scowls right away (a V-shaped frown and
    // bloodshot veins) while blinking rapidly and sending out the background
    // wave, then holds the scowl for a couple of seconds. Clicking again while it's irritated sends another wave and
    // keeps it annoyed for longer.
    const SQUINT = 0.8; // the frown does most of the work, so only a slight squint
    const ANNOYED_MS = 1800; // how long the scowl holds after it appears
    let irritated = false;
    let calmAt = 0;

    const poke = async () => {
      calmAt = performance.now() + ANNOYED_MS;
      if (irritated) return onPoke(centre());
      irritated = true;
      // React immediately: the scowl, veins and wave start on the click itself.
      svg.classList.add("irritated");
      onPoke(centre());
      const scowl = reduceMotion ? setFrown(1) : animate(0, 1, 120, setFrown);
      while (busy) await wait(20); // let an idle blink or the intro finish
      busy = true;
      if (!reduceMotion) {
        for (let k = 0; k < 3; k++) {
          await animateOpenness(1, 0, 40);
          await animateOpenness(0, 1, 55);
        }
        await Promise.all([scowl, animateOpenness(1, SQUINT, 140)]);
      }
      // Count the hold from when the scowl is actually showing, so it always
      // gets its full time even if the blinks ran slowly.
      calmAt = Math.max(calmAt, performance.now() + ANNOYED_MS);
      while (performance.now() < calmAt) await wait(100);
      svg.classList.remove("irritated");
      if (reduceMotion) setFrown(0);
      else await Promise.all([animateOpenness(SQUINT, 1, 450), animate(1, 0, 450, setFrown)]);
      busy = false;
      irritated = false;
    };
    svg.addEventListener("click", poke);
    svg.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        poke();
      }
    });
  }

  setFrown(0);
  if (intro && !reduceMotion) {
    wakeUp().then(idleBlinks);
  } else {
    setOpenness(1);
    if (!reduceMotion) idleBlinks();
  }
  // Wait a frame so the eye is laid out before measuring it.
  requestAnimationFrame(trackIris);
}
