// Theme picker. The default theme (Halloween Glow) is the :root block in
// style.css; the others live there under [data-theme="id"]. This list just
// names them and gives the swatches shown in the menu.

export const themes = [
  { id: "halloween", name: "Halloween Glow", tag: "halloween - fall · default", colors: ["#0A0A0A", "#3D1A3D", "#FF6700", "#FFB627", "#9B1D20"] },
  { id: "synthwave", name: "Synthwave Night", tag: "synthwave - neon", colors: ["#240046", "#3C096C", "#7209B7", "#F72585", "#FFD60A"] },
  { id: "luxury-gold", name: "Luxury Gold", tag: "luxury - gold", colors: ["#0B0B10", "#1A1A2E", "#16213E", "#C9A227", "#F5E6C4"] },
  { id: "midnight-jewel", name: "Midnight Jewel", tag: "deep - moody", colors: ["#03071E", "#370617", "#6A040F", "#9D0208", "#DC2F02"] },
  { id: "noir-neon", name: "Noir Neon", tag: "neon - synthwave", colors: ["#0D0C1D", "#1B1B3A", "#693668", "#A74482", "#F84AA7"] },
  { id: "devtool-dark", name: "Devtool Dark", tag: "tech - developer", colors: ["#0A0E14", "#1F2430", "#5FB3B3", "#BBE67E", "#FFD580"] },
  { id: "github-dim", name: "GitHub Dim", tag: "tech - developer", colors: ["#22272E", "#373E47", "#768390", "#CDD9E5", "#539BF5"] },
  { id: "midnight-violet", name: "Midnight Violet", tag: "purple - tech", colors: ["#0B0B1A", "#1A1635", "#2D2456", "#7C3AED", "#C4B5FD"] },
  { id: "midnight-teal", name: "Midnight Teal", tag: "green - cool", colors: ["#021F25", "#053E44", "#0D6E6F", "#22B8A3", "#A7F0D4"] },
  { id: "midnight-rose", name: "Midnight Rose", tag: "pink - moody", colors: ["#190A17", "#3A132D", "#7A2348", "#C44569", "#FF9AA2"] },
  { id: "midnight-amber", name: "Midnight Amber", tag: "amber - warm", colors: ["#0C0A09", "#1C1917", "#451A03", "#EA580C", "#FED7AA"] },
  { id: "cyberpunk", name: "Cyberpunk Glow", tag: "neon - cyberpunk", colors: ["#0D0221", "#190B34", "#7A04EB", "#FB04EB", "#04FFE6"] },
  { id: "noir-cinema", name: "Noir Cinema", tag: "film - monochrome", colors: ["#000000", "#1A1A1A", "#4D4D4D", "#999999", "#F0E6D2"] },
];

const STORAGE_KEY = "theme";

const DEFAULT = "halloween";

// A saved theme that no longer exists (like the old "ember") falls back to the default.
const current = () => {
  const id = document.documentElement.dataset.theme;
  return themes.some((t) => t.id === id) ? id : DEFAULT;
};

function setTheme(id) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Private browsing etc.: the theme still applies, it just won't be remembered.
  }
  // Lets the background canvas pick up the new colors.
  document.dispatchEvent(new CustomEvent("themechange"));
}

const swatches = (colors) =>
  `<span class="swatch-strip" aria-hidden="true">${colors.map((c) => `<span style="background:${c}"></span>`).join("")}</span>`;

// Builds the dropdown: a button showing the current theme, and a list that
// opens above it. Works with mouse, touch and keyboard (arrows, Enter, Esc).
export function mountThemePicker(root) {
  root.innerHTML = `
    <button class="theme-button" type="button" aria-haspopup="listbox" aria-expanded="false"></button>
    <ul class="theme-list" role="listbox" aria-label="Theme" tabindex="-1" hidden>
      ${themes
        .map(
          (t) => `
        <li role="option" id="theme-${t.id}" data-id="${t.id}" aria-selected="false">
          ${swatches(t.colors)}
          <span class="theme-name">${t.name}</span>
          <span class="theme-tag">${t.tag}</span>
        </li>`
        )
        .join("")}
    </ul>`;

  const button = root.querySelector(".theme-button");
  const list = root.querySelector(".theme-list");
  const options = [...list.querySelectorAll("[role=option]")];
  let active = 0;

  function syncButton() {
    const theme = themes.find((t) => t.id === current()) || themes[0];
    button.innerHTML = `${swatches(theme.colors)}<span class="theme-label">${theme.name}</span><span class="caret" aria-hidden="true">▾</span>`;
    button.setAttribute("aria-label", `Theme: ${theme.name}. Change theme`);
    options.forEach((o) => o.setAttribute("aria-selected", String(o.dataset.id === theme.id)));
  }

  function highlight(index) {
    active = (index + options.length) % options.length;
    options.forEach((o, i) => o.classList.toggle("active", i === active));
    list.setAttribute("aria-activedescendant", options[active].id);
    options[active].scrollIntoView({ block: "nearest" });
  }

  function open() {
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    highlight(Math.max(0, themes.findIndex((t) => t.id === current())));
    list.focus();
  }

  function close({ refocus = true } = {}) {
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (refocus) button.focus();
  }

  function choose(index) {
    setTheme(options[index].dataset.id);
    syncButton();
    close();
  }

  button.addEventListener("click", () => (list.hidden ? open() : close()));
  options.forEach((o, i) => {
    o.addEventListener("click", () => choose(i));
    o.addEventListener("pointermove", () => highlight(i));
  });

  list.addEventListener("keydown", (e) => {
    if (e.key === "Tab") return close({ refocus: false }); // let focus move on
    if (e.key === "ArrowDown") highlight(active + 1);
    else if (e.key === "ArrowUp") highlight(active - 1);
    else if (e.key === "Home") highlight(0);
    else if (e.key === "End") highlight(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") close();
    else return;
    e.preventDefault();
  });

  // Clicking anywhere else closes the menu.
  document.addEventListener("pointerdown", (e) => {
    if (!list.hidden && !root.contains(e.target)) close({ refocus: false });
  });

  syncButton();
}
