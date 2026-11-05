<script>
  import { base } from '$app/paths';
  import { garden, KINDS, KIND_ORDER, countsByEvent, totals } from '$lib/data/idea-garden.js';
  import KindMark from '$lib/components/idea-garden/KindMark.svelte';
  import Constellation from '$lib/components/idea-garden/Constellation.svelte';
  import Specimen from '$lib/components/idea-garden/Specimen.svelte';

  const all = totals();
  const byEvent = countsByEvent();
  const allEvents = new Set(['twc-1', 'twc-2']);
  const allKinds = new Set(KIND_ORDER);
  const hard = garden.thinkies.find((t) => t.name === 'Hard Problem');
  const haunted = garden.problems.find((p) => p.slug === 'obviously-feature-x');
  const pct = (c, k) => Math.round((100 * c[k]) / c.total);

  const proposals = [
    {
      n: 1,
      href: '/idea-garden/garden/',
      title: 'Thinkie Garden',
      stance: 'A Thinkie is a plant that grows a little every time it is used.',
      best: 'Seeing at a glance which Thinkies the community keeps returning to, and what each one tends to produce.',
      risk: 'Fourteen plants is comfortable; forty would need a second bed or a scroll.'
    },
    {
      n: 2,
      href: '/idea-garden/constellations/',
      title: 'Constellations',
      stance: 'A Thinkie is a constellation; each session adds an orbit.',
      best: 'The “expands with every discussion” story, and comparing the shape of what each Thinkie draws out.',
      risk: 'Beautiful but abstract; the quarter-of-the-sky convention has to be learned.'
    },
    {
      n: 3,
      href: '/idea-garden/specimens/',
      title: 'Problem Specimens',
      stance: 'A challenge is a plant; concerns are its roots, Thinkies make it grow.',
      best: 'Staying with the stuck: a problem with deep roots and no flowers looks different from one in bloom.',
      risk: 'Each TWC challenge met one Thinkie, so stems rarely branch yet. This fits Exploring Stuckness vignettes best.'
    },
    {
      n: 4,
      href: '/idea-garden/field/',
      title: 'Cynefin Field',
      stance: 'The mix of stickies says what kind of stuck it was.',
      best: 'Comparing many challenges at once, and asking why some got moves and others got new questions.',
      risk: 'A derived reading. It needs its method visible so nobody takes the position as a verdict.'
    }
  ];
</script>

<svelte:head>
  <title>Idea Garden · Four proposals</title>
  <meta name="description" content="Exploratory visualisations of the stickies from the Thinkies Workshop Conferences." />
</svelte:head>

<header class="ig-intro es-container">
  <p class="eyebrow">Idea Garden · four proposals</p>
  <h1>A garden for <span class="hl hl-green">what the community noticed</span>, not an archive of answers.</h1>
  <p class="lede">
    Two Thinkies Workshop Conferences left behind {all.total + all.fragment} stickies across {garden.problems.length}
    challenges and {garden.thinkies.length} Thinkies. These four sketches turn the same real boards into four
    different gardens, so we can choose which way of seeing is worth growing.
  </p>
</header>

