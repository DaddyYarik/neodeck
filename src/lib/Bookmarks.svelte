<script lang="ts">
  import type { BookmarkGroup } from "../config/types";

  let { group }: { group: BookmarkGroup } = $props();

  function hostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
</script>

<section class="panel bookmarks">
  <h2 class="panel-title">{group.group}</h2>
  <ul>
    {#each group.links as link (link.url)}
      <li>
        <a href={link.url} target="_blank" rel="noopener">
          <img
            class="favicon"
            src={`https://www.google.com/s2/favicons?domain=${hostname(link.url)}&sz=32`}
            alt=""
            loading="lazy"
          />
          <span class="label">{link.label}</span>
          <span class="host">{hostname(link.url)}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 9px;
    border-radius: 8px;
    transition: background 0.12s, transform 0.12s;
  }
  a:hover {
    background: var(--accent-soft);
    transform: translateX(3px);
  }
  .favicon {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .label {
    font-size: 0.92rem;
  }
  .host {
    margin-left: auto;
    font-size: 0.72rem;
    color: var(--muted);
    opacity: 0;
    transition: opacity 0.12s;
  }
  a:hover .host {
    opacity: 1;
  }
</style>
