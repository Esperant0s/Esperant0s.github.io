import { site, nav, about, projects, posts, photos } from "./content.js";
import { mountEye } from "./eye.js";
import { forgive } from "./rage.js";
import { judgeApology } from "./apology.js";

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

// A nav link whose slash turns into an arrow on hover.
export const navLink = (name) =>
  `<a class="nav-link" href="/${name}"><span class="mark" aria-hidden="true"><span class="slash">/</span><span class="arrow">→</span></span>${capitalize(name)}</a>`;

const external = (label, href) =>
  `<a class="external" href="${href}" target="_blank" rel="noopener">${label}<span class="out" aria-hidden="true">↗</span></a>`;

const back = (href, label) =>
  `<a class="back" href="${href}"><span class="arrow" aria-hidden="true">←</span>${label}</a>`;

const count = (title, n) => `<h1>${title}${n ? `<span class="count">[${n}]</span>` : ""}</h1>`;

// Shown on a list page until it has entries.
const empty = (what) => `<p class="sub empty">No ${what} yet. Check back soon.</p>`;

// Placeholder art: a soft glow in the theme's accent colors, until real images
// are added. `hue` just varies the blend so placeholders don't all match.
const ember = (hue) => {
  const mix = 30 + (hue % 50);
  return `background: radial-gradient(circle at 30% 70%, color-mix(in srgb, var(--accent-2) ${mix}%, transparent), transparent 60%),
   radial-gradient(circle at 75% 25%, color-mix(in srgb, var(--accent) ${80 - mix}%, transparent), transparent 55%), var(--bg-2);`;
};

const thumb = (item) =>
  item.image || item.src
    ? `<img class="fade" src="${item.image || item.src}" alt="" loading="lazy" />`
    : `<div class="placeholder" style="${ember(item.hue)}"></div>`;

const formatDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

const postIcon = { code: "&lt;/&gt;", note: "¶", web: "◎" };

/* ---------- pages ---------- */

function home() {
  return {
    title: site.name,
    home: true,
    html: `
      <main class="home">
        <div class="title">
          <span class="eye-slot home-eye"></span>
          <h1>${site.name}</h1>
        </div>
        <p class="tagline">${site.tagline}</p>
        <nav>${nav.map(navLink).join("")}</nav>
      </main>`,
  };
}

function aboutPage() {
  const swatches = ["bg", "bg-2", "bg-3", "muted", "text", "text-0", "flame-edge", "flame-mid", "flame-hot"];
  return {
    title: "About",
    html: `
      <main class="page">
        <h1>About</h1>
        <p>${about.intro}</p>

        <h2>Links</h2>
        <ul class="plain">${about.links.map((l) => `<li>${external(l.label, l.href)}</li>`).join("")}</ul>

        ${about.tech.length ? `
        <h2>Tech</h2>
        <ul class="plain mono">
          ${about.tech.map((t) => `<li>${t.label} <span class="dim">→</span> ${t.items.join(' <span class="dim">/</span> ')}</li>`).join("")}
        </ul>` : ""}

        <h2>Colophon</h2>
        <ul class="plain mono">
          <li>Stack <span class="dim">→</span> ${about.stack.join(' <span class="dim">/</span> ')}</li>
          <li>Fonts <span class="dim">→</span> ${about.fonts.join(' <span class="dim">/</span> ')}</li>
        </ul>
        <div class="swatches">
          ${swatches.map((s) => `<span style="background: var(--${s})" class="${/bg|muted/.test(s) ? "" : "dark"}">${s}</span>`).join("")}
        </div>
      </main>`,
  };
}

function projectsPage() {
  return {
    title: "Projects",
    html: `
      <main class="page gallery">
        ${count("Projects", projects.length)}
        ${projects.length ? "" : empty("projects")}
        <div class="card-grid">
          ${projects
            .map(
              (p) => `
            <a class="card" href="/projects/${p.slug}">
              <div class="frame">${thumb(p)}</div>
              <h2>${p.title}<span class="arrow" aria-hidden="true">-&gt;</span></h2>
              <div class="card-sub">${p.description}</div>
            </a>`
            )
            .join("")}
        </div>
      </main>`,
  };
}

function projectPage(slug) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return notFound();
  return {
    title: p.title,
    html: `
      <main class="page">
        ${back("/projects", "Projects")}
        <h1>${p.title}</h1>
        <p class="sub">${p.description}</p>
        <div class="hero">${thumb(p)}</div>
        <div class="content">${p.body}</div>
        ${p.links?.length ? `<ul class="plain">${p.links.map((l) => `<li>${external(l.label, l.href)}</li>`).join("")}</ul>` : ""}
      </main>`,
  };
}

function blogPage() {
  return {
    title: "Blog",
    html: `
      <main class="page">
        ${count("Blog", posts.length)}
        ${posts.length ? "" : empty("posts")}
        <ul class="post-list">
          ${posts
            .map(
              (p) => `
            <li>
              <time datetime="${p.date}">${formatDate(p.date)}</time>
              <a href="/blog/${p.slug}">
                <span class="post-title"><span class="icon" aria-hidden="true">${postIcon[p.kind] || ""}</span>${p.title}</span>
                <span class="card-sub">${p.description}</span>
              </a>
            </li>`
            )
            .join("")}
        </ul>
      </main>`,
  };
}

