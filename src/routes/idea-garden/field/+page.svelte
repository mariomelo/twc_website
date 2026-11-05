<script>
  import { base } from '$app/paths';
  import { garden, EVENTS, KINDS, KIND_ORDER, DOMAINS } from '$lib/data/idea-garden.js';
  import KindLegend from '$lib/components/idea-garden/KindLegend.svelte';
  import NoteList from '$lib/components/idea-garden/NoteList.svelte';
  import Tooltip from '$lib/components/idea-garden/Tooltip.svelte';

  const W = 760;
  const H = 600;
  const CX = W / 2;
  const CY = H / 2;

  // Each kind owns the corner of the domain it pulls toward.
  const CORNER = { question: -45, reframe: -135, concern: 135, action: 45 };
  const DOMAIN_ORDER = ['complex', 'complicated', 'chaotic', 'clear', 'confusion'];
  const PRACTICE = {
    complex: 'probe · sense · respond',
    complicated: 'sense · analyse · respond',
    chaotic: 'act · sense · respond',
    clear: 'sense · categorise · respond'
  };

  let mode = $state('problems');
  let eventFilter = $state('all');
  let active = $state(new Set(KIND_ORDER));
  let selected = $state(null);
  let hovered = $state(null);
  let tip = $state(null);

  const items = $derived(
    mode === 'problems'
      ? garden.problems
          .filter((p) => p.counts.total > 0)
          .filter((p) => eventFilter === 'all' || p.events.includes(eventFilter))
          .map((p) => ({ id: p.slug, label: String(p.number), title: p.title, counts: p.counts, cynefin: p.cynefin, notes: p.notes, sub: p.thinkies.join(', '), scenario: p.scenario }))
      : garden.thinkies
          .filter((t) => eventFilter === 'all' || t.sessions.some((s) => s.event === eventFilter))
          .map((t) => ({ id: t.slug, label: t.name.split(/[ /]/)[0].slice(0, 4), title: t.name, counts: t.counts, cynefin: t.cynefin, notes: t.sessions.flatMap((s) => s.notes), sub: `${t.sessions.length} sessions`, scenario: null }))
  );

  // The mix of a Thinkie board is lopsided (an all-action board is barely right
  // of the median, a concern-heavy one is far left), so each half-axis is
  // scaled to its own furthest point, then eased so the crowded middle opens up.
  // Positions are ordinal; the petals carry the actual numbers.
  const MX = 46; // keep glyphs off the domain titles
  const MY = 108;
  const ease = (v) => Math.sign(v) * Math.pow(Math.abs(v), 0.7);
  const extent = $derived.by(() => {
    const xs = items.map((i) => i.cynefin.x);
    const ys = items.map((i) => i.cynefin.y);
    return {
      xp: Math.max(0.2, ...xs),
      xn: Math.max(0.2, ...xs.map((v) => -v)),
      yp: Math.max(0.2, ...ys),
      yn: Math.max(0.2, ...ys.map((v) => -v))
    };
  });
  const toX = (x) => CX + ease(x / (x >= 0 ? extent.xp : extent.xn)) * (W / 2 - MX - 14);
  const toY = (y) => CY - ease(y / (y >= 0 ? extent.yp : extent.yn)) * (H / 2 - MY - 10);
  const ring = (n) => 9 + Math.sqrt(n) * 1.9;

  // Deterministic collision relaxation: boards with identical mixes land on the
  // same spot, so nudge glyphs apart and keep a hairline to their true point.
  const placed = $derived.by(() => {
    const pts = items.map((it) => {
      const x = toX(it.cynefin.x);
      const y = toY(it.cynefin.y);
      return { it, x0: x, y0: y, x, y, r: ring(it.counts.total) };
    });
    for (let iter = 0; iter < 160; iter++) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          const min = a.r + b.r + 9; // room for the number label
          if (d < min) {
            if (d < 0.01) {
              dx = Math.cos(i + j);
              dy = Math.sin(i + j);
              d = 1;
            }
            const push = (min - d) / 2;
            a.x -= (dx / d) * push;
            a.y -= (dy / d) * push;
            b.x += (dx / d) * push;
            b.y += (dy / d) * push;
          }
        }
        // a gentle spring back to the true position
        const p = pts[i];
        p.x += (p.x0 - p.x) * 0.02;
        p.y += (p.y0 - p.y) * 0.02;
        p.x = Math.max(MX, Math.min(W - MX, p.x));
        p.y = Math.max(MY, Math.min(H - MY - 4, p.y));
      }
    }
    return pts;
  });

  function petal(cx, cy, angleDeg, r) {
    const a0 = ((angleDeg - 42) * Math.PI) / 180;
    const a1 = ((angleDeg + 42) * Math.PI) / 180;
    const am = (angleDeg * Math.PI) / 180;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const xm = cx + Math.cos(am) * r * 1.18;
    const ym = cy + Math.sin(am) * r * 1.18;
    return `M${cx} ${cy} L${x0} ${y0} Q ${xm} ${ym} ${x1} ${y1} Z`;
  }

  const byDomain = $derived(
    DOMAIN_ORDER.map((d) => ({ domain: d, list: items.filter((it) => it.cynefin.domain === d) })).filter((g) => g.list.length)
  );
  const sel = $derived(selected ? items.find((i) => i.id === selected) : null);
  const share = (it, k) => it.counts[k] / (it.counts.total || 1);

  function enter(e, it) {
    hovered = it.id;
    tip = {
      x: e.clientX,
      y: e.clientY,
      title: it.title,
      text: KIND_ORDER.map((k) => `${KINDS[k].plural} ${Math.round(share(it, k) * 100)}%`).join(' · '),
      meta: `${DOMAINS[it.cynefin.domain].label} reading · ${it.counts.total} stickies · ${it.sub}`
    };
  }
  function leave() {
    hovered = null;
    tip = null;
  }
  function pick(id) {
    selected = selected === id ? null : id;
    if (selected) requestAnimationFrame(() => document.getElementById('field-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
</script>

<svelte:head>
  <title>Cynefin Field · Idea Garden</title>
</svelte:head>

<header class="ig-hero es-container">
  <p class="eyebrow">Proposal 4 · Reading the shape of a stuck</p>
  <h1>What the room wrote shows <span class="hl">what kind of stuck</span> it was.</h1>
  <p class="lede">
    Every sticky is a question, a concern, an action or a reframe, and each kind pulls toward one Cynefin domain.
    A challenge settles where those pulls balance, compared with a typical Thinkie table. It’s a reading aid, not
    a verdict: a lens for noticing which stucks the community met with moves, and which ones it met with new questions.
  </p>
</header>

<section class="es-container">
  <div class="toolbar">
    <div class="seg" role="group" aria-label="Plot">
      <span>Plot</span>
      <button type="button" aria-pressed={mode === 'problems'} onclick={() => ((mode = 'problems'), (selected = null))}>Challenges</button>
      <button type="button" aria-pressed={mode === 'thinkies'} onclick={() => ((mode = 'thinkies'), (selected = null))}>Thinkies</button>
    </div>
    <div class="seg" role="group" aria-label="Conference">
      <span>From</span>
      <button type="button" aria-pressed={eventFilter === 'all'} onclick={() => (eventFilter = 'all')}>Both</button>
      {#each EVENTS as e}
        <button type="button" aria-pressed={eventFilter === e.id} onclick={() => (eventFilter = e.id)}>{e.label}</button>
      {/each}
    </div>
    <KindLegend bind:active showMetaphor={false} />
  </div>

  <div class="layout">
    <div class="map" role="region" aria-label="Cynefin map" onpointerleave={leave}>
      <svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="field-title">
        <title id="field-title">Challenges placed on a Cynefin map by the mix of stickies they received.</title>
        <defs>
          <radialGradient id="conf" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#ffffff" />
            <stop offset="1" stop-color="#f3eeff" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx="18" fill="#fff" />
        <!-- domain tints -->
        <path d="M18 18 H {CX - 6} Q {CX + 10} {CY * 0.55} {CX - 4} {CY - 8} Q {CX * 0.55} {CY + 12} 18 {CY - 6} Z" fill="#f6f2fd" />
        <path d="M{CX - 6} 18 H {W - 18} V {CY + 6} Q {CX * 1.45} {CY - 10} {CX - 4} {CY - 8} Q {CX + 10} {CY * 0.55} {CX - 6} 18 Z" fill="#f2f0fb" />
        <path d="M18 {CY - 6} Q {CX * 0.55} {CY + 12} {CX - 4} {CY - 8} Q {CX - 14} {CY * 1.45} {CX + 6} {H - 18} H 18 Z" fill="#fdf2f3" />
        <path d="M{W - 18} {CY + 6} Q {CX * 1.45} {CY - 10} {CX - 4} {CY - 8} Q {CX - 14} {CY * 1.45} {CX + 6} {H - 18} H {W - 18} Z" fill="#effaf6" />
        <!-- boundaries, drawn by hand rather than as a plus sign -->
        <g class="boundary">
          <path d="M{CX - 6} 18 Q {CX + 10} {CY * 0.55} {CX - 4} {CY - 8} Q {CX - 14} {CY * 1.45} {CX + 6} {H - 18}" />
          <path d="M18 {CY - 6} Q {CX * 0.55} {CY + 12} {CX - 4} {CY - 8} Q {CX * 1.45} {CY - 10} {W - 18} {CY + 6}" />
        </g>
        <!-- the cliff between Clear and Chaotic -->
        <path d="M{CX - 12} {H - 64} q 8 8 4 18 q -4 10 6 22" class="cliff" />
        <!-- confusion -->
        <ellipse cx={CX - 4} cy={CY - 6} rx="58" ry="44" fill="url(#conf)" stroke="#d8cdee" stroke-dasharray="3 4" />

        <g class="domain-labels">
          <text x="38" y="52" class="dl">Complex</text>
          <text x="38" y="70" class="dp">{PRACTICE.complex}</text>
          <text x="38" y="86" class="pull" fill={KINDS.reframe.color}>reframes pull here</text>
          <text x={W - 38} y="86" class="pull" fill={KINDS.question.color} text-anchor="end">questions pull here</text>
          <text x="38" y={H - 74} class="pull" fill={KINDS.concern.color}>concerns pull here</text>
          <text x={W - 38} y={H - 74} class="pull" fill={KINDS.action.color} text-anchor="end">actions pull here</text>
          <text x={W - 38} y="52" class="dl" text-anchor="end">Complicated</text>
          <text x={W - 38} y="70" class="dp" text-anchor="end">{PRACTICE.complicated}</text>
          <text x="38" y={H - 56} class="dl">Chaotic</text>
          <text x="38" y={H - 38} class="dp">{PRACTICE.chaotic}</text>
          <text x={W - 38} y={H - 56} class="dl" text-anchor="end">Clear</text>
          <text x={W - 38} y={H - 38} class="dp" text-anchor="end">{PRACTICE.clear}</text>
          <text x={CX - 4} y={CY - 4} class="dc" text-anchor="middle">Confusion</text>
        </g>

        {#each placed as p (p.it.id)}
          {@const isSel = selected === p.it.id}
          {@const dim = (selected && !isSel) || (hovered && hovered !== p.it.id && !isSel)}
          <g class="item" class:dim>
            {#if Math.hypot(p.x - p.x0, p.y - p.y0) > 4}
              <line x1={p.x0} y1={p.y0} x2={p.x} y2={p.y} class="leader" />
              <circle cx={p.x0} cy={p.y0} r="1.6" class="truepoint" />
            {/if}
            <g
              role="button"
              tabindex="0"
              aria-label="{p.it.title}: {DOMAINS[p.it.cynefin.domain].label}"
              aria-pressed={isSel}
              onpointerenter={(e) => enter(e, p.it)}
              onpointerleave={leave}
              onclick={() => pick(p.it.id)}
              onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(p.it.id))}
              class="glyph"
            >
              <circle cx={p.x} cy={p.y} r={p.r} class="halo" class:sel={isSel} />
              {#each KIND_ORDER as k}
                {#if p.it.counts[k] && active.has(k)}
                  <path d={petal(p.x, p.y, CORNER[k], 3 + (p.r - 3) * Math.sqrt(share(p.it, k)))} fill={KINDS[k].color} stroke="#fff" stroke-width="1" />
                {/if}
              {/each}
              <text x={p.x} y={p.y + p.r + 10} class="num">{p.it.label}</text>
            </g>
          </g>
        {/each}
      </svg>
    </div>

    <aside class="field-list" aria-label="Challenges by domain">
      {#each byDomain as g}
        <h3>{DOMAINS[g.domain].label} <span>{g.list.length}</span></h3>
        <p class="sense">{DOMAINS[g.domain].sense}</p>
        <ul>
          {#each g.list as it (it.id)}
            <li>
              <button
                type="button"
                class:on={selected === it.id || hovered === it.id}
                onclick={() => pick(it.id)}
                onpointerenter={() => (hovered = it.id)}
                onpointerleave={() => (hovered = null)}
              >
                {#if mode === 'problems'}<span class="n">{it.label}</span>{/if}
                <span class="t">{it.title}</span>
                <span class="bar" aria-label={KIND_ORDER.map((k) => `${KINDS[k].plural} ${it.counts[k]}`).join(', ')}>
                  {#each KIND_ORDER as k}
                    {#if it.counts[k]}<span style="flex: {it.counts[k]}; background: {KINDS[k].color}"></span>{/if}
                  {/each}
                </span>
              </button>
            </li>
          {/each}
        </ul>
      {/each}
    </aside>
  </div>

  <details class="method">
    <summary>How the position is computed</summary>
    <p>
      Each kind pulls toward one corner: actions toward Clear, questions toward Complicated, reframes toward Complex and
      concerns toward Chaotic. For a board with <em>n</em> stickies:
    </p>
    <pre>x = (actions + questions − concerns − reframes) / n
y = (questions + reframes − actions − concerns) / n</pre>
    <p>
      Every Thinkie table produces mostly actions by design, so raw positions all pile up in Clear. Positions are therefore
      centred on the median challenge and scaled by the spread: a challenge lands where its mix differs from a typical
      table. Anything close to the centre, or with fewer than four stickies, reads as Confusion. The petals on each glyph
      show the actual mix, so you can always check the reading against the board. The classification itself is in
      <code>src/lib/data/idea-garden.js</code>.
    </p>
  </details>
</section>

{#if sel}
  <section id="field-detail" class="es-container detail">
    <div class="detail-head">
      <div>
        <p class="eyebrow">{DOMAINS[sel.cynefin.domain].label} reading · {sel.counts.total} stickies</p>
        <h2>{sel.title}</h2>
        {#if sel.scenario}<blockquote>{sel.scenario}</blockquote>{/if}
        <p class="muted">{DOMAINS[sel.cynefin.domain].sense} Grown with {sel.sub}.</p>
      </div>
      <button type="button" class="close" onclick={() => (selected = null)}>Close</button>
    </div>
    <div class="comp-stack" aria-hidden="true">
      {#each KIND_ORDER as k}
        {#if sel.counts[k]}
          <span style="flex: {sel.counts[k]}; background: {KINDS[k].color}">{KINDS[k].plural} {sel.counts[k]}</span>
        {/if}
      {/each}
    </div>
    <NoteList notes={sel.notes} {active} />
  </section>
{/if}

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
    font-size: clamp(2rem, 5vw, 3.2rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    max-width: 52rem;
  }
  .lede {
    max-width: 46rem;
    font-size: 1.08rem;
    color: var(--fg-soft);
    margin: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }
  .seg {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.2rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: #fff;
    font-size: 0.82rem;
  }
  .seg span {
    color: var(--muted);
    font-weight: 600;
    padding: 0 0.45rem 0 0.55rem;
  }
  .seg button {
    font: inherit;
    font-weight: 700;
    border: 0;
    border-radius: 999px;
    padding: 0.28rem 0.75rem;
    background: transparent;
    cursor: pointer;
    color: var(--fg);
  }
  .seg button[aria-pressed='true'] {
    background: var(--purple);
    color: #fff;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: 1.5rem;
    align-items: start;
  }
  .map {
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .map svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .boundary path {
    fill: none;
    stroke: #b9aed3;
    stroke-width: 1.4;
  }
  .cliff {
    fill: none;
    stroke: #8f84ab;
    stroke-width: 2.2;
    stroke-linecap: round;
  }
  .dl {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    fill: #2d2650;
  }
  .dp {
    font-size: 11px;
    letter-spacing: 0.06em;
    fill: #7d7896;
  }
  .dc {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    fill: #9b8fc0;
  }
  .pull {
    font-size: 10px;
    font-style: italic;
    opacity: 0.75;
  }
  .item {
    transition: opacity 0.2s;
  }
  .item.dim {
    opacity: 0.25;
  }
  .glyph {
    cursor: pointer;
    outline: none;
  }
  .halo {
    fill: rgba(255, 255, 255, 0.92);
    stroke: #cfc6e4;
    stroke-width: 1;
  }
  .halo.sel,
  .glyph:focus-visible .halo {
    stroke: var(--fg);
    stroke-width: 2;
  }
  .leader {
    stroke: #a79fc2;
    stroke-width: 0.8;
  }
  .truepoint {
    fill: #a79fc2;
  }
  .num {
    font-size: 10px;
    font-weight: 700;
    text-anchor: middle;
    fill: var(--fg-soft);
  }
  .field-list {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }
  .field-list h3 {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0.75rem 0 0.1rem;
    color: var(--fg);
  }
  .field-list h3:first-child {
    margin-top: 0;
  }
  .field-list h3 span {
    color: var(--muted);
  }
  .sense {
    font-size: 0.75rem;
    color: var(--muted);
    margin: 0 0 0.4rem;
  }
  .field-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.25rem;
  }
  .field-list button {
    all: unset;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.5rem;
    width: 100%;
    padding: 0.4rem 0.55rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.84rem;
    line-height: 1.3;
  }
  .field-list button:hover,
  .field-list button.on {
    background: var(--purple-soft);
  }
  .field-list button:focus-visible {
    outline: 2px solid var(--purple);
  }
  .field-list .n {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--muted);
    grid-row: span 2;
    min-width: 1.4rem;
  }
  .field-list .bar {
    display: flex;
    gap: 2px;
    height: 4px;
    grid-column: -2 / -1;
  }
  .field-list .bar span {
    border-radius: 2px;
  }
  .method {
    margin-top: 1.25rem;
    max-width: 52rem;
    font-size: 0.9rem;
    color: var(--fg-soft);
  }
  .method summary {
    cursor: pointer;
    font-weight: 700;
    color: var(--purple);
  }
  .method pre {
    background: var(--purple-soft);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.82rem;
    overflow-x: auto;
  }
  .method code {
    font-size: 0.85em;
  }
  .detail {
    margin-top: 2.5rem;
    scroll-margin-top: 5rem;
  }
  .detail-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }
  h2 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 2rem;
    margin: 0 0 0.75rem;
  }
  blockquote {
    margin: 0 0 0.75rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--border);
    background: #fff;
    font-size: 0.92rem;
    color: var(--fg-soft);
    max-width: 50rem;
  }
  .muted {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .close {
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid var(--border);
    background: #fff;
    border-radius: 999px;
    padding: 0.3rem 0.9rem;
    cursor: pointer;
    flex: none;
  }
  .comp-stack {
    display: flex;
    gap: 2px;
    margin: 1rem 0 1.75rem;
    border-radius: 6px;
    overflow: hidden;
  }
  .comp-stack span {
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.35rem 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 960px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .field-list {
      max-height: none;
    }
  }
</style>
