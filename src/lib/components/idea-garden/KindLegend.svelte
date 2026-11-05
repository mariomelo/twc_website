<!--
  Legend + filter for the four kinds. When `active` is bound, each entry is a
  toggle button; otherwise it renders as a static key. Counts are optional.
-->
<script>
  import { KINDS, KIND_ORDER } from '$lib/data/idea-garden.js';
  import KindMark from './KindMark.svelte';

  // `metaphors` lets a view rename a kind's metaphor when it draws it differently
  // (e.g. the specimens draw concerns as roots, not thorns).
  let { counts = null, active = $bindable(null), dark = false, showMetaphor = true, metaphors = {} } = $props();

  function toggle(k) {
    if (!active) return;
    const next = new Set(active);
    if (next.has(k)) {
      if (next.size > 1) next.delete(k);
    } else next.add(k);
    active = next;
  }
</script>

<ul class="ig-legend" class:dark>
  {#each KIND_ORDER as k}
    {@const info = KINDS[k]}
    <li>
      {#if active}
        <button
          type="button"
          class="ig-legend-item"
          aria-pressed={active.has(k)}
          onclick={() => toggle(k)}
        >
          <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden="true"><KindMark kind={k} size={14} /></svg>
          <span class="ig-legend-label">{info.plural}</span>
          {#if showMetaphor}<span class="ig-legend-meta">{metaphors[k] ?? info.metaphor}</span>{/if}
          {#if counts}<span class="ig-legend-count">{counts[k]}</span>{/if}
        </button>
      {:else}
        <span class="ig-legend-item is-static">
          <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden="true"><KindMark kind={k} size={14} /></svg>
          <span class="ig-legend-label">{info.plural}</span>
          {#if showMetaphor}<span class="ig-legend-meta">{metaphors[k] ?? info.metaphor}</span>{/if}
          {#if counts}<span class="ig-legend-count">{counts[k]}</span>{/if}
        </span>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .ig-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .ig-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.75rem 0.3rem 0.45rem;
    border-radius: 999px;
    border: 1px solid var(--border, #e7e4f0);
    background: #fff;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--fg, #1a1a2e);
    cursor: pointer;
    transition: opacity 0.15s, background 0.15s;
  }
  .ig-legend-item.is-static {
    cursor: default;
  }
  button.ig-legend-item[aria-pressed='false'] {
    opacity: 0.4;
    background: transparent;
  }
  button.ig-legend-item:focus-visible {
    outline: 2px solid var(--purple, #533483);
    outline-offset: 2px;
  }
  .ig-legend-meta {
    font-weight: 500;
    color: var(--muted, #6b6b80);
    font-style: italic;
  }
  .ig-legend-count {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--muted, #6b6b80);
  }
  .dark .ig-legend-item {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.16);
    color: #f1eefb;
  }
  .dark .ig-legend-meta,
  .dark .ig-legend-count {
    color: rgba(241, 238, 251, 0.6);
  }
</style>
