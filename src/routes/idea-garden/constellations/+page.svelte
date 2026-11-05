<script>
  import { base } from '$app/paths';
  import { garden, EVENTS, KINDS, KIND_ORDER, rand, totals } from '$lib/data/idea-garden.js';
  import Constellation from '$lib/components/idea-garden/Constellation.svelte';
  import NoteList from '$lib/components/idea-garden/NoteList.svelte';
  import Tooltip from '$lib/components/idea-garden/Tooltip.svelte';
  import GrowthControl from '$lib/components/idea-garden/GrowthControl.svelte';

  const W = 1200;
  const H = 900;

  let upTo = $state(EVENTS.length - 1);
  let active = $state(new Set(KIND_ORDER));
  let selected = $state(null);
  let tip = $state(null);
  let hot = $state(null);

  // Three staggered rows. The biggest constellations take the roomier middle
  // row; the rest alternate between top and bottom.
  const SLOTS = {
    middle: [
      [250, 450],
      [490, 450],
      [730, 450],
      [960, 450]
    ],
    outer: [
      [125, 165],
      [125, 745],
      [365, 165],
      [365, 745],
      [605, 165],
      [605, 745],
      [845, 165],
      [845, 745],
      [1075, 165],
      [1075, 745]
    ]
  };
  const radius = (n) => 40 + 6.6 * Math.sqrt(n);

  const placed = (() => {
    const bySize = [...garden.thinkies].sort((a, b) => b.counts.total - a.counts.total);
    const middleOrder = [1, 2, 0, 3]; // biggest in the centre-left, then around it
    return bySize.map((t, i) => {
      const [cx, cy] = i < 4 ? SLOTS.middle[middleOrder[i]] : SLOTS.outer[i - 4];
      return { thinkie: t, cx, cy, R: Math.min(112, radius(t.counts.total)) };
    });
  })();
  const byName = new Map(placed.map((p) => [p.thinkie.name, p]));

  const included = $derived(new Set(EVENTS.slice(0, upTo + 1).map((e) => e.id)));

  // A faint, fixed field of background stars, seeded so it never jumps.
  const dust = Array.from({ length: 220 }, (_, i) => ({
    x: rand('dx' + i) * W,
    y: rand('dy' + i) * H,
    r: 0.3 + rand('dr' + i) * 0.9,
    o: 0.15 + rand('do' + i) * 0.45
  }));

  const bridges = $derived(
    garden.links
      .filter((l) => included.has(l.note.event))
      .map((l, i) => {
        const a = byName.get(l.from);
        const b = byName.get(l.to);
        const mx = (a.cx + b.cx) / 2;
        const my = (a.cy + b.cy) / 2;
        // Bend each bridge sideways so parallel ones don't overlap.
        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const len = Math.hypot(dx, dy) || 1;
        const bend = 0.18 * len * (i % 2 ? 1 : -1);
        const qx = mx - (dy / len) * bend;
        const qy = my + (dx / len) * bend;
        // A comet travelling from the Thinkie whose sticky named the other one
        // toward the Thinkie it named. The tail trails back along the curve and
        // narrows to nothing, so the direction reads without an arrowhead.
        const at = (t) => ({
          x: (1 - t) ** 2 * a.cx + 2 * (1 - t) * t * qx + t * t * b.cx,
          y: (1 - t) ** 2 * a.cy + 2 * (1 - t) * t * qy + t * t * b.cy
        });
        const tHead = 0.56 + rand(l.note.id) * 0.14;
        const span = Math.min(0.4, 90 / len); // roughly 90 units of tail
        const N = 14;
        const spine = Array.from({ length: N + 1 }, (_, k) => at(Math.max(0, tHead - (span * k) / N)));
        const ribbon = (maxW) => {
          const left = [];
          const right = [];
          spine.forEach((p, k) => {
            const q = spine[Math.min(N, k + 1)];
            const r = spine[Math.max(0, k - 1)];
            const tx = r.x - q.x;
            const ty = r.y - q.y;
            const tl = Math.hypot(tx, ty) || 1;
            const w = maxW * Math.pow(1 - k / N, 1.3);
            left.push(`${(p.x - (ty / tl) * w).toFixed(1)} ${(p.y + (tx / tl) * w).toFixed(1)}`);
            right.push(`${(p.x + (ty / tl) * w).toFixed(1)} ${(p.y - (tx / tl) * w).toFixed(1)}`);
          });
          return `M${left.join(' L')} L${right.reverse().join(' L')} Z`;
        };
        return {
          link: l,
          id: `comet-${i}`,
          d: `M${a.cx} ${a.cy} Q ${qx} ${qy} ${b.cx} ${b.cy}`,
          head: spine[0],
          end: spine[N],
          halo: ribbon(5.5),
          core: ribbon(2.2)
        };
      })
  );

  const sel = $derived(selected ? byName.get(selected) : null);
  const selNotes = $derived(sel ? sel.thinkie.sessions.filter((s) => included.has(s.event)).flatMap((s) => s.notes) : []);
  const counts = $derived(totals(garden.notes.filter((n) => included.has(n.event))));

  function hover(e, n) {
    hot = n.id;
    tip = { x: e.clientX, y: e.clientY, kind: n.kind, text: n.text, meta: `${n.thinkie} · ${EVENTS.find((x) => x.id === n.event).label}` };
  }
  function leave() {
    hot = null;
    tip = null;
  }
  function toggle(k) {
    const next = new Set(active);
    if (next.has(k)) {
      if (next.size > 1) next.delete(k);
    } else next.add(k);
    active = next;
  }
  function select(name) {
    selected = selected === name ? null : name;
    if (selected) requestAnimationFrame(() => document.getElementById('star-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
</script>

<svelte:head>
  <title>Constellations · Idea Garden</title>
</svelte:head>

<header class="ig-hero es-container">
  <p class="eyebrow">Proposal 2 · A Thinkie is a constellation</p>
  <h1>Each conversation <span class="hl hl-purple">widens the sky</span>.</h1>
  <p class="lede">
    Each Thinkie is a bright centre. Every session that used it adds an orbit further out, so a constellation
    expands each time the community comes back to it. Each kind of sticky has its own quarter of the sky, so you can
    see at a glance whether a Thinkie draws out moves, questions, worries or new framings.
  </p>
</header>

<section class="sky-wrap">
  <div class="es-container">
    <div class="toolbar">
      <GrowthControl bind:upTo dark />
      <ul class="sky-legend">
        {#each KIND_ORDER as k}
          <li>
            <button type="button" aria-pressed={active.has(k)} onclick={() => toggle(k)}>
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                {#if k === 'action'}
                  <circle r="3.4" fill={KINDS[k].darkColor} /><circle r="1.5" fill="#fff" />
                {:else if k === 'question'}
                  <circle r="3.6" fill="none" stroke={KINDS[k].darkColor} stroke-width="1.6" />
                {:else if k === 'concern'}
                  <path d="M0 -4.5 L4 3 L-4 3 Z" fill={KINDS[k].darkColor} />
                {:else}
                  <path d="M0 -6 Q 1 -1 6 0 Q 1 1 0 6 Q -1 1 -6 0 Q -1 -1 0 -6 Z" fill={KINDS[k].darkColor} />
                {/if}
              </svg>
              {KINDS[k].plural} <span class="n">{counts[k]}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>

    <div class="sky" onpointerleave={leave} role="region" aria-label="Constellation map">
      <svg viewBox="0 0 {W} {H}" role="group" aria-label="Fourteen Thinkies drawn as constellations; each session adds an orbit.">
        <defs>
          <radialGradient id="nebula" cx="0.45" cy="0.5" r="0.7">
            <stop offset="0" stop-color="#2a2150" />
            <stop offset="1" stop-color="#14142a" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#nebula)" />
        {#each dust as d}
          <circle cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o} />
        {/each}

        <g class="bridges">
          {#each bridges as b}
            <path d={b.d} />
          {/each}
        </g>

        {#each placed as p (p.thinkie.name)}
          <g class="slot" class:dim={selected && selected !== p.thinkie.name}>
            <Constellation thinkie={p.thinkie} cx={p.cx} cy={p.cy} R={p.R} {included} {active} highlight={hot} onhover={hover} onleave={leave} labelSize={0} />
            <g
              class="star-label"
              role="button"
              tabindex="0"
              aria-pressed={selected === p.thinkie.name}
              aria-label="{p.thinkie.name}. Show details."
              onclick={() => select(p.thinkie.name)}
              onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(p.thinkie.name))}
            >
              <rect x={p.cx - 80} y={p.cy + p.R + 4} width="160" height="26" rx="13" />
              <text x={p.cx} y={p.cy + p.R + 21}>{p.thinkie.name}</text>
            </g>
          </g>
        {/each}

        <g class="comets">
          {#each bridges as b, i (b.id)}
            <defs>
              <linearGradient id={b.id} gradientUnits="userSpaceOnUse" x1={b.head.x} y1={b.head.y} x2={b.end.x} y2={b.end.y}>
                <stop offset="0" stop-color="#fff4cf" stop-opacity="0.95" />
                <stop offset="0.35" stop-color="#e2b33c" stop-opacity="0.6" />
                <stop offset="1" stop-color="#e2b33c" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g
              class="comet"
              role="presentation"
              onpointerenter={(e) => (tip = { x: e.clientX, y: e.clientY, title: `${b.link.from} → ${b.link.to}`, text: `“${b.link.note.text}”`, meta: 'A sticky that reached for another Thinkie' })}
              onpointerleave={leave}
            >
              <path d={b.halo} fill="url(#{b.id})" opacity="0.35" />
              <path d={b.core} fill="url(#{b.id})" />
              <circle cx={b.head.x} cy={b.head.y} r="7" class="coma" style="animation-delay: {-i * 0.6}s" />
              <circle cx={b.head.x} cy={b.head.y} r="2.6" fill="#fffaf0" />
              <circle cx={b.head.x} cy={b.head.y} r="14" fill="transparent" />
            </g>
          {/each}
        </g>
      </svg>
    </div>

    <div class="compass">
      <svg width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
        <circle r="44" fill="none" stroke="rgba(241,238,251,0.2)" stroke-dasharray="1 4" />
        <line x1="-48" y1="0" x2="48" y2="0" stroke="rgba(241,238,251,0.18)" />
        <line x1="0" y1="-48" x2="0" y2="48" stroke="rgba(241,238,251,0.18)" />
        <text x="26" y="-26" fill={KINDS.question.darkColor}>Q</text>
        <text x="-26" y="-26" fill={KINDS.reframe.darkColor}>R</text>
        <text x="-26" y="32" fill={KINDS.concern.darkColor}>C</text>
        <text x="26" y="32" fill={KINDS.action.darkColor}>A</text>
        <path d="M0 -6 Q 1 -1 6 0 Q 1 1 0 6 Q -1 1 -6 0 Q -1 -1 0 -6 Z" fill="#fbf8ff" />
      </svg>
      <p>
        <strong>How to read a constellation.</strong> The centre is the Thinkie. Each dotted orbit is one session
        (inner = earliest). Questions sit top-right, reframes top-left, concerns bottom-left and actions bottom-right —
        the same corners they pull toward in the <a href="{base}/idea-garden/field/">Cynefin field</a>. Comets fly from a
        Thinkie toward another one whenever a sticky names it. Hover a star to read it; click a name to open it.
      </p>
    </div>
  </div>
</section>

{#if sel}
  <section id="star-detail" class="es-container detail">
    <div class="detail-grid">
      <div class="big-sky">
        <svg viewBox="-170 -170 340 360" role="img" aria-label="{sel.thinkie.name} constellation, enlarged">
          <rect x="-170" y="-170" width="340" height="360" rx="20" fill="#14142a" />
          <Constellation thinkie={sel.thinkie} R={140} {included} {active} highlight={hot} onhover={hover} onleave={leave} labelSize={14} starScale={1.35} />
        </svg>
      </div>
      <div>
        <div class="detail-head">
          <img src="{base}/{sel.thinkie.image}" alt="" />
          <div>
            <p class="eyebrow">Constellation</p>
            <h2>{sel.thinkie.name}</h2>
            <ol class="sessions">
              {#each sel.thinkie.sessions as s, i}
                <li class:pending={!included.has(s.event)}>
                  <span class="orbit-n">orbit {i + 1}</span>
                  <span class="pill">{EVENTS.find((e) => e.id === s.event).label}</span>
                  {s.problem.title}
                </li>
              {/each}
            </ol>
            <button type="button" class="close" onclick={() => (selected = null)}>Close</button>
          </div>
        </div>
        <NoteList notes={selNotes} {active} highlight={hot} compact />
      </div>
    </div>
  </section>
{/if}

<Tooltip {tip} />

<style>
  .ig-hero {
    padding-top: clamp(2.5rem, 6vw, 4.5rem);
    padding-bottom: 2rem;
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
  .sky-wrap {
    background: #0f0f22;
    padding: 1.5rem 0 2rem;
    color: #f1eefb;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .sky-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .sky-legend button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: #f1eefb;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 0.3rem 0.8rem 0.3rem 0.5rem;
    cursor: pointer;
  }
  .sky-legend button[aria-pressed='false'] {
    opacity: 0.4;
  }
  .sky-legend .n {
    color: rgba(241, 238, 251, 0.6);
    font-variant-numeric: tabular-nums;
  }
  .sky {
    overflow-x: auto;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .sky svg {
    display: block;
    width: 100%;
    min-width: 900px;
    height: auto;
  }
  .bridges path {
    fill: none;
    stroke: #e2b33c;
    stroke-width: 1.3;
    stroke-dasharray: 0.1 6;
    stroke-linecap: round;
    opacity: 0.7;
  }
  .comet {
    cursor: help;
  }
  .coma {
    fill: #f6d77a;
    opacity: 0.28;
    animation: twinkle 3.2s ease-in-out infinite;
  }
  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.18;
    }
    50% {
      opacity: 0.42;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .coma {
      animation: none;
    }
  }
  .slot {
    transition: opacity 0.3s;
  }
  .slot.dim {
    opacity: 0.25;
  }
  .star-label {
    cursor: pointer;
    outline: none;
  }
  .star-label rect {
    fill: transparent;
  }
  .star-label:hover rect,
  .star-label:focus-visible rect,
  .star-label[aria-pressed='true'] rect {
    fill: rgba(241, 238, 251, 0.12);
  }
  .star-label:focus-visible rect {
    stroke: #f1eefb;
  }
  .star-label text {
    text-anchor: middle;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    fill: rgba(241, 238, 251, 0.85);
  }
  .compass {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    margin-top: 1.25rem;
    max-width: 52rem;
  }
  .compass svg {
    flex: none;
  }
  .compass text {
    font-size: 13px;
    font-weight: 800;
    text-anchor: middle;
  }
  .compass p {
    font-size: 0.88rem;
    color: rgba(241, 238, 251, 0.75);
    margin: 0;
  }
  .compass a {
    color: #e2b33c;
    font-weight: 700;
  }
  .detail {
    margin-top: 2.5rem;
    scroll-margin-top: 5rem;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 26rem) 1fr;
    gap: 2rem;
    align-items: start;
  }
  .big-sky {
    position: sticky;
    top: 5rem;
  }
  .big-sky svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .detail-head {
    display: grid;
    grid-template-columns: 6rem 1fr;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .detail-head img {
    width: 100%;
    border-radius: 10px;
    box-shadow: var(--shadow-sm);
  }
  h2 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 2rem;
    margin: 0 0 0.5rem;
  }
  .sessions {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
    display: grid;
    gap: 0.35rem;
    font-size: 0.9rem;
  }
  .sessions li.pending {
    opacity: 0.4;
  }
  .orbit-n {
    font-size: 0.7rem;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    margin-right: 0.25rem;
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
  @media (max-width: 860px) {
    .detail-grid {
      grid-template-columns: 1fr;
    }
    .big-sky {
      position: static;
      max-width: 26rem;
    }
  }
</style>
