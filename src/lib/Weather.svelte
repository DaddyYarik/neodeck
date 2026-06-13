<script lang="ts">
  import type { WeatherConfig } from "../config/types";

  let { config }: { config: WeatherConfig } = $props();

  type Current = { temp: number; wind: number; code: number };
  let data = $state<Current | null>(null);
  let error = $state(false);

  function describe(code: number): { icon: string; label: string } {
    if (code === 0) return { icon: "☀️", label: "clear" };
    if (code <= 3) return { icon: "⛅", label: "partly cloudy" };
    if (code <= 48) return { icon: "🌫️", label: "fog" };
    if (code <= 67) return { icon: "🌧️", label: "rain" };
    if (code <= 77) return { icon: "❄️", label: "snow" };
    if (code <= 82) return { icon: "🌦️", label: "showers" };
    if (code <= 86) return { icon: "🌨️", label: "snow showers" };
    return { icon: "⛈️", label: "thunderstorm" };
  }

  const meta = $derived(data ? describe(data.code) : null);
  const unitSymbol = $derived(config.units === "imperial" ? "°F" : "°C");
  const windUnitLabel = $derived(config.units === "imperial" ? "mph" : "km/h");

  $effect(() => {
    error = false;
    data = null;
    const tempUnit = config.units === "imperial" ? "fahrenheit" : "celsius";
    const windUnit = config.units === "imperial" ? "mph" : "kmh";
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}` +
      `&longitude=${config.longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (j?.current) {
          data = {
            temp: Math.round(j.current.temperature_2m),
            wind: Math.round(j.current.wind_speed_10m),
            code: j.current.weather_code,
          };
        } else {
          error = true;
        }
      })
      .catch(() => (error = true));
  });
</script>

<section class="panel weather">
  <h2 class="panel-title">weather · {config.label}</h2>
  {#if data && meta}
    <div class="row">
      <span class="icon">{meta.icon}</span>
      <span class="temp">{data.temp}{unitSymbol}</span>
      <div class="side">
        <span class="cond">{meta.label}</span>
        <span class="wind">wind {data.wind} {windUnitLabel}</span>
      </div>
    </div>
  {:else if error}
    <p class="muted">couldn't load weather</p>
  {:else}
    <p class="muted">loading…</p>
  {/if}
</section>

<style>
  .weather {
    padding: 16px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .icon {
    font-size: 2.2rem;
    line-height: 1;
  }
  .temp {
    font-size: 2rem;
    font-weight: 700;
  }
  .side {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    text-align: right;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .cond {
    color: var(--accent);
  }
  .muted {
    color: var(--muted);
    margin: 0;
    font-size: 0.85rem;
  }
</style>
