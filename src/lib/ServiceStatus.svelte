<script lang="ts">
  import type { ServiceItem } from "../config/types";

  let { services }: { services: ServiceItem[] } = $props();

  type Status = "checking" | "up" | "down";
  let statuses = $state<Record<string, Status>>({});
  let latency = $state<Record<string, number>>({});

  async function ping(s: ServiceItem) {
    statuses[s.name] = "checking";
    const start = performance.now();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      // no-cors: we can't read the response, but a resolved fetch means the
      // host answered. Good enough for a browser-only reachability check.
      await fetch(s.url, { mode: "no-cors", signal: ctrl.signal, cache: "no-store" });
      statuses[s.name] = "up";
      latency[s.name] = Math.round(performance.now() - start);
    } catch {
      statuses[s.name] = "down";
    } finally {
      clearTimeout(timer);
    }
  }

  $effect(() => {
    const check = () => services.forEach((s) => ping(s));
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  });
</script>

<section class="panel services">
  <h2 class="panel-title">services</h2>
  <ul>
    {#each services as s (s.name)}
      <li>
        <span class="dot {statuses[s.name] ?? 'checking'}"></span>
        <span class="name">{s.name}</span>
        <span class="state">
          {#if statuses[s.name] === "up"}
            {latency[s.name]}ms
          {:else if statuses[s.name] === "down"}
            down
          {:else}
            …
          {/if}
        </span>
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
    gap: 4px;
  }
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 4px;
    font-size: 0.9rem;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--muted);
  }
  .dot.up {
    background: #3fb950;
    box-shadow: 0 0 8px #3fb95080;
  }
  .dot.down {
    background: #f85149;
    box-shadow: 0 0 8px #f8514980;
  }
  .dot.checking {
    background: var(--muted);
    animation: pulse 1s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.3;
    }
  }
  .state {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--muted);
  }
</style>
