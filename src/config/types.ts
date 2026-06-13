export type ThemeName = "matrix" | "amber" | "ice" | "magenta";

export const THEMES: ThemeName[] = ["matrix", "amber", "ice", "magenta"];

export interface SearchEngine {
  /** Short prefix to switch engine inline, e.g. "gh svelte". */
  key: string;
  name: string;
  /** URL with a %s placeholder for the query. */
  url: string;
}

export interface BookmarkLink {
  label: string;
  url: string;
}

export interface BookmarkGroup {
  group: string;
  links: BookmarkLink[];
}

export interface ServiceItem {
  name: string;
  url: string;
}

export interface WeatherConfig {
  label: string;
  latitude: number;
  longitude: number;
  /** "metric" (°C, km/h) or "imperial" (°F, mph). Default metric. */
  units?: "metric" | "imperial";
}

export interface GithubConfig {
  user: string;
}

export interface CryptoConfig {
  /** CoinGecko coin ids, e.g. ["bitcoin", "ethereum"]. */
  coins: string[];
  /** vs-currency, e.g. "usd". Default usd. */
  vs?: string;
}

export interface RssConfig {
  feeds: { title?: string; url: string }[];
  /** CORS proxy prefix; the encoded feed URL is appended. */
  proxy?: string;
  limit?: number;
}

export interface NeoDeckConfig {
  title: string;
  theme: ThemeName;
  matrixRain: boolean;
  search: {
    /** Default engine key used when no prefix is typed. */
    default: string;
    engines: SearchEngine[];
  };
  bookmarks: BookmarkGroup[];
  services: ServiceItem[];
  weather?: WeatherConfig;
  github?: GithubConfig;
  crypto?: CryptoConfig;
  rss?: RssConfig;
  /** Local-first gadgets (state stored in the browser). */
  todo?: boolean;
  notes?: boolean;
  pomodoro?: boolean;
}
