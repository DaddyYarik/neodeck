<script lang="ts">
  type Task = { id: number; text: string; done: boolean };

  function load(): Task[] {
    try {
      return JSON.parse(localStorage.getItem("neodeck-todo") || "[]");
    } catch {
      return [];
    }
  }

  let tasks = $state<Task[]>(load());
  let draft = $state("");

  $effect(() => {
    localStorage.setItem("neodeck-todo", JSON.stringify(tasks));
  });

  function add(e: Event) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    tasks = [...tasks, { id: Date.now(), text, done: false }];
    draft = "";
  }

  function toggle(id: number) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  function remove(id: number) {
    tasks = tasks.filter((t) => t.id !== id);
  }

  const remaining = $derived(tasks.filter((t) => !t.done).length);
</script>

<section class="panel todo">
  <h2 class="panel-title">tasks {#if tasks.length}· {remaining} left{/if}</h2>
  <form onsubmit={add}>
    <input bind:value={draft} placeholder="add a task…" aria-label="New task" />
  </form>
  <ul>
    {#each tasks as task (task.id)}
      <li class:done={task.done}>
        <button class="check" onclick={() => toggle(task.id)} aria-label="Toggle">
          {task.done ? "▣" : "▢"}
        </button>
        <span class="text">{task.text}</span>
        <button class="del" onclick={() => remove(task.id)} aria-label="Delete">✕</button>
      </li>
    {/each}
    {#if tasks.length === 0}
      <li class="empty">nothing yet — add one above</li>
    {/if}
  </ul>
</section>

<style>
  .todo {
    padding: 16px;
  }
  form {
    margin-bottom: 10px;
  }
  input {
    width: 100%;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 7px 10px;
    color: var(--fg);
    font: inherit;
    font-size: 0.88rem;
    outline: none;
  }
  input:focus {
    border-color: var(--accent);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 2px;
    font-size: 0.88rem;
  }
  li.empty {
    color: var(--muted);
    font-size: 0.82rem;
    padding: 4px;
  }
  .check,
  .del {
    background: none;
    border: 0;
    cursor: pointer;
    color: var(--muted);
    font: inherit;
    padding: 0;
    line-height: 1;
  }
  .check {
    color: var(--accent);
    font-size: 1rem;
  }
  .del {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.12s;
  }
  li:hover .del {
    opacity: 1;
  }
  .del:hover {
    color: #f85149;
  }
  li.done .text {
    text-decoration: line-through;
    color: var(--muted);
  }
</style>