function postPage(slug) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) return notFound();
  return {
    title: p.title,
    html: `
      <main class="page">
        ${back("/blog", "Blog")}
        <h1><span class="icon" aria-hidden="true">${postIcon[p.kind] || ""}</span>${p.title}</h1>
        <p class="mono date">${formatDate(p.date)}</p>
        <p class="sub"><em>${p.description}</em></p>
        <article class="content">${p.body}</article>
      </main>`,
  };
}

function photosPage() {
  return {
    title: "Photos",
    html: `
      <main class="page gallery">
        ${count("Photos", photos.items.length)}
        ${photos.caption ? `<p class="sub">${photos.caption}</p>` : ""}
        ${photos.items.length ? "" : empty("photos")}
        <div class="masonry">
          ${photos.items
            .map((ph) =>
              ph.src
                ? `<img class="fade" src="${ph.src}" alt="${ph.alt || ""}" loading="lazy" />`
                : `<div class="placeholder" style="aspect-ratio: ${ph.ratio}; ${ember(ph.hue)}"></div>`
            )
            .join("")}
        </div>
      </main>`,
  };
}

function contactPage() {
  return {
    title: "Contact",
    html: `
      <main class="page">
        <h1>Contact</h1>
        <p class="sub">Ways to get in touch.</p>
        <ul class="plain mono">
          ${site.email ? `<li>Email <span class="dim">→</span> ${external(site.email, `mailto:${site.email}`)}
            <button class="copy" data-copy="${site.email}" aria-label="Copy email">Copy</button></li>` : ""}
          ${about.links.map((l) => `<li>${external(l.label, l.href)}</li>`).join("")}
        </ul>

        ${site.email ? `
        <h3>Contact form</h3>
        <form class="contact-form">
          <input name="name" placeholder="Name" autocomplete="name" />
          <input name="email" type="email" placeholder="Email (if you want a reply)" autocomplete="email" />
          <textarea name="message" placeholder="Your message..." rows="5" required></textarea>
          <button type="submit">Submit →</button>
        </form>` : ""}
      </main>`,
    mount(root) {
      root.querySelectorAll(".copy").forEach((btn) =>
        btn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(btn.dataset.copy);
            btn.textContent = "Copied";
          } catch {
            btn.textContent = "Couldn't copy";
          }
          setTimeout(() => (btn.textContent = "Copy"), 1500);
        })
      );

      // No backend yet: hand the message to the visitor's email app.
      root.querySelector(".contact-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const subject = `Message from ${data.get("name") || "your site"}`;
        const body = `${data.get("message")}\n\n${data.get("email") ? `Reply to: ${data.get("email")}` : ""}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    },
  };
}

function notFound() {
  return {
    title: "Not found",
    html: `
      <main class="page">
        <h1>404</h1>
        <p class="sub">The eye looked everywhere, but this page doesn't exist.</p>
        ${back("/", "Home")}
      </main>`,
  };
}

// Shown instead of every page after the eye fires its laser, until the
// lockout runs out or the visitor apologizes. `onFree` lets them back in.
export function lockoutPage(until, onFree) {
  return {
    title: "Angered",
    bare: true,
    html: `
      <main class="home lockout">
        <span class="eye-slot lockout-eye"></span>
        <h1>You have angered the eye.</h1>
        <p class="tagline">It won't let you back in for <span class="countdown">5:00</span>. Or you could try apologizing.</p>
        <form class="apology">
          <input name="words" placeholder="Say something to the eye..." autocomplete="off" aria-label="Your apology" />
          <button type="submit">Apologize</button>
        </form>
        <p class="eye-reply" aria-live="polite"></p>
      </main>`,
    mount(root) {
      const eye = mountEye(root.querySelector(".lockout-eye"), { mood: "angry" });
      const countdown = root.querySelector(".countdown");
      const reply = root.querySelector(".eye-reply");
      const form = root.querySelector(".apology");
      let done = false;

      async function release(message) {
        if (done) return;
        done = true;
        forgive();
        form.hidden = true;
        reply.textContent = message;
        await eye.soothe();
        setTimeout(onFree, 1600);
      }

      const tick = () => {
        if (!root.isConnected) return clearInterval(timer);
        const left = Math.max(0, until - Date.now());
        const s = Math.ceil(left / 1000);
        countdown.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        if (!left) {
          clearInterval(timer);
          release("The eye has calmed down. You may enter.");
        }
      };
      const timer = setInterval(tick, 1000);
      tick();

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const verdict = judgeApology(new FormData(form).get("words"));
        if (verdict.ok) {
          release("The eye accepts your apology.");
        } else {
          reply.textContent = verdict.reply;
          form.reset();
        }
      });
    },
  };
}

export function resolve(path) {
  const [section, slug] = path.split("/").filter(Boolean);
  if (!section) return home();
  if (slug) {
    if (section === "projects") return projectPage(slug);
    if (section === "blog") return postPage(slug);
    return notFound();
  }
  const pages = {
    about: aboutPage,
    projects: projectsPage,
    blog: blogPage,
    photos: photosPage,
    contact: contactPage,
  };
  return (pages[section] || notFound)();
}
