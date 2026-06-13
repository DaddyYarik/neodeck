<script lang="ts">
  let now = $state(new Date());

  $effect(() => {
    const id = setInterval(() => (now = new Date()), 1000);
    return () => clearInterval(id);
  });

  const time = $derived(
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
  );
  const date = $derived(
    now.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
  );
  const greeting = $derived(
    now.getHours() < 5
      ? "burning the midnight oil"
      : now.getHours() < 12
        ? "good morning"
        : now.getHours() < 18
          ? "good afternoon"
          : "good evening",
  );
</script>

<div class="clock">
  <div class="time">{time}</div>
  <div class="meta">
    <span class="date">{date}</span>
    <span class="greet">{greeting}</span>
  </div>
</div>

<style>
  .clock {
    text-align: right;
  }
  .time {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--fg);
  }
  .meta {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .greet {
    color: var(--accent);
  }
</style>
