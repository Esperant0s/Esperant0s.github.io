// Builds the site's favicon and link-preview (Open Graph) images from the same
// eye geometry the page draws, in the default Halloween Glow colors.
//
//   node scripts/make-icons.mjs
//
// Writes:
//   icons/favicon.svg          vector tab icon (transparent)
//   icons/favicon-32.png       PNG fallback, also packed into /favicon.ico
//   icons/apple-touch-icon.png 180×180 home-screen icon (opaque, iOS rounds it)
//   icons/og.png               1200×630 link preview
// PNGs are rendered by headless Firefox; the preview's text uses Monocraft,
// embedded into it from /fonts. The art brief is in scripts/icons.brief.md.

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// eye.js expects a browser; give it just enough to load.
globalThis.window = { innerWidth: 0, innerHeight: 0, addEventListener() {}, matchMedia: () => ({ matches: false }) };
globalThis.document = { addEventListener() {} };
const { eyeGeometry } = await import("../js/eye.js");
const { CX, CY, EYE_W, EYE_H, IRIS_SCALE, burst, iris } = eyeGeometry();

/* ---------- Halloween Glow colors, worked out like style.css does ---------- */

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, pa) => "#" + hex(a).map((c, i) => Math.round(c * pa + hex(b)[i] * (1 - pa)).toString(16).padStart(2, "0")).join("");
const bg = "#0a0a0a", text = "#f7ebdd", accent = "#ffb627", accent2 = "#ff6700", pop = "#9b1d20";
const c = {
  bg,
  text,
  muted: mix(text, bg, 0.55),
  accent,
  tanLight: mix(accent, "#ffffff", 0.65),
  tan: accent,
  tanDark: mix(accent, bg, 0.55),
  coralLight: mix(accent2, "#ffffff", 0.7),
  coral: accent2,
  red: mix(accent2, "#000000", 0.65),
  maroon: mix(accent2, bg, 0.3),
  gold: pop,
  cyan: mix(pop, "#ffffff", 0.6),
  ink: mix(bg, "#000000", 0.5),
};

/* ---------- the eye, as a standalone SVG fragment ---------- */

const lid = `M${CX} ${CY - EYE_H} Q${CX - EYE_W * 2} ${CY} ${CX} ${CY + EYE_H} Q${CX + EYE_W * 2} ${CY} ${CX} ${CY - EYE_H} Z`;
const pupil = `M${CX} ${CY - 11} C${CX + 1.87} ${CY} ${CX + 1.87} ${CY} ${CX} ${CY + 11} C${CX - 1.87} ${CY} ${CX - 1.87} ${CY} ${CX} ${CY - 11} Z`;

