<script lang="ts">
  import type { SearchEngine } from "../config/types";

  let { engines, def }: { engines: SearchEngine[]; def: string } = $props();

  let query = $state("");
  let input: HTMLInputElement | undefined = $state();

  const active = $derived(resolveEngine(query));

  function resolveEngine(q: string): SearchEngine {
    const first = q.trim().split(/\s+/)[0]?.toLowerCase();
    const byKey = engines.find((e) => e.key === first);
    if (byKey) return byKey;
    return engines.find((e) => e.key === def) ?? engines[0];
  }

  function submit(e: Event) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const engine = resolveEngine(q);
    // strip the engine prefix if it was used
    const term = q.toLowerCase().startsWith(engine.key + " ")
      ? q.slice(engine.key.length + 1)
      : q;
    if (!term.trim()) return;
    window.location.href = engine.url.replace("%s", encodeURIComponent(term.trim()));
  }

  // press "/" anywhere to focus the search box
  $effect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== input) {
        e.preventDefault();
        input?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

<form class="search panel" onsubmit={submit}>
  <span class="prompt">{active.key}&gt;</span>
  <input
    bind:this={input}
    bind:value={query}
    type="text"
    placeholder="search the net — try `gh svelte`, press / to focus"
    autocomplete="off"
    spellcheck="false"
    aria-label="Search"
  />
  <span class="engine">{active.name}</span>
</form>

<style>
  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
  }
  .prompt {
    color: var(--accent);
    font-weight: 700;
  }
  input {
    flex: 1;
    background: transparent;
    border: 0;
    outline: none;
    color: var(--fg);
    font: inherit;
    font-size: 1rem;
  }
  input::placeholder {
    color: var(--muted);
  }
  .engine {
    font-size: 0.75rem;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 10px;
    white-space: nowrap;
  }
</style>
