import type { NeoDeckConfig } from "./types";

/**
 * The default deck shown when no neodeck.config.json is found.
 * Drop a neodeck.config.json next to index.html to override any of this.
 */
export const defaultConfig: NeoDeckConfig = {
  title: "NeoDeck",
  theme: "matrix",
  matrixRain: true,
  search: {
    default: "ddg",
    engines: [
      { key: "ddg", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=%s" },
      { key: "g", name: "Google", url: "https://www.google.com/search?q=%s" },
      { key: "gh", name: "GitHub", url: "https://github.com/search?q=%s" },
      { key: "npm", name: "npm", url: "https://www.npmjs.com/search?q=%s" },
      { key: "yt", name: "YouTube", url: "https://www.youtube.com/results?search_query=%s" },
      { key: "w", name: "Wikipedia", url: "https://en.wikipedia.org/wiki/Special:Search?search=%s" },
      { key: "mdn", name: "MDN", url: "https://developer.mozilla.org/en-US/search?q=%s" },
    ],
  },
  bookmarks: [
    {
      group: "dev",
      links: [
        { label: "GitHub", url: "https://github.com" },
        { label: "MDN", url: "https://developer.mozilla.org" },
        { label: "Stack Overflow", url: "https://stackoverflow.com" },
        { label: "caniuse", url: "https://caniuse.com" },
        { label: "regex101", url: "https://regex101.com" },
      ],
    },
    {
      group: "projects",
      links: [
        { label: "gitvibe", url: "https://github.com/DaddyYarik/gitvibe" },
        { label: "devlog", url: "https://github.com/DaddyYarik/devlog" },
        { label: "HackerPanel", url: "https://github.com/DaddyYarik/HackerPanel" },
        { label: "PhantomBreach", url: "https://github.com/DaddyYarik/PhantomBreach" },
        { label: "my site", url: "https://daddyyarik.github.io" },
      ],
    },
    {
      group: "media",
      links: [
        { label: "YouTube", url: "https://youtube.com" },
        { label: "r/programming", url: "https://reddit.com/r/programming" },
        { label: "Hacker News", url: "https://news.ycombinator.com" },
      ],
    },
    {
      group: "tools",
      links: [
        { label: "Excalidraw", url: "https://excalidraw.com" },
        { label: "JSON Crack", url: "https://jsoncrack.com" },
        { label: "DevDocs", url: "https://devdocs.io" },
      ],
    },
  ],
  services: [
    { name: "GitHub", url: "https://github.com" },
    { name: "npm", url: "https://registry.npmjs.org" },
    { name: "Cloudflare DNS", url: "https://1.1.1.1" },
    { name: "Google", url: "https://www.google.com" },
  ],
  weather: {
    label: "Moscow",
    latitude: 55.75,
    longitude: 37.62,
    units: "metric",
  },
  github: {
    user: "DaddyYarik",
  },
  crypto: {
    coins: ["bitcoin", "ethereum", "solana"],
    vs: "usd",
  },
  rss: {
    feeds: [{ title: "Hacker News", url: "https://hnrss.org/frontpage" }],
    proxy: "https://api.allorigins.win/raw?url=",
    limit: 6,
  },
  todo: true,
  notes: true,
  pomodoro: true,
};
