// Run by the deploy workflow: node scripts/build-pages.mjs _site
//
// GitHub Pages can't send every address to index.html, and the 404 page alone
// would send every page with a 404 status, which hides it from search engines
// and some link previews. So each real page gets its own copy of index.html
// (about/index.html, projects/nova-player/index.html, ...), listed from
// js/content.js, and loads with a 200. Each copy carries that page's own
// title, description and preview picture, so a shared link to a project shows
// the project instead of the home page. Also writes sitemap.xml and robots.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { site, nav, projects, posts } from "../js/content.js";

const out = process.argv[2] || "_site";
const ORIGIN = "https://esperant0s.github.io";
const template = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);
const escape = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const about = {
  about: `About ${site.name}: who I am, where to find me and what this site is made with.`,
  projects: `Things ${site.name} has built: ${projects.map((p) => p.title).join(", ")}.`,
  blog: `Posts and notes from ${site.name}.`,
  photos: `Photos taken by ${site.name}.`,
  contact: `Ways to get in touch with ${site.name}.`,
};

// route: its address without slashes at the ends. `canonical` is set on a
// project's old addresses, so search engines keep to the current one.
const pages = [
  ...nav.map((name) => ({ route: name, title: capitalize(name), description: about[name] })),
  ...projects.flatMap((p) =>
    [p.slug, ...(p.oldSlugs || [])].map((slug) => ({
      route: `projects/${slug}`,
      canonical: `projects/${p.slug}`,
      title: p.title,
      description: p.description,
      image: p.image && { src: p.image, alt: p.images?.[0]?.alt || p.description, width: 1600, height: 900 },
    }))
  ),
  ...posts.map((p) => ({ route: `blog/${p.slug}`, title: p.title, description: p.description })),
];

// Swaps one tag's content="..." (or the <title>) for this page's value.
const meta = (html, key, value) => {
  const tag = new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*(")`);
  if (!tag.test(html)) throw new Error(`index.html has no ${key} tag`);
  return html.replace(tag, (_, before, after) => before + escape(String(value)) + after);
};

// GitHub Pages serves each page from its folder and redirects /about to
// /about/, so the addresses we hand out end in a slash to skip the redirect.
for (const page of pages) {
  const url = `${ORIGIN}/${page.canonical || page.route}/`;
  const title = `${page.title} · ${site.name}`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>\n    <link rel="canonical" href="${url}" />`);
  html = meta(html, "description", page.description);
  for (const key of ["og:title", "twitter:title"]) html = meta(html, key, title);
  for (const key of ["og:description", "twitter:description"]) html = meta(html, key, page.description);
  html = meta(html, "og:url", url);
  if (page.image) {
    for (const key of ["og:image", "twitter:image"]) html = meta(html, key, ORIGIN + page.image.src);
    html = meta(html, "og:image:width", page.image.width);
    html = meta(html, "og:image:height", page.image.height);
    html = meta(html, "og:image:alt", page.image.alt);
  }
  mkdirSync(`${out}/${page.route}`, { recursive: true });
  writeFileSync(`${out}/${page.route}/index.html`, html);
  console.log(`/${page.route}`);
}

const listed = ["", ...pages.filter((p) => !p.canonical || p.canonical === p.route).map((p) => p.route)];
writeFileSync(
  `${out}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map((route) => `  <url><loc>${ORIGIN}/${route ? `${route}/` : ""}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
writeFileSync(`${out}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
