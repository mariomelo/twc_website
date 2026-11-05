<!--
  The one glyph vocabulary shared by every Idea Garden view, so a reader who
  learns it once can read all four proposals:

    action   → leaf    (almond)
    question → bud     (closed round bud on a short neck)
    concern  → thorn   (sharp triangle)
    reframe  → flower  (five petals)

  Drawn centred on (x, y), pointing "up" (angle 0), sized by `size` (≈ px).
  Shape carries the kind as well as colour, so it survives greyscale and CVD.
-->
<script>
  import { KINDS } from '$lib/data/idea-garden.js';

  let {
    kind,
    x = 0,
    y = 0,
    size = 10,
    angle = 0,
    fill = undefined,
    stroke = 'none',
    strokeWidth = 0,
    opacity = 1,
    ...rest
  } = $props();

  const color = $derived(fill ?? KINDS[kind]?.color ?? '#888');
  const s = $derived(size / 10);
</script>

<g transform="translate({x} {y}) rotate({angle}) scale({s})" {opacity} {...rest}>
  {#if kind === 'action'}
    <path d="M0 5 C -4.2 1.5 -4.2 -2.5 0 -6 C 4.2 -2.5 4.2 1.5 0 5 Z" fill={color} {stroke} stroke-width={strokeWidth / s} />
    <path d="M0 4 L0 -4.2" stroke="rgba(255,255,255,0.55)" stroke-width={0.7} fill="none" />
  {:else if kind === 'question'}
    <path d="M0 5 L0 1.5" stroke={color} stroke-width={1.4} fill="none" stroke-linecap="round" />
    <circle cx="0" cy="-1.6" r="3.6" fill={color} {stroke} stroke-width={strokeWidth / s} />
    <circle cx="-1.1" cy="-2.7" r="1" fill="rgba(255,255,255,0.45)" />
  {:else if kind === 'concern'}
    <path d="M-3.4 4.6 L0 -5.6 L3.4 4.6 Z" fill={color} stroke={stroke === 'none' ? color : stroke} stroke-width={strokeWidth ? strokeWidth / s : 0.6} stroke-linejoin="round" />
  {:else if kind === 'reframe'}
    {#each [0, 72, 144, 216, 288] as a}
      <ellipse cx="0" cy="-2.9" rx="1.9" ry="2.9" transform="rotate({a})" fill={color} {stroke} stroke-width={strokeWidth / s} />
    {/each}
    <circle cx="0" cy="0" r="1.5" fill="#fff6d6" />
  {/if}
</g>
