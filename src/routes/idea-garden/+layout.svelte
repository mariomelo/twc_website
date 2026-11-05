<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  let { children } = $props();

  const proposals = [
    { href: '/idea-garden/garden/', n: '1', label: 'Thinkie Garden' },
    { href: '/idea-garden/constellations/', n: '2', label: 'Constellations' },
    { href: '/idea-garden/specimens/', n: '3', label: 'Problem Specimens' },
    { href: '/idea-garden/field/', n: '4', label: 'Cynefin Field' }
  ];

  const current = $derived($page.url.pathname.replace(base, ''));
</script>

<svelte:head>
  <!-- Exploratory drafts: reachable by URL, kept out of search engines. -->
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="es-page ig-page">
  <nav class="es-nav">
    <div class="es-container">
      <a href="{base}/idea-garden/" class="brand">Idea Garden <span class="ig-draft">draft</span></a>
      <ul class="ig-nav-links">
        {#each proposals as p}
          <li>
            <a href="{base}{p.href}" aria-current={current === p.href ? 'page' : undefined}>
              <span class="ig-n">{p.n}</span><span class="ig-l">{p.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>

  {@render children()}

  <footer class="ig-footer">
    <div class="es-container">
      <p>
        Exploratory proposals built from the real boards of
        <a href="{base}/conferences/twc-1/">TWC 1</a> and <a href="{base}/conferences/twc-2/">TWC 2</a>. Every sticky is classified by hand; the
        classification lives in <code>src/lib/data/idea-garden.js</code> and can be argued with.
      </p>
    </div>
  </footer>
</div>

<style>
  .ig-page {
    --ig-paper: #fbfaf6;
    --ig-ink: #2b2a33;
    --ig-soil: #6b4f3a;
    --ig-stem: #3f6b4a;
    background: var(--ig-paper);
    min-height: 100vh;
  }
  .ig-draft {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--coral-deep);
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 0.05rem 0.45rem;
    margin-left: 0.35rem;
    vertical-align: 0.2em;
  }
  .ig-nav-links {
    display: flex;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-x: auto;
  }
  .ig-nav-links a {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    white-space: nowrap;
  }
  .ig-nav-links a:hover {
    color: var(--purple);
  }
  .ig-nav-links a[aria-current='page'] {
    background: var(--purple-soft);
    color: var(--purple);
  }
  .ig-n {
    display: inline-grid;
    place-items: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--border);
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--fg);
  }
  [aria-current='page'] .ig-n {
    background: var(--purple);
    color: #fff;
  }
  @media (max-width: 760px) {
    .ig-l {
      display: none;
    }
  }
  .ig-footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0 3rem;
    margin-top: 4rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .ig-footer a {
    color: var(--purple);
    font-weight: 700;
  }
  .ig-footer code {
    font-size: 0.8em;
    background: var(--purple-soft);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
</style>
