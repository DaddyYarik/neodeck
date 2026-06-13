<script lang="ts">
  let canvas: HTMLCanvasElement;

  $effect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "01ｱｲｳｴｵｶｷｸｹｺ$#@<>/\\{}[]アカサ".split("");
    const fontSize = 14;
    let cols = 0;
    let drops: number[] = [];

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#4cd4b0";

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols)
        .fill(0)
        .map(() => Math.random() * -100);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = accent;
      ctx.font = fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  });
</script>

<canvas bind:this={canvas} class="matrix"></canvas>

<style>
  .matrix {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.08;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .matrix {
      display: none;
    }
  }
</style>
