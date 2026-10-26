import { nav } from "./content.js";
import { resolve, navLink, lockoutPage } from "./pages.js";
import { mountEye } from "./eye.js";
import { burstAt } from "./field.js";
import { reduceMotion } from "./pointer.js";
import { mountThemePicker } from "./themes.js";
import { blast, lockedUntil } from "./rage.js";

const view = document.getElementById("view");
const header = document.getElementById("site-header");
document.getElementById("site-nav").innerHTML = nav.map(navLink).join("");
mountEye(header.querySelector(".eye-slot"));
mountThemePicker(document.getElementById("theme-picker"));

let currentPath = normalise(location.pathname);
let firstRender = true;

function normalise(path) {
  return path.replace(/\/+$/, "") || "/";
}

/* ---------- spatial transitions ----------
   Pages sit on a grid: menu order runs left to right, and depth runs top to
   bottom (home → /blog → /blog/post). Moving right slides the new page in from
   the right; going deeper slides it up from below. Home borrows the column of
   whichever page you came from, so going home is a straight move up. */

const SLIDE = 20; // vh per step
const OUT_MS = 150;
const IN_MS = 150;
const IN_DELAY = 50;
const cubicOut = "cubic-bezier(0.33, 1, 0.68, 1)";

function offset(to, from) {
  const toParts = to.split("/").filter(Boolean);
  const fromParts = from.split("/").filter(Boolean);
  let toCol = nav.indexOf(toParts[0]);
  let fromCol = nav.indexOf(fromParts[0]);
  if (!toParts.length) toCol = fromCol;
  if (!fromParts.length) fromCol = toCol;
  const dx = toCol < 0 || fromCol < 0 ? 0 : toCol - fromCol;
  const dy = toParts.length - fromParts.length;
  return { dx: dx * SLIDE, dy: dy * SLIDE };
}

function render(path, { animate = true } = {}) {
  // While the eye's lockout is running, every address shows the lockout page.
  const locked = lockedUntil();
  const page = locked ? lockoutPage(locked, () => render(currentPath, { animate: false })) : resolve(path);
  const bare = page.home || page.bare; // no header on these
  document.title = page.home ? "Esper" : `${page.title} · Esper`;

  const el = document.createElement("div");
  el.className = "screen";
  el.innerHTML = page.html;

  // On first load, snap the header into place instead of animating it.
  if (firstRender) header.style.transition = "none";
  header.classList.toggle("hidden", !!bare);
  if (firstRender) requestAnimationFrame(() => requestAnimationFrame(() => (header.style.transition = "")));
  header.inert = !!bare;
  document.querySelectorAll("#site-nav a").forEach((a) => {
    a.classList.toggle("current", path.startsWith(a.getAttribute("href")));
  });

  // Drop any page still leaving from a previous quick click.
  view.querySelectorAll(".screen.leaving").forEach((s) => s.remove());
  const old = view.querySelector(".screen");
  view.append(el);

  if (old) {
    const { dx, dy } = animate && !reduceMotion ? offset(path, currentPath) : { dx: 0, dy: 0 };
    old.classList.add("leaving");
    old.inert = true;
    old
      .animate([{ opacity: 1 }, { transform: `translate(${-dx}vh, ${-dy}vh)`, opacity: 0 }], {
        duration: reduceMotion ? 0 : OUT_MS,
        easing: cubicOut,
        fill: "forwards",
      })
      .finished.then(() => old.remove(), () => {});
    el.animate([{ transform: `translate(${dx}vh, ${dy}vh)`, opacity: 0 }, { transform: "none", opacity: 1 }], {
      duration: reduceMotion ? 0 : IN_MS,
      delay: reduceMotion ? 0 : IN_DELAY,
      easing: cubicOut,
      fill: "backwards",
    });
    window.scrollTo(0, 0);
  }

  const slot = el.querySelector(".home-eye");
  if (slot) {
    const wave = ({ x, y }) => burstAt(x, y);
    // Too many clicks and the eye fires its laser, locking the visitor out.
    const fire = (at) => blast(at, () => render(currentPath, { animate: false }));
    mountEye(slot, { intro: firstRender, onOpen: wave, onPoke: wave, onRage: fire });
  }
  page.mount?.(el);

  // Images fade in once loaded instead of popping in line by line.
  el.querySelectorAll("img.fade").forEach((img) => {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
  });

  currentPath = path;
  firstRender = false;
}

function go(path) {
  path = normalise(path);
  if (path === currentPath) return;
  history.pushState({}, "", path);
  render(path);
}

// Handle same-site links ourselves so pages can slide instead of reloading.
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a || a.target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.protocol === "mailto:") return;
  e.preventDefault();
  if (a.classList.contains("nav-link")) burstAt(e.clientX, e.clientY);
  go(url.pathname);
});

window.addEventListener("popstate", () => render(normalise(location.pathname)));

render(currentPath, { animate: false });
