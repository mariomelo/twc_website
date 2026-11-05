<!--
  A small bee, drawn facing +x and centred on (x, y). `angle` is the flight
  direction in degrees; when flying leftwards the bee is mirrored rather than
  turned upside down, so its wings always stay on top. Wings flutter and the
  body bobs unless the reader prefers reduced motion.
-->
<script>
  let { x = 0, y = 0, angle = 0, size = 1, delay = 0, still = false } = $props();

  const leftwards = $derived(Math.cos((angle * Math.PI) / 180) < 0);
  // Stripe heights follow the body's ellipse (rx 6.5, ry 4.2).
  const band = (bx) => 4.2 * Math.sqrt(Math.max(0, 1 - (bx / 6.5) ** 2));
</script>

<g transform="translate({x} {y}) rotate({angle}) scale({size} {leftwards ? -size : size})">
  <g class="bob" class:still style="animation-delay: {delay}s">
    <g class="wings" class:still style="animation-delay: {delay}s">
      <ellipse cx="-1.2" cy="-4.6" rx="4.6" ry="2.9" transform="rotate(-24 -1.2 -4.6)" class="wing" />
      <ellipse cx="2.2" cy="-4.4" rx="3.6" ry="2.3" transform="rotate(-8 2.2 -4.4)" class="wing" />
    </g>
    <path d="M-6.2 0 L-9.2 0" class="stinger" />
    <ellipse cx="0" cy="0" rx="6.5" ry="4.2" class="body" />
    {#each [-2.6, 0.9] as bx}
      <rect x={bx - 0.85} y={-band(bx)} width="1.7" height={band(bx) * 2} rx="0.8" class="stripe" />
    {/each}
    <circle cx="6.9" cy="-0.3" r="2.9" class="head" />
    <path d="M8.2 -2.4 q 1.6 -2.4 3.4 -2.6 M7.4 -2.8 q 0.6 -2.8 2.4 -3.8" class="antenna" />
  </g>
</g>

<style>
  .body {
    fill: #f2c230;
    stroke: #3b2a14;
    stroke-width: 0.7;
  }
  .stripe,
  .head {
    fill: #3b2a14;
  }
  .stinger,
  .antenna {
    fill: none;
    stroke: #3b2a14;
    stroke-width: 0.8;
    stroke-linecap: round;
  }
  .wing {
    fill: rgba(255, 255, 255, 0.82);
    stroke: rgba(59, 42, 20, 0.45);
    stroke-width: 0.5;
  }
  .wings {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: flutter 0.16s ease-in-out infinite alternate;
  }
  .bob {
    animation: bob 2.4s ease-in-out infinite;
  }
  .still {
    animation: none;
  }
  @keyframes flutter {
    to {
      transform: scaleY(0.35);
    }
  }
  @keyframes bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1.6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .wings,
    .bob {
      animation: none;
    }
  }
</style>
