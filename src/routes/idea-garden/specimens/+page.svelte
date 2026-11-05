<script>
  import { garden, EVENTS, KINDS, KIND_ORDER, DOMAINS, totals } from '$lib/data/idea-garden.js';
  import Specimen from '$lib/components/idea-garden/Specimen.svelte';
  import KindLegend from '$lib/components/idea-garden/KindLegend.svelte';
  import NoteList from '$lib/components/idea-garden/NoteList.svelte';
  import Tooltip from '$lib/components/idea-garden/Tooltip.svelte';

  let active = $state(new Set(KIND_ORDER));
  let sortBy = $state('number');
  let tip = $state(null);
  let hot = $state(null);
  let open = $state(null);
  let dialog;

  const DOMAIN_ORDER = ['clear', 'complicated', 'complex', 'chaotic', 'confusion'];
  const SORTS = {
    number: { label: 'Collected', fn: (a, b) => a.number - b.number },
    size: { label: 'Most growth', fn: (a, b) => b.counts.total - a.counts.total },
    roots: { label: 'Deepest roots', fn: (a, b) => b.counts.concern / (b.counts.total || 1) - a.counts.concern / (a.counts.total || 1) },
    flowers: { label: 'Most in flower', fn: (a, b) => b.counts.reframe / (b.counts.total || 1) - a.counts.reframe / (a.counts.total || 1) },
    domain: { label: 'Cynefin reading', fn: (a, b) => DOMAIN_ORDER.indexOf(a.cynefin.domain) - DOMAIN_ORDER.indexOf(b.cynefin.domain) || a.number - b.number }
  };

  const plates = $derived([...garden.problems].filter((p) => p.counts.total > 0).sort(SORTS[sortBy].fn));
  const counts = totals();
  const label = (id) => EVENTS.find((e) => e.id === id).label;

  function hover(e, n) {
    hot = n.id;
    tip = { x: e.clientX, y: e.clientY, kind: n.kind, text: n.text, meta: `${n.thinkie} · ${label(n.event)}` };
  }
  function leave() {
    hot = null;
    tip = null;
  }
  function show(p) {
    open = p;
    tip = null;
    dialog.showModal();
  }
  const pct = (p, k) => Math.round((100 * p.counts[k]) / (p.counts.total || 1));
</script>

<svelte:head>
  <title>Problem Specimens · Idea Garden</title>
</svelte:head>

<header class="ig-hero es-container">
  <p class="eyebrow">Proposal 3 · A problem is a plant</p>
  <h1>Pressed specimens of <span class="hl hl-orange">{plates.length} stucks</span>.</h1>
  <p class="lede">
    Here the challenge is the plant and the Thinkies are what made it grow. Concerns are roots: they hold the problem
    in place. Each time a table worked on it, a stem came up, carrying actions as leaves and questions as buds. Reframes
    flower at the crown, where the problem started to look different.
  </p>
</header>

