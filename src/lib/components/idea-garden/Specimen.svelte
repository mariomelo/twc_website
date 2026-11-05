<!--
  A challenge pressed like a herbarium specimen. The problem is the plant:

    roots   = concerns   — what holds the problem in place, below the soil line
    stems   = sessions   — one per time a table worked on it (with its Thinkie)
    leaves  = actions    — along the stem
    buds    = questions  — on short twigs, not yet open
    flowers = reframes   — the crown, where the problem is seen differently

  Pure SVG <g>; the caller supplies the <svg> and the viewBox (0 0 240 262).
-->
<script>
  import { KINDS, rand } from '$lib/data/idea-garden.js';
  import KindMark from './KindMark.svelte';

  let { problem, active, highlight = null, onhover = () => {}, onleave = () => {} } = $props();

  const GROUND = 192;
  const CX = 120;
  const STEM_COLOR = { 'twc-1': '#7a5a3a', 'twc-2': '#3f8f55' };

  const shape = $derived.by(() => {
    const ss = problem.sessions;
    const stems = [];
    const glyphs = [];
    const roots = [];

    ss.forEach((s, si) => {
      const body = s.notes.filter((n) => n.kind === 'action' || n.kind === 'question');
      const crown = s.notes.filter((n) => n.kind === 'reframe');
      const spread = ss.length === 1 ? 0 : (si / (ss.length - 1) - 0.5) * 70;
      const len = Math.min(150, 30 + body.length * 6.4 + (crown.length ? 12 : 0));
      const seed = problem.slug + si;
      const lean = spread + (rand(seed) - 0.5) * 14;
      // Stem: cubic from the root collar, leaning out and curving back.
      const p0 = { x: CX, y: GROUND };
      const p1 = { x: CX + lean * 0.15, y: GROUND - len * 0.35 };
      const p2 = { x: CX + lean * 0.9, y: GROUND - len * 0.7 };
      const p3 = { x: CX + lean * 0.75, y: GROUND - len };
      const at = (t) => {
        const u = 1 - t;
        return {
          x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
          y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
        };
      };
      stems.push({
        d: `M${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`,
        color: STEM_COLOR[s.event],
        top: p3,
        session: s,
        tag: at(0.08)
      });

      body.forEach((n, k) => {
        const t = 0.16 + (0.78 * (k + 0.5 + (rand(n.id + 't') - 0.5) * 0.5)) / Math.max(1, body.length);
        const p = at(t);
        const side = (k + si) % 2 ? 1 : -1;
        const r = rand(n.id);
        const young = 1 - t;
        if (n.kind === 'action') {
          const reach = 9 + r * 6 + young * 5;
          glyphs.push({
            note: n,
            twig: null,
            x: p.x + side * reach,
            y: p.y - 4 - r * 3,
            angle: side * (50 + r * 25),
            size: 9 + young * 4 + (n.weight > 1 ? 2 : 0),
            from: p,
            color: STEM_COLOR[s.event]
          });
        } else {
          // Questions hang on a slim twig, a little further out.
          const tx = p.x + side * (17 + r * 8);
          const ty = p.y - 10 - r * 6;
          glyphs.push({
            note: n,
            twig: `M${p.x} ${p.y} Q ${p.x + side * 8} ${p.y - 2} ${tx} ${ty}`,
            x: tx,
            y: ty,
            angle: side * 25,
            size: 9 + (n.weight > 1 ? 2 : 0),
            color: STEM_COLOR[s.event]
          });
        }
      });

      crown.forEach((n, k) => {
        const m = crown.length;
        const a = ((m === 1 ? 0 : (k / (m - 1) - 0.5) * 150) * Math.PI) / 180;
        const ring = 9 + (k % 2) * 7 + Math.floor(k / 6) * 6;
        glyphs.push({
          note: n,
          twig: `M${p3.x} ${p3.y} L ${p3.x + Math.sin(a) * ring} ${p3.y - Math.cos(a) * ring}`,
          x: p3.x + Math.sin(a) * ring,
          y: p3.y - Math.cos(a) * ring,
          angle: 0,
          size: 9.5 + (n.weight > 1 ? 2 : 0),
          color: STEM_COLOR[s.event]
        });
      });
    });

    const concerns = problem.notes.filter((n) => n.kind === 'concern');
    concerns.forEach((n, k) => {
      const m = concerns.length;
      const a = ((m === 1 ? 0 : (k / (m - 1) - 0.5) * 140) * Math.PI) / 180;
      const len = 26 + rand(n.id) * 34 + (k % 3) * 6;
      const ex = CX + Math.sin(a) * len;
      const ey = GROUND + Math.cos(a) * len * 0.8;
      roots.push({
        note: n,
        d: `M${CX} ${GROUND} C ${CX + Math.sin(a) * 6} ${GROUND + 14}, ${ex - Math.sin(a) * 10} ${ey - 12}, ${ex} ${ey}`,
        x: ex,
        y: ey,
        angle: 180 - (a * 180) / Math.PI
      });
    });

    // A few unclassified hair roots so even a problem with no concerns is anchored.
    const hair = [-0.5, 0.15, 0.6].map((a, i) => {
      const len = 12 + i * 3;
      return `M${CX} ${GROUND} q ${Math.sin(a) * 4} 6 ${Math.sin(a) * len} ${Math.cos(a) * len}`;
    });

    return { stems, glyphs, roots, hair };
  });
