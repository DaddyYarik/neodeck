<script lang="ts">
  let text = $state(localStorage.getItem("neodeck-notes") ?? "");
  let saved = $state(true);

  $effect(() => {
    localStorage.setItem("neodeck-notes", text);
    saved = true;
  });

  function onInput() {
    saved = false;
  }
</script>

<section class="panel notes">
  <h2 class="panel-title">scratchpad <span class="dot" class:saved></span></h2>
  <textarea
    bind:value={text}
    oninput={onInput}
    placeholder="jot anything — it stays in this browser"
    spellcheck="false"
  ></textarea>
</section>

<style>
  .notes {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #f0a020;
    vertical-align: middle;
    margin-left: 4px;
  }
  .dot.saved {
    background: var(--accent);
  }
  textarea {
    width: 100%;
    min-height: 140px;
    resize: vertical;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    color: var(--fg);
    font: inherit;
    font-size: 0.88rem;
    line-height: 1.5;
    outline: none;
  }
  textarea:focus {
    border-color: var(--accent);
  }
  textarea::placeholder {
    color: var(--muted);
  }
</style>
