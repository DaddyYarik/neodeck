<script lang="ts">
  import type { GithubConfig } from "../config/types";
  import { relativeTime } from "./time";

  let { config }: { config: GithubConfig } = $props();

  type Repo = { name: string; stars: number; pushed: string; url: string; lang: string | null };
  let repos = $state<Repo[]>([]);
  let error = $state(false);

  $effect(() => {
    error = false;
    fetch(`https://api.github.com/users/${config.user}/repos?sort=pushed&per_page=5`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: any[]) => {
        repos = j.map((r) => ({
          name: r.name,
          stars: r.stargazers_count,
          pushed: r.pushed_at,
          url: r.html_url,
          lang: r.language,
        }));
      })
      .catch(() => (error = true));
  });
</script>

<section class="panel gh">
  <h2 class="panel-title">github · {config.user}</h2>
  {#if repos.length}
    <ul>
      {#each repos as repo (repo.url)}
        <li>
          <a href={repo.url} target="_blank" rel="noopener">
            <span class="name">{repo.name}</span>
            <span class="meta">
              {#if repo.lang}<span class="lang">{repo.lang}</span>{/if}
              {#if repo.stars > 0}<span class="stars">★ {repo.stars}</span>{/if}
              <span class="pushed">{relativeTime(repo.pushed)}</span>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  {:else if error}
    <p class="muted">couldn't load github (rate limit?)</p>
  {:else}
    <p class="muted">loading…</p>
  {/if}
</section>

<style>
  .gh {
    padding: 16px;
  }
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
    flex-direction: column;
    gap: 2px;
    padding: 6px 8px;
    border-radius: 8px;
    transition: background 0.12s;
  }
  a:hover {
    background: var(--accent-soft);
  }
  .name {
    font-size: 0.9rem;
    color: var(--accent);
  }
  .meta {
    display: flex;
    gap: 10px;
    font-size: 0.72rem;
    color: var(--muted);
  }
  .pushed {
    margin-left: auto;
  }
  .muted {
    color: var(--muted);
    margin: 0;
    font-size: 0.85rem;
  }
</style>
