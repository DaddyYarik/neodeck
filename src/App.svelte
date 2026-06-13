<script lang="ts">
  import type { NeoDeckConfig, ThemeName } from "./config/types";
  import { THEMES } from "./config/types";
  import { defaultConfig } from "./config/defaultConfig";
  import MatrixBg from "./lib/MatrixBg.svelte";
  import Clock from "./lib/Clock.svelte";
  import Search from "./lib/Search.svelte";
  import Bookmarks from "./lib/Bookmarks.svelte";
  import ServiceStatus from "./lib/ServiceStatus.svelte";
  import Weather from "./lib/Weather.svelte";
  import Crypto from "./lib/Crypto.svelte";
  import GithubActivity from "./lib/GithubActivity.svelte";
  import RssFeed from "./lib/RssFeed.svelte";
  import Todo from "./lib/Todo.svelte";
  import Notes from "./lib/Notes.svelte";
  import Pomodoro from "./lib/Pomodoro.svelte";
  import CommandPalette from "./lib/CommandPalette.svelte";

  let config = $state<NeoDeckConfig>(defaultConfig);

  // Load an optional user config placed next to index.html.
  $effect(() => {
    fetch("./neodeck.config.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json) config = { ...defaultConfig, ...json };
      })
      .catch(() => {
        /* no user config — keep defaults */
      });
  });

  // Theme: user override (localStorage) wins over config.
  let theme = $state<ThemeName>(
    (localStorage.getItem("neodeck-theme") as ThemeName) || defaultConfig.theme,
  );

  // keep theme in sync once config arrives, unless user already chose one
  $effect(() => {
    if (!localStorage.getItem("neodeck-theme")) theme = config.theme;
  });

  $effect(() => {
    document.documentElement.dataset.theme = theme;
  });

  function cycleTheme() {
    setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]);
  }

  function setTheme(t: ThemeName) {
    theme = t;
    localStorage.setItem("neodeck-theme", t);
  }

  // matrix-rain background (toggleable from the command palette)
  let matrixOn = $state(defaultConfig.matrixRain);
  $effect(() => {
    matrixOn = config.matrixRain;
  });
  function toggleMatrix() {
    matrixOn = !matrixOn;
  }
</script>

{#if matrixOn}
  <MatrixBg />
{/if}

<div class="deck">
  <header>
    <div class="brand">
      <span class="path">~/{config.title.toLowerCase()}</span><span class="cursor">█</span>
    </div>
    <div class="head-right">
      <button class="theme-btn" onclick={cycleTheme} title="Cycle theme">◑ {theme}</button>
      <Clock />
    </div>
  </header>

  <Search engines={config.search.engines} def={config.search.default} />

  {#if config.weather || config.crypto}
    <section class="stats">
      {#if config.weather}
        <Weather config={config.weather} />
      {/if}
      {#if config.crypto}
        <Crypto config={config.crypto} />
      {/if}
    </section>
  {/if}

  <main>
    <div class="bookmarks-grid">
      {#each config.bookmarks as group (group.group)}
        <Bookmarks {group} />
      {/each}
    </div>
    <aside>
      <ServiceStatus services={config.services} />
      {#if config.github}
        <GithubActivity config={config.github} />
      {/if}
      {#if config.rss}
        <RssFeed config={config.rss} />
      {/if}
    </aside>
  </main>

  {#if config.todo || config.notes || config.pomodoro}
    <section class="tools">
      {#if config.pomodoro}
        <Pomodoro />
      {/if}
      {#if config.todo}
        <Todo />
      {/if}
      {#if config.notes}
        <Notes />
      {/if}
    </section>
  {/if}

  <footer>
    NeoDeck · press <kbd>Ctrl</kbd>+<kbd>K</kbd> for commands · edit
    <code>neodeck.config.json</code> to make it yours ·
    <a href="https://github.com/DaddyYarik" target="_blank" rel="noopener">github</a>
  </footer>
</div>

<CommandPalette {config} {theme} {setTheme} {toggleMatrix} />

<style>
  .deck {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 22px 48px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .brand {
    font-size: 1rem;
    color: var(--accent);
    letter-spacing: 0.08em;
  }
  .cursor {
    animation: blink 1.1s steps(2) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  .head-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .theme-btn {
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    color: var(--muted);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 10px;
    transition: color 0.15s, border-color 0.15s;
    text-transform: lowercase;
  }
  .theme-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
  main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }
  @media (min-width: 820px) {
    main {
      grid-template-columns: 1fr 280px;
      align-items: start;
    }
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }
  aside {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .tools {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
    align-items: start;
  }
  .bookmarks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  :global(.bookmarks) {
    padding: 16px;
  }
  footer {
    margin-top: 8px;
    font-size: 0.78rem;
    color: var(--muted);
    border-top: 1px solid var(--border);
    padding-top: 16px;
  }
  footer code {
    color: var(--accent);
  }
  footer a {
    color: var(--accent);
  }
  footer kbd {
    font-family: var(--mono);
    font-size: 0.72rem;
    background: var(--panel-solid);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    color: var(--fg);
  }
</style>
