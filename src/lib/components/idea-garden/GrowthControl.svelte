<!--
  "Grow the garden to…" — shows what had grown after each conference. Bound
  value is the index of the last event included (0 = TWC 1 only).
-->
<script>
  import { EVENTS } from '$lib/data/idea-garden.js';

  let { upTo = $bindable(EVENTS.length - 1), dark = false } = $props();
</script>

<div class="ig-growth" class:dark role="group" aria-label="Show growth up to">
  <span class="lead">Grown through</span>
  {#each EVENTS as e, i}
    <button type="button" aria-pressed={upTo === i} onclick={() => (upTo = i)}>{e.label}</button>
  {/each}
</div>

<style>
  .ig-growth {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    border: 1px solid var(--border, #e7e4f0);
    border-radius: 999px;
    background: #fff;
    font-size: 0.82rem;
  }
  .lead {
    padding: 0 0.5rem 0 0.6rem;
    color: var(--muted, #6b6b80);
    font-weight: 600;
  }
  button {
    font: inherit;
    font-weight: 700;
    border: 0;
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    background: transparent;
    color: var(--fg, #1a1a2e);
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    background: var(--purple, #533483);
    color: #fff;
  }
  button:focus-visible {
    outline: 2px solid var(--purple, #533483);
    outline-offset: 2px;
  }
  .dark {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.16);
  }
  .dark .lead {
    color: rgba(241, 238, 251, 0.6);
  }
  .dark button {
    color: #f1eefb;
  }
  .dark button[aria-pressed='true'] {
    background: #f1eefb;
    color: #1a1a2e;
  }
</style>
