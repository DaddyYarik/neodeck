<script lang="ts">
  import type { NeoDeckConfig, ThemeName } from "../config/types";
  import { THEMES } from "../config/types";

  let {
    config,
    theme,
    setTheme,
    toggleMatrix,
  }: {
    config: NeoDeckConfig;
    theme: ThemeName;
    setTheme: (t: ThemeName) => void;
    toggleMatrix: () => void;
  } = $props();

  type Cmd = { id: string; group: string; label: string; hint?: string; run: () => void };

  let open = $state(false);
  let query = $state("");
  let selected = $state(0);
  let inputEl: HTMLInputElement | undefined = $state();

  function hostname(u: string): string {
    try {
      return new URL(u).hostname;
    } catch {
      return u;
    }
  }

  const base = $derived.by<Cmd[]>(() => {
    const cmds: Cmd[] = [];
    for (const t of THEMES) {
      cmds.push({
        id: `theme-${t}`,
        group: "theme",
        label: `Theme: ${t}${t === theme ? " · current" : ""}`,
        run: () => setTheme(t),
      });
    }
    cmds.push({ id: "matrix", group: "toggle", label: "Toggle matrix rain", run: toggleMatrix });
    for (const g of config.bookmarks) {
      for (const l of g.links) {
        cmds.push({
          id: `bm-${l.url}`,
          group: g.group,
          label: l.label,
          hint: hostname(l.url),
          run: () => window.open(l.url, "_blank", "noopener"),
        });
      }
    }
    return cmds;
  });

  const results = $derived.by<Cmd[]>(() => {
    const term = query.trim().toLowerCase();
    const out: Cmd[] = [];
    if (term) {
      const eng =
        config.search.engines.find((e) => e.key === config.search.default) ??
        config.search.engines[0];
      if (eng) {
        out.push({
          id: "search",
          group: "search",
          label: `Search ${eng.name} for “${query.trim()}”`,
          run: () =>
            (window.location.href = eng.url.replace("%s", encodeURIComponent(query.trim()))),
        });
      }
    }
    for (const c of base) {
      if (
        !term ||
        c.label.toLowerCase().includes(term) ||
        c.group.toLowerCase().includes(term) ||
        c.hint?.toLowerCase().includes(term)
      ) {
        out.push(c);
      }
    }
    return out;
  });

  function openPalette() {
    open = true;
    query = "";
    selected = 0;
    queueMicrotask(() => inputEl?.focus());
  }
  function close() {
    open = false;
  }
  function run(cmd: Cmd | undefined) {
    if (!cmd) return;
    close();
    cmd.run();
  }

  // keep selection in range and scroll the active row into view
  $effect(() => {
    if (selected >= results.length) selected = Math.max(0, results.length - 1);
  });
  $effect(() => {
    if (!open) return;
    selected; // track
    queueMicrotask(() => {
      document.querySelector(".cp-list li.active")?.scrollIntoView({ block: "nearest" });
    });
  });

  $effect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open ? close() : openPalette();
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selected = Math.min(results.length - 1, selected + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selected = Math.max(0, selected - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(results[selected]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

{#if open}
  <div class="overlay" onclick={close} role="presentation">
    <div class="palette panel" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <input
        bind:this={inputEl}
        bind:value={query}
        oninput={() => (selected = 0)}
        placeholder="type a command — themes, bookmarks, search…"
        autocomplete="off"
        spellcheck="false"
        aria-label="Command palette"
      />
      <ul class="cp-list">
        {#each results as cmd, i (cmd.id)}
          <li class:active={i === selected} onmouseenter={() => (selected = i)} onclick={() => run(cmd)}>
            <span class="g">{cmd.group}</span>
            <span class="l">{cmd.label}</span>
            {#if cmd.hint}<span class="h">{cmd.hint}</span>{/if}
          </li>
        {/each}
        {#if results.length === 0}
          <li class="empty">no matches</li>
        {/if}
      </ul>
      <div class="foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> run</span>
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 13vh;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(3px);
  }
  .palette {
    width: min(560px, 92vw);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border-color: var(--accent);
  }
  input {
    width: 100%;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--border);
    outline: none;
    color: var(--fg);
    font: inherit;
    font-size: 1rem;
    padding: 16px 18px;
  }
  input::placeholder {
    color: var(--muted);
  }
  .cp-list {
    list-style: none;
    margin: 0;
    padding: 6px;
    max-height: 50vh;
    overflow-y: auto;
  }
  .cp-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .cp-list li.active {
    background: var(--accent-soft);
  }
  .cp-list li.empty {
    color: var(--muted);
    cursor: default;
    justify-content: center;
  }
  .g {
    font-size: 0.66rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    width: 72px;
    flex-shrink: 0;
    opacity: 0.8;
  }
  .l {
    flex: 1;
  }
  .h {
    font-size: 0.74rem;
    color: var(--muted);
  }
  .foot {
    display: flex;
    gap: 16px;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    font-size: 0.72rem;
    color: var(--muted);
  }
  kbd {
    font-family: var(--mono);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    margin-right: 2px;
  }
</style>
