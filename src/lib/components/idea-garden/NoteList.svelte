<!--
  The readable layer under every picture: the stickies themselves, grouped by
  kind (in the fixed kind order), optionally split by session.
-->
<script>
  import { KINDS, KIND_ORDER, EVENTS } from '$lib/data/idea-garden.js';
  import KindMark from './KindMark.svelte';

  let { notes, active = null, highlight = null, compact = false } = $props();

  const groups = $derived(
    KIND_ORDER.filter((k) => !active || active.has(k))
      .map((k) => ({ kind: k, items: notes.filter((n) => n.kind === k) }))
      .filter((g) => g.items.length)
  );
  const fragments = $derived(notes.filter((n) => n.kind === 'fragment'));
  const eventLabel = (id) => EVENTS.find((e) => e.id === id)?.label ?? id;
</script>

<div class="ig-notes" class:compact>
  {#each groups as g (g.kind)}
    <section>
      <h4>
        <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true"><KindMark kind={g.kind} size={12} /></svg>
        {KINDS[g.kind].plural}
        <span class="n">{g.items.reduce((s, n) => s + n.weight, 0)}</span>
      </h4>
      <ul>
        {#each g.items as n (n.id)}
          <li class:hit={highlight === n.id} style="--k: {KINDS[n.kind].color}">
            <span class="text">{n.text}</span>
            <span class="meta">
              {eventLabel(n.event)}
              {#if n.weight > 1}· written {n.weight}×{/if}
              {#if n.refs.length}· points to <strong>{n.refs.join(', ')}</strong>{/if}
            </span>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
  {#if fragments.length && !compact}
    <p class="fragments">
      Also on the board, not drawn: {fragments.map((f) => `“${f.text.slice(0, 40)}${f.text.length > 40 ? '…' : ''}”`).join(', ')}
    </p>
  {/if}
</div>

<style>
  .ig-notes {
    display: grid;
    gap: 1.5rem;
  }
  h4 {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0 0 0.5rem;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted, #6b6b80);
    font-weight: 700;
  }
  h4 .n {
    font-variant-numeric: tabular-nums;
    color: var(--fg, #1a1a2e);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.4rem;
  }
  li {
    border-left: 3px solid var(--k);
    background: #fff;
    border-radius: 0 8px 8px 0;
    padding: 0.5rem 0.75rem;
    box-shadow: 0 1px 2px rgba(26, 26, 46, 0.06);
    display: grid;
    gap: 0.15rem;
    transition: background 0.2s;
  }
  li.hit {
    background: #fffbea;
    box-shadow: 0 0 0 2px var(--k);
  }
  .text {
    font-size: 0.92rem;
    line-height: 1.45;
    color: var(--fg, #1a1a2e);
  }
  .meta {
    font-size: 0.72rem;
    color: var(--muted, #6b6b80);
  }
  .compact .text {
    font-size: 0.85rem;
  }
  .fragments {
    font-size: 0.78rem;
    color: var(--muted, #6b6b80);
    margin: 0;
  }
</style>
