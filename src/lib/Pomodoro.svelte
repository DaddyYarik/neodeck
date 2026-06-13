<script lang="ts">
  type Mode = "focus" | "break";
  const DURATIONS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

  let mode = $state<Mode>("focus");
  let remaining = $state(DURATIONS.focus);
  let running = $state(false);
  let rounds = $state(0);

  const label = $derived(mode === "focus" ? "focus" : "break");
  const mmss = $derived(
    `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`,
  );
  const progress = $derived(1 - remaining / DURATIONS[mode]);

  function beep() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* audio not available */
    }
  }

  function complete() {
    beep();
    if (mode === "focus") rounds += 1;
    mode = mode === "focus" ? "break" : "focus";
    remaining = DURATIONS[mode];
    running = false;
  }

  $effect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (remaining <= 1) {
        complete();
      } else {
        remaining -= 1;
      }
    }, 1000);
    return () => clearInterval(id);
  });

  function toggle() {
    running = !running;
  }
  function reset() {
    running = false;
    remaining = DURATIONS[mode];
  }
  function switchMode() {
    running = false;
    mode = mode === "focus" ? "break" : "focus";
    remaining = DURATIONS[mode];
  }
</script>

<section class="panel pomo">
  <h2 class="panel-title">pomodoro · {label}{#if rounds > 0} · {rounds}🍅{/if}</h2>
  <button class="time" onclick={switchMode} title="Switch focus/break" style={`--p:${progress}`}>
    {mmss}
  </button>
  <div class="controls">
    <button class="ctl primary" onclick={toggle}>{running ? "pause" : "start"}</button>
    <button class="ctl" onclick={reset}>reset</button>
  </div>
</section>

<style>
  .pomo {
    padding: 16px;
    text-align: center;
  }
  .time {
    display: block;
    width: 100%;
    background: none;
    border: 0;
    cursor: pointer;
    font: inherit;
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--fg);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    margin: 4px 0 12px;
    position: relative;
  }
  .time::after {
    content: "";
    display: block;
    height: 3px;
    margin-top: 4px;
    border-radius: 3px;
    background: linear-gradient(
      to right,
      var(--accent) calc(var(--p, 0) * 100%),
      var(--border) 0
    );
  }
  .controls {
    display: flex;
    gap: 8px;
  }
  .ctl {
    flex: 1;
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--fg);
    transition: border-color 0.12s, color 0.12s, background 0.12s;
  }
  .ctl:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
  .ctl.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #06231c;
    font-weight: 600;
  }
</style>
