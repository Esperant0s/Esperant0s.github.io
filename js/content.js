// Everything you'd want to edit lives here. Pages with nothing in them show a
// short "nothing here yet" note until you add entries.

export const site = {
  name: "Esper",
  tagline: "Hi, I'm Esper. I love making things that are unique and always watching.",
  // Add an address here to show it on the Contact page along with a message form.
  email: "",
};

// Page addresses, in menu order. Order matters: it decides which way pages
// slide when you move between them. Menu labels are these, capitalized.
export const nav = ["about", "projects", "blog", "photos", "contact"];

export const about = {
  intro:
    "Hello there, my name is Esper. I'm a software developer working remotely from around the globe. " +
    "I also go by the name Esper online. I'm interested in web and game development, art, AI, and a " +
    "whole list of other topics. I love making things that are unique and cool looking.",
  // Also listed on the Contact page.
  links: [
    { label: "GitHub", href: "https://github.com/Esperant0s" },
    { label: "Instagram", href: "https://www.instagram.com/esperant0s/" },
    { label: "Discord", href: "https://discord.com/users/325884996311318538" },
    { label: "X/Twitter", href: "https://x.com/Esperant0s" },
  ],
  // The "Tech" section; it's hidden if this list is empty.
  tech: [
    { label: "Languages", items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"] },
    { label: "Frameworks", items: ["Svelte", "React"] },
    { label: "Tools", items: ["VS Code", "Figma", "Claude Code"] },
  ],
  stack: ["HTML", "CSS", "Vanilla JS"],
  fonts: ["Monocraft"],
};

// Each project gets a card and its own page. Example entry:
// {
//   slug: "my-project",                       // its address: /projects/my-project
//   title: "My Project",
//   description: "What it does, in one line.",
//   image: "/images/my-project.png",          // 16:9 works best; omit for a plain glow
//   body: "<p>Longer write-up for its own page.</p>",
//   links: [{ label: "GitHub", href: "https://github.com/..." }],
// },
export const projects = [];

// Each post gets a row on the Blog page and its own page. Example entry:
// {
//   slug: "my-post",                          // its address: /blog/my-post
//   title: "My Post",
//   date: "2026-10-26",
//   kind: "note",                             // icon: "code", "note" or "web"
//   description: "One-line summary.",
//   body: `<p>The post, in plain HTML.</p>`,
// },
export const posts = [];

// Put photos in a /photos folder and list them here. Example entry:
// { src: "/photos/sunset.jpg", alt: "Sunset over the harbor" },
export const photos = {
  caption: "",
  items: [],
};