<section class="es-container">
  <div class="toolbar">
    <div class="sort" role="group" aria-label="Arrange specimens by">
      <span>Arrange by</span>
      {#each Object.entries(SORTS) as [k, s]}
        <button type="button" aria-pressed={sortBy === k} onclick={() => (sortBy = k)}>{s.label}</button>
      {/each}
    </div>
    <KindLegend bind:active {counts} />
  </div>

  <ol class="plates" onpointerleave={leave}>
    {#each plates as p (p.slug)}
      <li class="plate">
        <svg viewBox="0 0 240 262" role="img" aria-label="Specimen: {p.title}">
          <Specimen problem={p} {active} highlight={hot} onhover={hover} onleave={leave} />
        </svg>
        <button type="button" class="label-card" onclick={() => show(p)}>
          <span class="no">No. {String(p.number).padStart(2, '0')}</span>
          <span class="title">{p.title}</span>
          <span class="meta">
            {p.counts.total} stickies · {p.sessions.map((s) => `${s.thinkie} @ ${label(s.event)}`).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
            {#if sortBy === 'domain'}· <em>{DOMAINS[p.cynefin.domain].label}</em>{/if}
          </span>
          <span class="bar" aria-hidden="true">
            {#each KIND_ORDER as k}
              {#if p.counts[k]}<span style="flex: {p.counts[k]}; background: {KINDS[k].color}"></span>{/if}
            {/each}
          </span>
        </button>
      </li>
    {/each}
  </ol>
  <p class="hint">
    Hover any leaf, bud, flower or root to read it. Open a label for the full specimen. One challenge, “No way to
    correlate logs”, was brought back at TWC 2 with an empty board, so its second stem never sprouted.
  </p>
</section>

<dialog bind:this={dialog} onclose={() => (open = null)} class="sheet" onpointerleave={leave}>
  {#if open}
    <div class="sheet-grid">
      <div class="sheet-plant">
        <svg viewBox="0 0 240 262" role="img" aria-label="Specimen: {open.title}, enlarged">
          <Specimen problem={open} {active} highlight={hot} onhover={hover} onleave={leave} />
        </svg>
        <dl class="herbarium">
          <div><dt>No.</dt><dd>{String(open.number).padStart(2, '0')}</dd></div>
          <div><dt>Collected at</dt><dd>{open.events.map(label).join(' & ')}</dd></div>
          <div><dt>Grown with</dt><dd>{open.thinkies.join(', ')}</dd></div>
          <div>
            <dt>Composition</dt>
            <dd>
              {#each KIND_ORDER as k}
                <span class="comp" style="--k: {KINDS[k].color}">{KINDS[k].metaphors} {pct(open, k)}%</span>
              {/each}
            </dd>
          </div>
        </dl>
      </div>
      <div class="sheet-text">
        <button type="button" class="close" onclick={() => dialog.close()} aria-label="Close specimen">×</button>
        <p class="eyebrow">Specimen No. {String(open.number).padStart(2, '0')}</p>
        <h2>{open.title}</h2>
        <blockquote>{open.scenario}</blockquote>
        <NoteList notes={open.notes} {active} highlight={hot} compact />
      </div>
    </div>
  {/if}
</dialog>

<Tooltip {tip} />

<style>
  .ig-hero {
    padding-top: clamp(2.5rem, 6vw, 4.5rem);
    padding-bottom: 1.5rem;
  }
  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--purple);
    margin: 0 0 0.75rem;
  }
  h1 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: clamp(2rem, 5vw, 3.4rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
  }
  .lede {
    max-width: 44rem;
    font-size: 1.08rem;
    color: var(--fg-soft);
    margin: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    align-items: center;
    justify-content: space-between;
    margin: 1.5rem 0 1.25rem;
  }
  .sort {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.82rem;
  }
  .sort span {
    color: var(--muted);
    font-weight: 600;
    margin-right: 0.35rem;
  }
  .sort button {
    font: inherit;
    font-weight: 600;
    border: 1px solid var(--border);
    background: #fff;
    border-radius: 999px;
    padding: 0.28rem 0.75rem;
    cursor: pointer;
    color: var(--fg);
  }
  .sort button[aria-pressed='true'] {
    background: var(--fg);
    color: #fff;
    border-color: var(--fg);
  }
  .plates {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.25rem;
  }
  .plate {
    background: #fffdf7;
    border: 1px solid #ece4d3;
    border-radius: 6px;
    box-shadow:
      0 1px 0 #fff inset,
      0 6px 18px rgba(80, 60, 30, 0.07);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .plate svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .label-card {
    all: unset;
    box-sizing: border-box;
    display: grid;
    gap: 0.2rem;
    margin: 0 0.75rem 0.75rem auto;
    width: calc(100% - 1.5rem);
    padding: 0.55rem 0.7rem 0.6rem;
    border: 1px solid #d9cdb4;
    background: #fbf6ea;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .label-card:hover {
    background: #f6eedb;
    transform: translateY(-1px);
  }
  .label-card:focus-visible {
    outline: 2px solid var(--purple);
    outline-offset: 2px;
  }
  .no {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.68rem;
    color: #8b7b62;
    letter-spacing: 0.06em;
  }
  .title {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 0.98rem;
    line-height: 1.25;
    font-weight: 700;
    color: var(--ig-ink);
  }
  .meta {
    font-size: 0.72rem;
    color: #7a6f62;
  }
  .bar {
    display: flex;
    gap: 2px;
    height: 5px;
    margin-top: 0.25rem;
  }
  .bar span {
    border-radius: 2px;
  }
  .hint {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 1rem 0 0;
  }
  .sheet {
    width: min(68rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    border: 0;
    border-radius: 14px;
    padding: 0;
    background: #fffdf7;
    box-shadow: var(--shadow-lg);
  }
  .sheet::backdrop {
    background: rgba(26, 26, 46, 0.45);
    backdrop-filter: blur(3px);
  }
  .sheet-grid {
    display: grid;
    grid-template-columns: minmax(0, 24rem) 1fr;
  }
  .sheet-plant {
    padding: 1.5rem;
    border-right: 1px solid #ece4d3;
  }
  .sheet-plant svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .herbarium {
    margin: 0.5rem 0 0;
    border: 1px solid #d9cdb4;
    background: #fbf6ea;
    padding: 0.75rem 0.9rem;
    font-size: 0.8rem;
    display: grid;
    gap: 0.4rem;
  }
  .herbarium div {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 0.5rem;
  }
  .herbarium dt {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #8b7b62;
    padding-top: 0.15rem;
  }
  .herbarium dd {
    margin: 0;
    color: var(--ig-ink);
  }
  .comp {
    display: inline-block;
    margin-right: 0.6rem;
    white-space: nowrap;
  }
  .comp::before {
    content: '';
    display: inline-block;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 2px;
    background: var(--k);
    margin-right: 0.3rem;
  }
  .sheet-text {
    padding: 1.75rem 1.75rem 2rem;
    overflow-y: auto;
    max-height: calc(100vh - 2rem);
    position: relative;
  }
  .close {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 1.3rem;
    line-height: 1;
    cursor: pointer;
  }
  h2 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 1.8rem;
    line-height: 1.15;
    margin: 0 2.5rem 0.75rem 0;
  }
  blockquote {
    margin: 0 0 1.5rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid #d9cdb4;
    background: #fbf6ea;
    font-size: 0.9rem;
    color: var(--fg-soft);
  }
  @media (max-width: 760px) {
    .sheet-grid {
      grid-template-columns: 1fr;
    }
    .sheet-plant {
      border-right: 0;
      border-bottom: 1px solid #ece4d3;
    }
    .sheet-text {
      max-height: none;
    }
    .sheet {
      overflow-y: auto;
    }
  }
</style>
