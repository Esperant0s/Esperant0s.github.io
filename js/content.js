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
//   image: "/images/my-project.png",          // card picture; 16:9 works best; omit for a plain glow
//   images: [                                 // its page's slideshow; leave out to just show `image`
//     { src: "/images/my-project.png", alt: "The main screen" },
//     { src: "/images/my-project-2.png", alt: "The settings screen" },
//   ],
//   body: "<p>Longer write-up for its own page.</p>",
//   links: [                                  // shown next to the title
//     { label: "Site", href: "https://my-project.example" },
//     { label: "GitHub", href: "https://github.com/..." },
//   ],
// },
export const projects = [
  {
    slug: "nova-player",
    title: "Nova Player",
    description: "A Netflix-style IPTV player for Samsung smart TVs.",
    image: "/images/nova-player.jpg",
    images: [
      { src: "/images/nova-player.jpg", alt: "Nova's home screen: a big billboard for Tears of Steel above a row of recently added movies" },
      { src: "/images/nova-player-details.jpg", alt: "A series page with play and My List buttons, season tabs and episode thumbnails" },
      { src: "/images/nova-player-live.jpg", alt: "The Live TV guide: channel groups, a channel list, and what's on now and next" },
      { src: "/images/nova-player-search.jpg", alt: "Search with an on-screen keyboard beside rows of results" },
    ],
    body: `
      <p>Nova Player is an IPTV app I built for my Samsung TV. I wanted something that feels like a
      streaming service instead of a spreadsheet of channels, so it's designed to be used from the couch
      with nothing but the TV remote.</p>

      <h2>What it does</h2>
      <p>You sign in with an Xtream Codes account or an M3U playlist from your IPTV provider, and Nova turns
      it into a library you'd actually want to browse: a big billboard for whatever you're looking at, rows
      for Continue Watching, My List and Recently Added, and a row for every category. There's also a demo
      library, so you can try it without an account.</p>
      <ul>
        <li><strong>Movies and series</strong> with resume, a next-episode countdown, and menus for audio,
        subtitles, quality, speed and picture fit. It remembers your language choices.</li>
        <li><strong>Live TV</strong> with a guide showing what's on now and next, instant channel zapping,
        typing a channel number, jumping back to the previous channel, and favourites.</li>
        <li><strong>Region filters</strong> that sort a huge catalogue into Arabic, Western, Turkish, Korean,
        Japanese, Anime, Kids, Sports and more, using category names, cast names and movie info.</li>
        <li><strong>Instant search</strong> with an on-screen keyboard.</li>
      </ul>

      <h2>How it's built</h2>
      <p>It's plain HTML, CSS and JavaScript packaged as a Tizen web app, with no framework. The library is
      cached on the TV, so the app opens instantly and refreshes in the background, and only the cards on
      screen are drawn, so a 50,000-title catalogue scrolls as smoothly as a small one. On the TV it plays
      through Samsung's built-in video player, which handles live streams, HLS and MKV with hardware
      decoding. On a computer it runs in the browser, with a small local server that gets around CORS for
      testing.</p>
    `,
    links: [{ label: "GitHub", href: "https://github.com/Esperant0s/nova-player" }],
  },
];

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