</script>

<g class="specimen">
  <!-- soil line, drawn like a pencil rule on the sheet -->
  <path d="M30 {GROUND} Q 120 {GROUND - 2} 210 {GROUND}" class="soil" />

  {#each shape.hair as d}
    <path {d} class="hair" />
  {/each}

  {#each shape.roots as r (r.note.id)}
    {@const on = active.has('concern')}
    <g class:off={!on} class:hot={highlight === r.note.id} role="presentation" onpointerenter={(e) => on && onhover(e, r.note)} onpointerleave={onleave}>
      <path d={r.d} class="root" />
      <path d={r.d} class="hit" />
      <KindMark kind="concern" x={r.x} y={r.y} size={7} angle={r.angle} />
    </g>
  {/each}

  {#each shape.stems as st}
    <path d={st.d} stroke={st.color} class="stem" />
  {/each}

  {#each shape.glyphs as g (g.note.id)}
    {@const on = active.has(g.note.kind)}
    <g class="g" class:off={!on} class:hot={highlight === g.note.id} role="presentation" onpointerenter={(e) => on && onhover(e, g.note)} onpointerleave={onleave}>
      {#if g.twig}
        <path d={g.twig} stroke={g.color} class="twig" />
      {:else if g.from}
        <path d="M{g.from.x} {g.from.y} Q {(g.from.x + g.x) / 2} {g.from.y - 1} {g.x} {g.y}" stroke={g.color} class="twig" />
      {/if}
      <KindMark kind={g.note.kind} x={g.x} y={g.y} size={g.size} angle={g.angle} />
      <circle cx={g.x} cy={g.y} r="7" fill="transparent" />
    </g>
  {/each}

</g>

<style>
  .soil {
    fill: none;
    stroke: #8a6a4f;
    stroke-width: 1.2;
    stroke-linecap: round;
  }
  .hair {
    fill: none;
    stroke: #b8a58f;
    stroke-width: 0.8;
  }
  .root {
    fill: none;
    stroke: #9a7b5f;
    stroke-width: 1.2;
    stroke-linecap: round;
  }
  .hit {
    fill: none;
    stroke: transparent;
    stroke-width: 8;
  }
  .stem {
    fill: none;
    stroke-width: 2.4;
    stroke-linecap: round;
  }
  .twig {
    fill: none;
    stroke-width: 0.9;
    opacity: 0.85;
  }
  .g,
  .specimen > g {
    transition: opacity 0.2s;
  }
  .off {
    opacity: 0.12;
  }
  .hot :global(g) {
    filter: drop-shadow(0 0 3px rgba(26, 26, 46, 0.5));
  }
</style>
