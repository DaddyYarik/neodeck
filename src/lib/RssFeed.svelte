<script lang="ts">
  import type { RssConfig } from "../config/types";

  let { config }: { config: RssConfig } = $props();

  type Item = { title: string; link: string };
  let items = $state<Item[]>([]);
  let error = $state(false);

  function parseFeed(xml: string, limit: number): Item[] {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const nodes = Array.from(doc.querySelectorAll("item, entry")).slice(0, limit);
    return nodes.map((n) => {
      const title = n.querySelector("title")?.textContent?.trim() || "(untitled)";
      const linkEl = n.querySelector("link");
      const link =
        linkEl?.getAttribute("href") || linkEl?.textContent?.trim() || "#";
      return { title, link };
    });
  }

  $effect(() => {
    error = false;
    items = [];
    const proxy = config.proxy ?? "https://api.allorigins.win/raw?url=";
    const limit = config.limit ?? 6;
    Promise.all(
      config.feeds.map((f) =>
        fetch(proxy + encodeURIComponent(f.url))
          .then((r) => (r.ok ? r.text() : Promise.reject()))
          .then((xml) => parseFeed(xml, limit))
          .catch(() => [] as Item[]),
      ),
    )
      .then((arrs) => {
        const merged = arrs.flat().slice(0, limit);
        items = merged;
        if (merged.length === 0) error = true;
      })
      .catch(() => (error = true));
  });
</script>

<section class="panel rss">
  <h2 class="panel-title">feed</h2>
  {#if items.length}
    <ul>
      {#each items as item (item.link)}
        <li>
          <a href={item.link} target="_blank" rel="noopener">{item.title}</a>
        </li>
      {/each}
    </ul>
  {:else if error}
    <p class="muted">couldn't load feed</p>
  {:else}
    <p class="muted">loading…</p>
  {/if}
</section>

<style>
  .rss {
    padding: 16px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  a {
    display: block;
    font-size: 0.85rem;
    padding: 4px 6px;
    border-radius: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background 0.12s, color 0.12s;
  }
  a:hover {
    background: var(--accent-soft);
    color: var(--accent);
  }
  .muted {
    color: var(--muted);
    margin: 0;
    font-size: 0.85rem;
  }
</style>
