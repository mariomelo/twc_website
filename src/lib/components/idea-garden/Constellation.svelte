<!--
  One Thinkie as a constellation. The Thinkie is the bright centre; every
  session it was used in adds an orbit further out, so the constellation
  literally expands with each discussion. Each kind of sticky has its own
  quarter of the sky, the same quarter it pulls toward on the Cynefin field:

      reframes  ↖   ↗  questions
      concerns  ↙   ↘  actions

  Stars of the same kind from the same session are joined, which is what makes
  the figure read as a constellation rather than a scatter.
-->
<script>
  import { KINDS, rand } from '$lib/data/idea-garden.js';

  let {
    thinkie,
    cx = 0,
    cy = 0,
    R = 100,
    included,
    active,
    labelSize = 13,
    starScale = 1,
    highlight = null,
    onhover = () => {},
    onleave = () => {}
  } = $props();

  const SECTOR = { question: -45, action: 45, concern: 135, reframe: -135 };
  const HALF = 37; // degrees either side of the sector's centre
  const R0 = 0.16; // inner radius, as a share of R, kept clear for the centre star

  const layout = $derived.by(() => {
    const all = thinkie.sessions;
    const band = (1 - R0) / Math.max(1, all.length);
    const rings = [];
    const stars = [];
    const lines = [];
    all.forEach((s, i) => {
      const r1 = R * (R0 + band * i);
      const r2 = R * (R0 + band * (i + 1));
      const shown = included.has(s.event);
      rings.push({ r: r2, event: s.event, shown, session: s });
      if (!shown) return;
      for (const kind of Object.keys(SECTOR)) {
        const cell = s.notes.filter((n) => n.kind === kind);
        const pts = cell.map((n, k) => {
          const u = (k + 0.5) / cell.length;
          const a = ((SECTOR[kind] - HALF + 2 * HALF * u + (rand(n.id) - 0.5) * 6) * Math.PI) / 180;
          const r = r1 + (r2 - r1) * (0.18 + 0.64 * rand(n.id + 'r'));
          return { note: n, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
        });
        stars.push(...pts);
        if (pts.length > 1) lines.push({ kind, d: 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L') });
      }
    });
    return { rings, stars, lines };
  });

  const size = (n) => (2.6 + (n.weight > 1 ? 1.4 : 0)) * starScale;
</script>

<g class="constellation">
  {#each layout.rings as ring}
    <circle {cx} {cy} r={ring.r} class="orbit" class:pending={!ring.shown} />
  {/each}

  {#each layout.lines as l}
    <path d={l.d} class="figure" stroke={KINDS[l.kind].darkColor} opacity={active.has(l.kind) ? 0.55 : 0.06} />
  {/each}

  {#each layout.stars as st (st.note.id)}
    {@const k = st.note.kind}
    {@const c = KINDS[k].darkColor}
    {@const on = active.has(k)}
    {@const s = size(st.note)}
    <g
      class="star"
      class:off={!on}
      class:hot={highlight === st.note.id}
      transform="translate({st.x} {st.y})"
      role="presentation"
      onpointerenter={(e) => on && onhover(e, st.note)}
      onpointerleave={onleave}
    >
      <circle r={s * 3.2} fill={c} opacity="0.16" class="glow" />
      {#if k === 'action'}
        <circle r={s} fill={c} />
        <circle r={s * 0.45} fill="#fff" opacity="0.85" />
      {:else if k === 'question'}
        <circle r={s * 1.05} fill="#14142a" stroke={c} stroke-width={1.3 * starScale} />
      {:else if k === 'concern'}
        <path d="M0 {-s * 1.35} L {s * 1.2} {s * 0.85} L {-s * 1.2} {s * 0.85} Z" fill={c} />
      {:else}
        <path
          d="M0 {-s * 1.9} Q {s * 0.28} {-s * 0.28} {s * 1.9} 0 Q {s * 0.28} {s * 0.28} 0 {s * 1.9} Q {-s * 0.28} {s * 0.28} {-s * 1.9} 0 Q {-s * 0.28} {-s * 0.28} 0 {-s * 1.9} Z"
          fill={c}
        />
        <circle r={s * 0.35} fill="#fff" />
      {/if}
      <circle r="8" fill="transparent" />
    </g>
  {/each}

  <!-- the Thinkie itself -->
  <g transform="translate({cx} {cy})" class="core">
    <circle r={R * 0.1} fill="#f6f1ff" opacity="0.12" />
    <path d="M0 -9 Q 1.4 -1.4 9 0 Q 1.4 1.4 0 9 Q -1.4 1.4 -9 0 Q -1.4 -1.4 0 -9 Z" fill="#fbf8ff" />
  </g>

  {#if labelSize}
    <text x={cx} y={cy + R + labelSize + 6} class="name" font-size={labelSize}>{thinkie.name}</text>
  {/if}
</g>

<style>
  .orbit {
    fill: none;
    stroke: rgba(241, 238, 251, 0.24);
    stroke-width: 1;
    stroke-dasharray: 1 4;
    transition: opacity 0.3s;
  }
  .orbit.pending {
    stroke: rgba(241, 238, 251, 0.05);
  }
  .figure {
    fill: none;
    stroke-width: 0.8;
    transition: opacity 0.2s;
  }
  .star {
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .star.off {
    opacity: 0.1;
  }
  .star.hot .glow {
    opacity: 0.6;
  }
  .name {
    text-anchor: middle;
    fill: rgba(241, 238, 251, 0.82);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
