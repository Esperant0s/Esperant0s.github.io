// Everything you'd want to edit lives here. Swap the placeholder text, links
// and images for your own.

export const site = {
  name: "Esper",
  tagline: "Hi, I'm Esper. I love making things that are unique and always watching.",
  email: "hello@example.com",
  discord: { label: "Esper", href: "https://discord.com/users/325884996311318538" },
};

// Page addresses, in menu order. Order matters: it decides which way pages
// slide when you move between them. Menu labels are these, capitalized.
export const nav = ["about", "projects", "blog", "photos", "contact"];

export const about = {
  intro:
    "Hello there, my name is Esper. I'm a software developer working remotely from around the globe. " +
    "I also go by the name Esper online. I'm interested in web and game development, art, AI, and a " +
    "whole list of other topics. I love making things that are unique and cool looking.",
  links: [
    { label: "GitHub", href: "https://github.com/Esperant0s" },
    { label: "Instagram", href: "https://www.instagram.com/esperant0s/" },
    { label: "Discord", href: "https://discord.com/users/325884996311318538" },
    { label: "X/Twitter", href: "https://x.com/Esperant0s" },
  ],
  tech: [
    { label: "Languages", items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"] },
    { label: "Frameworks", items: ["Svelte", "React"] },
    { label: "Tools", items: ["VS Code", "Figma", "Claude Code"] },
  ],
  stack: ["HTML", "CSS", "Vanilla JS"],
  fonts: ["Monocraft"],
};

// `hue` tints the placeholder thumbnail; replace it with `image: "/images/x.png"`.
export const projects = [
  {
    slug: "pyre",
    title: "Pyre",
    description: "A placeholder project. Say what it does in one line.",
    hue: 38,
    body: "<p>Describe the project here: what problem it solves, how you built it, and what you learned.</p>",
    links: [{ label: "GitHub", href: "https://github.com/Esperant0s" }],
  },
  {
    slug: "ember-notes",
    title: "Ember Notes",
    description: "Another placeholder project.",
    hue: 18,
    body: "<p>Longer write-up for this project goes here.</p>",
    links: [],
  },
  {
    slug: "frenzy",
    title: "Frenzy",
    description: "A third placeholder project.",
    hue: 50,
    body: "<p>Longer write-up for this project goes here.</p>",
    links: [],
  },
  {
    slug: "kindling",
    title: "Kindling",
    description: "A fourth placeholder project.",
    hue: 8,
    body: "<p>Longer write-up for this project goes here.</p>",
    links: [],
  },
];

// `kind` picks the icon: "code", "note" or "web".
export const posts = [
  {
    slug: "hello-world",
    title: "Hello, World",
    date: "2026-10-26",
    kind: "note",
    description: "The first post on this site.",
    body: `
      <p>This is a placeholder post. Write in plain HTML here, or move posts into separate files later.</p>
      <h2>A heading</h2>
      <p>Use headings, <a href="https://example.com">links</a>, <code>code</code> and lists:</p>
      <ul><li>One</li><li>Two</li></ul>
    `,
  },
  {
    slug: "building-this-site",
    title: "Building This Site",
    date: "2026-10-20",
    kind: "code",
    description: "How the burning eye and sliding pages work.",
    body: `
      <p>Pages slide sideways when you move along the menu, and up or down when you go deeper or back out.</p>
      <p>The eye follows your cursor, and the background is a field of text characters that shifts like heat.</p>
    `,
  },
];

// `ratio` is width / height; replace `hue` with `src: "/photos/x.jpg"` for real photos.
export const photos = {
  caption: "A few photos. Add yours to the photos folder and list them in content.js.",
  items: [
    { ratio: 3 / 4, hue: 30 },
    { ratio: 4 / 3, hue: 12 },
    { ratio: 1, hue: 45 },
    { ratio: 3 / 4, hue: 20 },
    { ratio: 4 / 3, hue: 5 },
    { ratio: 3 / 4, hue: 40 },
  ],
};
