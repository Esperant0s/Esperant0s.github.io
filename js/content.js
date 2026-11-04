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
//   oldSlugs: ["old-name"],                   // optional: earlier addresses that still open it
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
  {
    slug: "uriel",
    oldSlugs: ["mural"], // its address before the rename: /projects/mural still opens it
    title: "Uriel",
    description: "A music player for computers and phones that streams, downloads and keeps a local library.",
    image: "/images/uriel.jpg",
    images: [
      { src: "/images/uriel.jpg", alt: "Uriel's home screen: a My Wave mix, recently played songs and a row of trending songs" },
      { src: "/images/uriel-karaoke.jpg", alt: "Fullscreen karaoke: album art and controls on the left, synced lyrics on the right" },
      { src: "/images/uriel-album.jpg", alt: "An album page with the cover, artist and year beside its track list" },
      { src: "/images/uriel-audio.jpg", alt: "The Audio panel with speed and pitch presets and sliders" },
    ],
    body: `
      <p>Uriel is a music player for Windows, macOS, Linux, Android and iPhone. It streams from YouTube,
      YouTube Music and SoundCloud, downloads songs to play offline, and keeps your own music in one library.
      You don't need an account or a subscription.</p>
      <p>It's my fork of <a href="https://github.com/cloverscripts/riff-muriel">Muriel</a> by cloverscripts,
      which is based on <a href="https://github.com/rootscripts/riff">Riff</a> by rootscripts. I started out
      fixing bugs and adding features for myself. Once it had changed enough, I gave it its own name so it
      installs next to Muriel instead of replacing it.</p>

      <h2>What it does</h2>
      <ul>
        <li><strong>Streaming and downloads</strong> from YouTube, YouTube Music and SoundCloud, with song
        radio, a "My Wave" mix and crossfade between songs.</li>
        <li><strong>Lyrics</strong>: synced lyrics from the web, LRC files, word-by-word timing, translations
        and a fullscreen karaoke view.</li>
        <li><strong>Audio tools</strong>: an equalizer with presets, live speed control, reverb, and a small
        editor for trimming and exporting clips.</li>
        <li><strong>Your look</strong>: an image, GIF or video background with optional glass blur, and a
        compact layout with the queue and lyrics in a slide-over drawer.</li>
      </ul>

      <h2>What I added</h2>
      <ul>
        <li><strong>In-app updates.</strong> Uriel downloads new versions itself and checks each file against
        GitHub's checksum. It restarts into the new version on Windows, macOS and Linux and opens the installer
        on Android.</li>
        <li><strong>Music already on your device.</strong> On a computer it finds songs in your Music and
        Downloads folders and plays them where they are, without copying them. On Android it reads the
        phone's music library, and on iPhone it reads Uriel's folder in the Files app.</li>
        <li><strong>Offline markers.</strong> A small arrow appears next to every song that plays without
        internet.</li>
        <li><strong>A cleaner phone app.</strong> Each version only shows the settings that work on it, so
        phones no longer show desktop-only options.</li>
        <li><strong>Bug fixes.</strong> I reviewed the whole codebase twice and fixed more than 40 bugs in
        playback, downloads, sync, track matching and the local server.</li>
        <li><strong>Moving over from Muriel.</strong> On first start, Uriel copies your Muriel playlists,
        settings and songs and leaves Muriel's own files as they are.</li>
      </ul>

      <h2>How it's built</h2>
      <p>The desktop app runs on Electron and the phone apps use Capacitor. All of them share the same plain
      JavaScript interface. yt-dlp and ffmpeg handle streams and downloads and install themselves the first
      time you open the app. Builds for every platform are made by GitHub Actions and published on the
      Releases page.</p>
    `,
    links: [
      { label: "GitHub", href: "https://github.com/Esperant0s/Uriel" },
      { label: "Download", href: "https://github.com/Esperant0s/Uriel/releases/latest" },
    ],
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
