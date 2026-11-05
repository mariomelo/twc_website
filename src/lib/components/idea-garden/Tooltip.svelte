<!--
  Hover card for any mark. Fixed-positioned from the pointer so it never gets
  clipped by an overflow:auto chart wrapper. `tip` is null or
  { x, y, title?, text, kind?, meta? } in client coordinates.
-->
<script>
  import { KINDS } from '$lib/data/idea-garden.js';
  import KindMark from './KindMark.svelte';

  let { tip = null } = $props();

  let w = $state(0);
  let vw = $state(1200);
  const left = $derived(tip ? Math.min(Math.max(8, tip.x + 14), vw - w - 8) : 0);
</script>

<svelte:window bind:innerWidth={vw} />

{#if tip}
  <div class="ig-tip" role="tooltip" bind:clientWidth={w} style="left: {left}px; top: {tip.y + 16}px">
    {#if tip.kind && KINDS[tip.kind]}
      <span class="kind">
        <svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><KindMark kind={tip.kind} size={11} /></svg>
        {KINDS[tip.kind].label}
      </span>
    {/if}
    {#if tip.title}<strong>{tip.title}</strong>{/if}
    {#if tip.text}<p>{tip.text}</p>{/if}
    {#if tip.meta}<span class="meta">{tip.meta}</span>{/if}
  </div>
{/if}

<style>
  .ig-tip {
    position: fixed;
    z-index: 200;
    max-width: 20rem;
    background: #1a1a2e;
    color: #f4f2fb;
    border-radius: 10px;
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    line-height: 1.45;
    pointer-events: none;
    box-shadow: 0 10px 30px rgba(26, 26, 46, 0.3);
    display: grid;
    gap: 0.25rem;
  }
  .kind {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(244, 242, 251, 0.7);
    font-weight: 700;
  }
  strong {
    font-weight: 700;
  }
  p {
    margin: 0;
  }
  .meta {
    font-size: 0.72rem;
    color: rgba(244, 242, 251, 0.6);
  }
</style>
