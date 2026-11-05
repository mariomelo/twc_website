<script>
  import { base } from '$app/paths';
  import { garden, EVENTS, KINDS, KIND_ORDER, rand, totals } from '$lib/data/idea-garden.js';
  import KindMark from '$lib/components/idea-garden/KindMark.svelte';
  import KindLegend from '$lib/components/idea-garden/KindLegend.svelte';
  import NoteList from '$lib/components/idea-garden/NoteList.svelte';
  import Tooltip from '$lib/components/idea-garden/Tooltip.svelte';
  import GrowthControl from '$lib/components/idea-garden/GrowthControl.svelte';
  import Bee from '$lib/components/idea-garden/Bee.svelte';

  // ─── Layout constants (SVG user units) ───
  const COL = 92; // width per plant
  const GROUND = 560; // y of the soil line
  const STEP = 4.7; // stem length per sticky
  const BASE = 26; // bare stem before the first leaf
  const W = garden.thinkies.length * COL + 40;
  const H = GROUND + 122;
  const EVENT_STEM = { 'twc-1': '#7a5a3a', 'twc-2': '#3f8f55' };

  let upTo = $state(EVENTS.length - 1);
  let active = $state(new Set(KIND_ORDER));
  let selected = $state(null);
  let tip = $state(null);
  let hoverNote = $state(null);

  // Tallest in the middle, like a planted bed: sort by size, then deal the
  // plants alternately to the left and right of the centre.
  const order = (() => {
    const bySize = [...garden.thinkies].sort((a, b) => b.counts.total - a.counts.total);
    const out = [];
    bySize.forEach((t, i) => (i % 2 ? out.push(t) : out.unshift(t)));
    return out;
  })();

  const included = $derived(new Set(EVENTS.slice(0, upTo + 1).map((e) => e.id)));

  function stemPoint(plant, t) {
    const u = plant.length ? t / plant.length : 0;
    return {
      x: plant.cx + plant.sway * Math.sin(u * Math.PI * 1.15 + plant.phase) * u,
      y: GROUND - t
    };
  }

  const plants = $derived(
    order.map((thinkie, i) => {
      const cx = 20 + COL * i + COL / 2;
      const sessions = thinkie.sessions.filter((s) => included.has(s.event));
      const drawn = sessions.flatMap((s) =>
        s.notes.filter((n) => n.kind !== 'fragment').map((n) => ({ ...n, stemColor: EVENT_STEM[s.event] }))
      );
      const length = BASE + drawn.length * STEP + 10;
      const plant = {
        thinkie,
        cx,
        length,
        sway: 6 + rand(thinkie.slug) * 8,
        phase: rand(thinkie.slug + 'p') * 2,
        sessions,
        count: drawn.length
      };

      // Stem drawn as one segment per event, so older growth reads as woodier.
      plant.segments = [];
      let t0 = 0;
      for (const e of EVENTS) {
        const n = drawn.filter((d) => d.event === e.id).length;
        if (!n) continue;
        const t1 = t0 === 0 ? BASE + n * STEP : t0 + n * STEP;
        plant.segments.push({ event: e.id, t0, t1 });
        t0 = t1;
      }
      if (plant.segments.length) plant.segments.at(-1).t1 = length;

      plant.leaves = drawn.map((n, k) => {
        const t = BASE + k * STEP + 2;
        const side = k % 2 ? 1 : -1;
        const r = rand(n.id);
        const p = stemPoint(plant, t);
        // Older growth (lower on the stem) has had time to get bigger.
        const age = 1 - t / plant.length;
        const concern = n.kind === 'concern';
        const reach = concern ? 4.5 : 12 + r * 8 + age * 6;
        const gx = p.x + side * reach;
        const gy = p.y - (concern ? 1 : 7 + r * 5);
        return {
          note: n,
          px: p.x,
          py: p.y,
          gx,
          gy,
          angle: concern ? side * 62 : side * (46 + r * 24),
          size: (concern ? 7 : 10 + age * 4) + (n.weight > 1 ? 3 : 0),
          concern
        };
      });

      plant.top = stemPoint(plant, length);
      plant.path = (seg) => {
        const pts = [];
        const steps = Math.max(4, Math.ceil((seg.t1 - seg.t0) / 8));
        for (let j = 0; j <= steps; j++) pts.push(stemPoint(plant, seg.t0 + ((seg.t1 - seg.t0) * j) / steps));
        return 'M' + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' L');
      };

      // One root per problem the Thinkie took root in.
      const problems = [...new Map(sessions.map((s) => [s.problem.slug, s.problem])).values()];
      plant.roots = problems.map((p, j) => {
        const spreadAngle = problems.length === 1 ? 0 : (j / (problems.length - 1) - 0.5) * 1.6;
        const len = 26 + rand(p.slug) * 14;
        const ex = cx + Math.sin(spreadAngle) * len;
        const ey = GROUND + Math.cos(spreadAngle) * len * 0.85;
        return {
          problem: p,
          d: `M${cx} ${GROUND} C ${cx + (ex - cx) * 0.2} ${GROUND + 12}, ${ex - (ex - cx) * 0.1} ${ey - 10}, ${ex} ${ey}`,
          ex,
          ey
        };
      });
      return plant;
    })
  );

  const plantByName = $derived(new Map(plants.map((p) => [p.thinkie.name, p])));

  const pollen = $derived(
    garden.links
      .filter((l) => included.has(l.note.event))
      .map((l) => {
        const a = plantByName.get(l.from);
        const b = plantByName.get(l.to);
        const ax = a.top.x;
        const ay = a.top.y - 4;
        const bx = b.top.x;
        const by = b.top.y - 4;
        const lift = 40 + Math.abs(ax - bx) * 0.18;
        const qx = (ax + bx) / 2;
        const qy = Math.max(14, Math.min(ay, by) - lift);
        // The bee flies from the plant whose sticky named the other Thinkie
        // toward the plant it named. Each bee sits a little past halfway, with
        // some jitter so bees on overlapping flight paths don't stack.
        const at = (t) => ({
          x: (1 - t) ** 2 * ax + 2 * (1 - t) * t * qx + t * t * bx,
          y: (1 - t) ** 2 * ay + 2 * (1 - t) * t * qy + t * t * by
        });
        const t = 0.45 + rand(l.note.id) * 0.2;
        const head = at(t);
        const dx = 2 * (1 - t) * (qx - ax) + 2 * t * (bx - qx);
        const dy = 2 * (1 - t) * (qy - ay) + 2 * t * (by - qy);
        return {
          link: l,
          d: `M${ax} ${ay} Q ${qx} ${qy} ${bx} ${by}`,
          x: head.x,
          y: head.y,
          angle: (Math.atan2(dy, dx) * 180) / Math.PI,
          pollen: [0.035, 0.07, 0.105].map((o) => at(Math.max(0, t - o)))
        };
      })
  );

  const sel = $derived(selected ? plants.find((p) => p.thinkie.name === selected) : null);
  const selNotes = $derived(sel ? sel.sessions.flatMap((s) => s.notes) : []);
  const allCounts = $derived(totals(garden.notes.filter((n) => included.has(n.event))));

  function splitName(name) {
    const words = name.split(' ');
    let best = [name, ''];
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      if (Math.abs(a.length - b.length) < bestDiff) {
        bestDiff = Math.abs(a.length - b.length);
        best = [a, b];
      }
    }
    return best;
  }

  function showNote(e, n) {
    hoverNote = n.id;
    tip = {
      x: e.clientX,
      y: e.clientY,
      kind: n.kind,
      text: n.text,
      meta: `${n.thinkie} · ${EVENTS.find((x) => x.id === n.event).label}`
    };
  }
  function hide() {
    tip = null;
    hoverNote = null;
  }
  function select(name) {
    selected = selected === name ? null : name;
    if (selected) requestAnimationFrame(() => document.getElementById('plant-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
</script>

<svelte:head>
  <title>Thinkie Garden · Idea Garden</title>
</svelte:head>

<header class="ig-hero es-container">
  <p class="eyebrow">Proposal 1 · A Thinkie is a plant</p>
  <h1>Every discussion is <span class="hl hl-green">new growth</span>.</h1>
  <p class="lede">
    Each Thinkie is a plant. Every time a table applies it to a challenge, the stem grows by one sticky,
    and each sticky becomes a leaf, a bud, a thorn or a flower. Roots are the challenges the Thinkie took root in.
    Older growth is darker, so you can see what each conference added.
  </p>
</header>

<section class="es-container">
  <div class="toolbar">
    <GrowthControl bind:upTo />
    <KindLegend bind:active counts={allCounts} />
  </div>

  <div class="stage" role="region" aria-label="The Thinkie garden" onpointerleave={hide}>
    <svg viewBox="0 0 {W} {H}" class="garden" role="group" aria-label="Fourteen Thinkies drawn as plants; stem length is the number of stickies they produced.">
      <defs>
        <linearGradient id="soil" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#8a6a4f" />
          <stop offset="1" stop-color="#5e4634" />
        </linearGradient>
        <pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="2" r="0.7" fill="rgba(255,255,255,0.08)" />
          <circle cx="5" cy="5.5" r="0.6" fill="rgba(0,0,0,0.12)" />
        </pattern>
      </defs>

      <!-- soil -->
      <path d="M0 {GROUND} Q {W / 4} {GROUND - 5} {W / 2} {GROUND} T {W} {GROUND} L {W} {GROUND + 60} L 0 {GROUND + 60} Z" fill="url(#soil)" />
      <rect x="0" y={GROUND} width={W} height="60" fill="url(#grain)" />

      <!-- cross-pollination: flight paths under the plants, bees above them -->
      <g class="pollen">
        {#each pollen as p}
          <path d={p.d} />
        {/each}
      </g>

      {#each plants as plant (plant.thinkie.name)}
        {@const dim = selected && selected !== plant.thinkie.name}
        <g class="plant" class:dim>
          <!-- roots -->
          {#each plant.roots as r}
            <g
              role="presentation"
              onpointerenter={(e) => (tip = { x: e.clientX, y: e.clientY, title: r.problem.title, meta: `Root · ${r.problem.events.map((id) => EVENTS.find((x) => x.id === id).label).join(' & ')}` })}
              onpointerleave={hide}
            >
              <path d={r.d} class="root" />
              <path d={r.d} class="root-hit" />
              <circle cx={r.ex} cy={r.ey} r="1.8" fill="#e9dcc9" />
            </g>
          {/each}

          <!-- stem -->
          {#each plant.segments as seg}
            <path d={plant.path(seg)} stroke={EVENT_STEM[seg.event]} class="stem" />
          {/each}

          <!-- leaves -->
          {#each plant.leaves as l (l.note.id)}
            {@const on = active.has(l.note.kind)}
            <g
              class="leaf"
              class:off={!on}
              class:hot={hoverNote === l.note.id}
              role="presentation"
              onpointerenter={(e) => on && showNote(e, l.note)}
              onpointerleave={hide}
              onclick={() => select(plant.thinkie.name)}
            >
              {#if !l.concern}
                <path d="M{l.px} {l.py} Q {(l.px + l.gx) / 2} {l.py - 1}, {l.gx} {l.gy}" stroke={l.note.stemColor} class="petiole" />
              {/if}
              <KindMark kind={l.note.kind} x={l.gx} y={l.gy} size={l.size} angle={l.angle} />
              <circle cx={l.gx} cy={l.gy} r="7" fill="transparent" />
            </g>
          {/each}

          {#if plant.count}
            <!-- terminal bud -->
            <circle cx={plant.top.x} cy={plant.top.y} r="3" fill={EVENT_STEM[plant.segments.at(-1).event]} />
          {:else}
            <!-- not planted yet at this point in time -->
            <ellipse cx={plant.cx} cy={GROUND - 1} rx="7" ry="3" fill="#8a6a4f" />
            <ellipse cx={plant.cx} cy={GROUND - 3} rx="3" ry="2" fill="#c9a77c" />
            <text x={plant.cx} y={GROUND - 14} class="count">not yet planted</text>
          {/if}

          <!-- label -->
          <g
            class="plant-label"
            role="button"
            tabindex="0"
            aria-pressed={selected === plant.thinkie.name}
            aria-label="{plant.thinkie.name}: {plant.count} stickies. Show details."
            onclick={() => select(plant.thinkie.name)}
            onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(plant.thinkie.name))}
          >
            <rect x={plant.cx - COL / 2 + 2} y={GROUND + 64} width={COL - 4} height="54" rx="8" class="label-bg" />
            {#each plant.thinkie.name.length > 13 ? splitName(plant.thinkie.name) : [plant.thinkie.name] as line, li}
              <text x={plant.cx} y={GROUND + 82 + li * 14} class="name">{line}</text>
            {/each}
            <text x={plant.cx} y={GROUND + (plant.thinkie.name.length > 13 ? 112 : 100)} class="count">
              {plant.count} · {plant.roots.length} root{plant.roots.length === 1 ? '' : 's'}
            </text>
          </g>
        </g>
      {/each}

      <g class="bees">
        {#each pollen as p, i (p.link.note.id + p.link.to)}
          <g
            class="bee"
            role="presentation"
            onpointerenter={(e) => (tip = { x: e.clientX, y: e.clientY, title: `${p.link.from} → ${p.link.to}`, text: `“${p.link.note.text}”`, meta: 'A sticky that reached for another Thinkie' })}
            onpointerleave={hide}
          >
            {#each p.pollen as d, j}
              <circle cx={d.x} cy={d.y} r={1.5 - j * 0.35} class="grain" />
            {/each}
            <Bee x={p.x} y={p.y} angle={p.angle} size={1.15} delay={-i * 0.37} />
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
          </g>
        {/each}
      </g>
    </svg>
  </div>

  <div class="key">
    <span><svg width="26" height="10" aria-hidden="true"><line x1="2" y1="5" x2="24" y2="5" stroke={EVENT_STEM['twc-1']} stroke-width="3" stroke-linecap="round" /></svg> Growth at TWC 1</span>
    <span><svg width="26" height="10" aria-hidden="true"><line x1="2" y1="5" x2="24" y2="5" stroke={EVENT_STEM['twc-2']} stroke-width="3" stroke-linecap="round" /></svg> Growth at TWC 2</span>
    <span><svg width="34" height="18" viewBox="0 0 34 18" aria-hidden="true"><path d="M2 16 Q 17 0 32 16" fill="none" stroke="#7b6a9c" stroke-dasharray="2 3" stroke-width="1.1" /><Bee x={18} y={9} angle={0} still /></svg> Cross-pollination: a bee carries a sticky that names another Thinkie</span>
    <span><svg width="26" height="12" aria-hidden="true"><path d="M13 1 C 12 6, 6 8, 4 11 M13 1 C 14 6, 20 8, 22 11" fill="none" stroke="#e9dcc9" stroke-width="1.6" /></svg> Roots: the challenges it was applied to</span>
  </div>
  <p class="hint">Hover a leaf to read it. Click a plant to open it.</p>
</section>

{#if sel}
  <section id="plant-detail" class="es-container detail">
    <div class="detail-head">
      <img src="{base}/{sel.thinkie.image}" alt="{sel.thinkie.name} Thinkie card" />
      <div>
        <p class="eyebrow">Plant</p>
        <h2>{sel.thinkie.name}</h2>
        <p class="muted">
          {sel.count} stickies across {sel.sessions.length} session{sel.sessions.length === 1 ? '' : 's'}.
        </p>
        <ol class="sessions">
          {#each sel.sessions as s}
            <li><span class="pill">{EVENTS.find((e) => e.id === s.event).label}</span> {s.problem.title}</li>
          {/each}
        </ol>
        <button type="button" class="close" onclick={() => (selected = null)}>Close</button>
      </div>
    </div>
    <NoteList notes={selNotes} {active} highlight={hoverNote} />
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
    font-size: clamp(2rem, 5vw, 3.4rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    font-weight: 700;
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
    margin: 1.5rem 0 1rem;
  }
  .stage {
    overflow-x: auto;
    border-radius: 20px;
    background: linear-gradient(#f4f7ef, #fbfaf6 70%);
    border: 1px solid var(--border);
  }
  .garden {
    display: block;
    width: 100%;
    min-width: 1000px;
    height: auto;
  }
  .stem {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .petiole {
    fill: none;
    stroke-width: 1;
    opacity: 0.8;
  }
  .plant {
    transition: opacity 0.25s;
  }
  .plant.dim {
    opacity: 0.28;
  }
  .leaf {
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .leaf.off {
    opacity: 0.12;
  }
  .leaf.hot :global(g) {
    filter: drop-shadow(0 0 3px rgba(26, 26, 46, 0.45));
  }
  .root {
    fill: none;
    stroke: #e9dcc9;
    stroke-width: 1.5;
    stroke-linecap: round;
    opacity: 0.85;
  }
  .root-hit {
    fill: none;
    stroke: transparent;
    stroke-width: 10;
  }
  .pollen path {
    fill: none;
    stroke: #7b6a9c;
    stroke-width: 1.1;
    stroke-dasharray: 2 4;
    opacity: 0.55;
  }
  .bee {
    cursor: help;
  }
  .grain {
    fill: #e2b33c;
    opacity: 0.8;
  }
  .plant-label {
    cursor: pointer;
    outline: none;
  }
  .label-bg {
    fill: transparent;
  }
  .plant-label:hover .label-bg,
  .plant-label:focus-visible .label-bg,
  .plant-label[aria-pressed='true'] .label-bg {
    fill: var(--purple-soft);
  }
  .plant-label:focus-visible .label-bg {
    stroke: var(--purple);
    stroke-width: 1.5;
  }
  .name {
    text-anchor: middle;
    font-size: 13px;
    font-weight: 700;
    fill: var(--fg);
  }
  .count {
    text-anchor: middle;
    font-size: 11px;
    fill: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .key {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin-top: 1rem;
    font-size: 0.82rem;
    color: var(--fg-soft);
  }
  .key span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .key span:last-child svg {
    background: #6b4f3a;
    border-radius: 3px;
  }
  .hint {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0.5rem 0 0;
  }
  .detail {
    margin-top: 2.5rem;
    scroll-margin-top: 5rem;
  }
  .detail-head {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: 1.5rem;
    align-items: start;
    margin-bottom: 1.75rem;
  }
  .detail-head img {
    width: 100%;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    background: #fff;
  }
  h2 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 2rem;
    margin: 0 0 0.25rem;
  }
  .muted {
    color: var(--muted);
    margin: 0 0 0.75rem;
  }
  .sessions {
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.35rem;
    font-size: 0.92rem;
  }
  .pill {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    background: var(--purple-soft);
    color: var(--purple);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
    margin-right: 0.35rem;
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
  }
  @media (max-width: 600px) {
    .detail-head {
      grid-template-columns: 1fr;
    }
    .detail-head img {
      max-width: 9rem;
    }
  }
</style>