<section class="es-container vocab">
  <div>
    <h2>One vocabulary for every view</h2>
    <p>
      Every sticky was read by hand and given one of four kinds, using the same rules for both conferences. Each kind
      keeps its colour and its shape everywhere, so once you learn it, you can read all four proposals.
    </p>
  </div>
  <ul class="kinds">
    {#each KIND_ORDER as k}
      <li>
        <svg width="40" height="40" viewBox="-20 -20 40 40" aria-hidden="true"><KindMark kind={k} size={26} /></svg>
        <div>
          <strong>{KINDS[k].plural}</strong> <em>· {KINDS[k].metaphors}</em>
          <span>{KINDS[k].blurb}</span>
        </div>
        <span class="num">{all[k]}</span>
      </li>
    {/each}
  </ul>
  <div class="events">
    {#each byEvent as e}
      <div class="event">
        <span class="ev-label">{e.label}</span>
        <span class="ev-bar" aria-label={KIND_ORDER.map((k) => `${KINDS[k].plural} ${pct(e.counts, k)}%`).join(', ')}>
          {#each KIND_ORDER as k}
            <span style="flex: {e.counts[k]}; background: {KINDS[k].color}"></span>
          {/each}
        </span>
        <span class="ev-total">{e.counts.total}</span>
      </div>
    {/each}
    <p class="note">
      TWC 2 leaned harder into actions ({pct(byEvent[1].counts, 'action')}% vs {pct(byEvent[0].counts, 'action')}%) while
      TWC 1 asked more questions ({pct(byEvent[0].counts, 'question')}% vs {pct(byEvent[1].counts, 'question')}%).
      Fragments like “$$$” or copied prompts ({all.fragment}) are kept in the data but not drawn.
    </p>
  </div>
</section>

<section class="es-container">
  <ol class="ig-cards">
    {#each proposals as p}
      <li class="ig-card">
        <a href="{base}{p.href}" class="preview" class:dark={p.n === 2} aria-label="Open proposal {p.n}: {p.title}">
          {#if p.n === 1}
            <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="240" height="150" fill="#f4f7ef" />
              <rect y="122" width="240" height="28" fill="#7a5c43" />
              {#each [[60, 62, 0], [120, 92, 1], [180, 48, 2]] as [x, h, i]}
                <path d="M{x} 122 q {4 - i * 3} {-h / 2} 0 {-h}" stroke="#3f8f55" stroke-width="2" fill="none" />
                {#each Array(Math.floor(h / 9)) as _, j}
                  {@const k = ['action', 'action', 'question', 'action', 'reframe', 'concern', 'action'][(j + i) % 7]}
                  <KindMark kind={k} x={x + (j % 2 ? 9 : -9)} y={118 - j * 9} size={9} angle={j % 2 ? 55 : -55} />
                {/each}
              {/each}
            </svg>
          {:else if p.n === 2}
            <svg viewBox="-125 -80 250 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect x="-200" y="-150" width="400" height="300" fill="#14142a" />
              <Constellation thinkie={hard} R={72} included={allEvents} active={allKinds} labelSize={0} />
            </svg>
          {:else if p.n === 3}
            <svg viewBox="0 20 240 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect x="-100" y="-50" width="440" height="340" fill="#fffdf7" />
              <Specimen problem={haunted} active={allKinds} />
            </svg>
          {:else}
            <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="240" height="150" fill="#fff" />
              <rect x="6" y="6" width="114" height="69" fill="#f6f2fd" />
              <rect x="120" y="6" width="114" height="69" fill="#f2f0fb" />
              <rect x="6" y="75" width="114" height="69" fill="#fdf2f3" />
              <rect x="120" y="75" width="114" height="69" fill="#effaf6" />
              {#each garden.problems.filter((q) => q.counts.total) as q}
                {@const x = 120 + Math.tanh(q.cynefin.x / 1.2) * 100}
                {@const y = 75 - Math.tanh(q.cynefin.y / 1.2) * 58}
                <circle cx={x} cy={y} r="4.5" fill="#fff" stroke="#cfc6e4" />
                {#each [['question', -45], ['reframe', -135], ['concern', 135], ['action', 45]] as [k, a]}
                  {@const r = 1 + 3.5 * Math.sqrt(q.counts[k] / q.counts.total)}
                  <line x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * r} y2={y + Math.sin((a * Math.PI) / 180) * r} stroke={KINDS[k].color} stroke-width="2" stroke-linecap="round" />
                {/each}
              {/each}
            </svg>
          {/if}
        </a>
        <div class="body">
          <p class="eyebrow">Proposal {p.n}</p>
          <h3><a href="{base}{p.href}">{p.title}</a></h3>
          <p class="stance">{p.stance}</p>
          <dl>
            <dt>Best at</dt>
            <dd>{p.best}</dd>
            <dt>Watch out</dt>
            <dd>{p.risk}</dd>
          </dl>
        </div>
      </li>
    {/each}
  </ol>
</section>

<section class="es-container notes">
  <h2>What carried over from the earlier experiments</h2>
  <ul>
    <li>
      <strong>Classifying stickies</strong> is kept, but done by reading every sticky rather than with keyword rules, and
      stored as data that anyone can edit and argue with.
    </li>
    <li>
      <strong>Cynefin as a lens, not a verdict</strong> is kept, but now it is computed from the real boards, with the
      formula on the page.
    </li>
    <li>
      <strong>The star diagram</strong> became a constellation whose geometry means something: orbits are sessions and
      quarters are kinds.
    </li>
    <li>
      <strong>Plants</strong> are drawn from the data, sticky by sticky, instead of being decoration.
    </li>
    <li>
      <strong>Dropped:</strong> the invented workshop records in the earlier mock data and the “load your own JSON” tool.
      Exploring Stuckness vignettes can join once their boards are exported.
    </li>
  </ul>
</section>

<style>
  .ig-intro {
    padding-top: clamp(3rem, 7vw, 5rem);
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
    font-size: clamp(2.1rem, 5.2vw, 3.6rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0 0 1.1rem;
    max-width: 56rem;
  }
  .lede {
    max-width: 44rem;
    font-size: 1.12rem;
    color: var(--fg-soft);
    margin: 0;
  }
  h2 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 1.6rem;
    margin: 0 0 0.5rem;
  }
  .vocab {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 1.5rem 3rem;
    padding-top: 2rem;
    padding-bottom: 3rem;
  }
  .vocab > div:first-child p {
    color: var(--fg-soft);
    margin: 0;
  }
  .kinds {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
  }
  .kinds li {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 0.75rem;
    align-items: center;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.5rem 0.9rem 0.5rem 0.5rem;
  }
  .kinds em {
    color: var(--muted);
  }
  .kinds span {
    display: block;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .kinds .num {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--fg);
    font-variant-numeric: tabular-nums;
  }
  .events {
    grid-column: 1 / -1;
    display: grid;
    gap: 0.5rem;
  }
  .event {
    display: grid;
    grid-template-columns: 4rem 1fr 3rem;
    gap: 0.75rem;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .ev-bar {
    display: flex;
    gap: 2px;
    height: 12px;
  }
  .ev-bar span {
    border-radius: 3px;
  }
  .ev-total {
    text-align: right;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .note {
    font-size: 0.85rem;
    color: var(--muted);
    margin: 0.25rem 0 0;
  }
  .ig-cards {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
  .ig-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ig-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
  .preview {
    display: block;
    border-bottom: 1px solid var(--border);
  }
  .preview svg {
    display: block;
    width: 100%;
    height: 220px;
  }
  .body {
    padding: 1.25rem 1.5rem 1.5rem;
  }
  h3 {
    font-family: 'Iowan Old Style', Charter, Georgia, serif;
    font-size: 1.5rem;
    margin: 0 0 0.4rem;
  }
  h3 a {
    color: var(--fg);
    text-decoration: none;
  }
  h3 a:hover {
    color: var(--purple);
  }
  .stance {
    font-size: 1rem;
    color: var(--fg-soft);
    margin: 0 0 0.9rem;
  }
  dl {
    display: grid;
    grid-template-columns: 6rem 1fr;
    gap: 0.4rem 0.75rem;
    margin: 0;
    font-size: 0.88rem;
  }
  dt {
    font-weight: 700;
    color: var(--muted);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-top: 0.15rem;
  }
  dd {
    margin: 0;
    color: var(--fg-soft);
  }
  .notes {
    margin-top: 3.5rem;
  }
  .notes ul {
    max-width: 50rem;
    color: var(--fg-soft);
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }
  @media (max-width: 820px) {
    .vocab,
    .ig-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