// `detail` adds the scratchy streaks, iris spiral and glow — lovely large,
// mush at 16px, so the favicon leaves them out.
function eye(id, { detail }) {
  const hatches = burst.hatches
    .replace(/class="hatch red"/g, `stroke="${c.red}"`)
    .replace(/class="hatch gold"/g, `stroke="${c.gold}"`)
    .replace(/class="hatch cyan"/g, `stroke="${c.cyan}"`);
  return `
  <defs>
    <radialGradient id="${id}-burst" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="80">
      <stop offset="0" stop-color="${c.tanLight}"/><stop offset=".3" stop-color="${c.tan}"/>
      <stop offset=".6" stop-color="${c.red}"/><stop offset="1" stop-color="${c.maroon}"/>
    </radialGradient>
    <radialGradient id="${id}-sclera" cx=".5" cy=".45" r=".6">
      <stop offset="0" stop-color="${c.tanLight}"/><stop offset=".65" stop-color="${c.tan}"/><stop offset="1" stop-color="${c.tanDark}"/>
    </radialGradient>
    <radialGradient id="${id}-iris">
      <stop offset="0" stop-color="${c.gold}"/><stop offset=".35" stop-color="${c.coralLight}"/>
      <stop offset=".85" stop-color="${c.coral}"/><stop offset="1" stop-color="${c.red}"/>
    </radialGradient>
    <clipPath id="${id}-lid"><path d="${lid}"/></clipPath>
    ${detail ? `<filter id="${id}-halo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>` : ""}
  </defs>
  ${detail ? `<path d="${burst.d}" fill="${c.coral}" opacity=".4" filter="url(#${id}-halo)"/>` : ""}
  <path d="${burst.d}" fill="url(#${id}-burst)" stroke="${c.ink}" stroke-width="${detail ? 1.4 : 2.4}"/>
  ${detail ? `<g fill="none" stroke-width=".6" stroke-linecap="round" opacity=".85">${hatches}</g>` : ""}
  <path d="${lid}" fill="url(#${id}-sclera)"/>
  <g clip-path="url(#${id}-lid)">
    <g transform="translate(${CX} ${CY}) scale(${IRIS_SCALE}) translate(${-CX} ${-CY})">
      <circle cx="${CX}" cy="${CY}" r="13" fill="url(#${id}-iris)"/>
      ${detail ? `<path d="${iris.spiral}" fill="none" stroke="${c.gold}" stroke-width=".9" stroke-linecap="round"/>` : ""}
      <circle cx="${CX}" cy="${CY}" r="12.6" fill="none" stroke="${c.cyan}" stroke-width="${detail ? 1 : 1.6}"/>
      <path d="${pupil}" fill="${c.ink}"/>
    </g>
  </g>
  <path d="${lid}" fill="none" stroke="${c.ink}" stroke-width="${detail ? 2.2 : 3.2}" stroke-linejoin="round"/>`;
}

/* ---------- favicon: cropped tight around the eye so it reads when tiny ---------- */

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 38 84 84">${eye("i", { detail: false })}
</svg>
`;
writeFileSync(join(ROOT, "icons/favicon.svg"), faviconSvg);

/* ---------- link preview: the eye beside the name, on the site's background ---------- */

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>
    @font-face { font-family: Monocraft; src: url("data:font/ttf;base64,${readFileSync(join(ROOT, "fonts/Monocraft.ttf")).toString("base64")}"); }
    text { font-family: Monocraft, monospace; }
  </style>
  <defs>
    <pattern id="dots" width="22" height="26" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="13" r="1.3" fill="${accent2}" opacity=".18"/>
    </pattern>
    <radialGradient id="warm" cx=".3" cy=".5" r=".6">
      <stop offset="0" stop-color="${accent2}" stop-opacity=".22"/><stop offset="1" stop-color="${accent2}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${c.bg}"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#warm)"/>
  <svg x="120" y="35" width="350" height="560" viewBox="0 0 100 160" overflow="visible">${eye("o", { detail: true })}
  </svg>
  <text x="540" y="300" font-size="150" fill="${c.text}">Esper</text>
  <text x="546" y="372" font-size="30" fill="${c.muted}">I love making things that are</text>
  <text x="546" y="414" font-size="30" fill="${c.muted}">unique and always watching.</text>
  <text x="546" y="500" font-size="26" fill="${c.accent}">esperant0s.github.io</text>
</svg>
`;

/* ---------- render PNGs with headless Firefox ---------- */

const work = mkdtempSync(join(tmpdir(), "esper-icons-"));
function render(name, html, width, height, out) {
  const page = join(work, `${name}.html`);
  writeFileSync(page, `<!doctype html><html><body style="margin:0;overflow:hidden">${html}</body></html>`);
  const profile = mkdtempSync(join(work, "profile-"));
  execFileSync("firefox", ["--headless", "--no-remote", "--profile", profile, `--window-size=${width},${height}`, "--screenshot", out, `file://${page}`], {
    stdio: "ignore",
    timeout: 60000,
  });
}

// Opaque tiles for the PNGs: tab icons and home-screen icons are usually shown on a background anyway.
const tile = (size, pad) =>
  `<div style="width:${size}px;height:${size}px;background:${c.bg};display:grid;place-items:center">` +
  `<img src="file://${join(ROOT, "icons/favicon.svg")}" style="width:${size - pad * 2}px;height:${size - pad * 2}px"></div>`;

render("favicon-32", tile(32, 0), 32, 32, join(ROOT, "icons/favicon-32.png"));
render("apple", tile(180, 14), 180, 180, join(ROOT, "icons/apple-touch-icon.png"));
// Inline rather than <img>: an SVG loaded as an image can't use its own fonts.
render("og", ogSvg, 1200, 630, join(ROOT, "icons/og.png"));

// favicon.ico: an ICO file can simply wrap a PNG, which every current browser reads.
const png = readFileSync(join(ROOT, "icons/favicon-32.png"));
const header = Buffer.alloc(22); // 6-byte directory + one 16-byte entry
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // no palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // where the image starts: right after this header
writeFileSync(join(ROOT, "favicon.ico"), Buffer.concat([header, png]));

rmSync(work, { recursive: true, force: true });
console.log("wrote icons/favicon.svg, icons/favicon-32.png, icons/apple-touch-icon.png, icons/og.png, favicon.ico");
