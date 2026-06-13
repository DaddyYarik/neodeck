<script lang="ts">
  import type { CryptoConfig } from "../config/types";

  let { config }: { config: CryptoConfig } = $props();

  type Row = { id: string; price: number; change: number };
  let rows = $state<Row[]>([]);
  let error = $state(false);

  const vs = $derived(config.vs ?? "usd");

  function fmtPrice(p: number): string {
    return new Intl.NumberFormat([], {
      style: "currency",
      currency: vs.toUpperCase(),
      maximumFractionDigits: p < 10 ? 4 : 0,
    }).format(p);
  }

  $effect(() => {
    const ids = config.coins.join(",");
    const cur = config.vs ?? "usd";
    const load = () => {
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}` +
          `&vs_currencies=${cur}&include_24hr_change=true`,
      )
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j) => {
          rows = config.coins
            .map((c) => ({
              id: c,
              price: j[c]?.[cur],
              change: j[c]?.[`${cur}_24h_change`] ?? 0,
            }))
            .filter((r) => typeof r.price === "number");
          error = false;
        })
        .catch(() => (error = true));
    };
    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  });
</script>

<section class="panel crypto">
  <h2 class="panel-title">markets</h2>
  {#if rows.length}
    <ul>
      {#each rows as row (row.id)}
        <li>
          <span class="coin">{row.id}</span>
          <span class="price">{fmtPrice(row.price)}</span>
          <span class="change" class:up={row.change >= 0} class:down={row.change < 0}>
            {row.change >= 0 ? "▲" : "▼"}{Math.abs(row.change).toFixed(1)}%
          </span>
        </li>
      {/each}
    </ul>
  {:else if error}
    <p class="muted">couldn't load markets</p>
  {:else}
    <p class="muted">loading…</p>
  {/if}
</section>

<style>
  .crypto {
    padding: 16px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
  }
  .coin {
    text-transform: capitalize;
  }
  .price {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }
  .change {
    width: 72px;
    text-align: right;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }
  .change.up {
    color: #3fb950;
  }
  .change.down {
    color: #f85149;
  }
  .muted {
    color: var(--muted);
    margin: 0;
    font-size: 0.85rem;
  }
</style>
