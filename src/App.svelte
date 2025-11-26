<script>
  import { onMount } from 'svelte';

  let thinkies = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      console.log('Fetching data...');
      const response = await fetch('/data/twc1_data.json');
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data loaded:', data);
      thinkies = data.thinkies;
      console.log('Thinkies:', thinkies);
      loading = false;
    } catch (e) {
      console.error('Error loading data:', e);
      error = e.message;
      loading = false;
    }
  });
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-base-200 via-base-100 to-base-200">
  <main class="flex-grow">
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Thinkies World Conference I
        </h1>
        <p class="text-lg opacity-70">Explore thinking tools for software development</p>
      </div>

      {#if loading}
        <div class="flex justify-center items-center py-20">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="ml-4 text-lg">Loading thinkies...</p>
        </div>
      {:else if error}
        <div class="alert alert-error shadow-lg max-w-2xl mx-auto">
          <p>Error loading data: {error}</p>
        </div>
      {:else if thinkies.length === 0}
        <div class="alert alert-warning shadow-lg max-w-2xl mx-auto">
          <p>No thinkies found!</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {#each thinkies as thinkie}
            <div class="hover-3d">
              <figure class="w-48 rounded-2xl">
                <img
                  src="/assets/images/{thinkie.card_image}"
                  alt={thinkie.title}
                  class="rounded-2xl shadow-lg"
                />
              </figure>
              <!-- 8 empty divs needed for the 3D effect -->
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>

  <footer class="bg-base-300 mt-auto">
    <div class="container mx-auto px-4 py-8 text-center">
      <p class="text-sm opacity-80">
        Thinkies were created by Kent Beck, check them out:
        <a
          href="https://tidyfirst.substack.com/s/thinkies"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-primary font-semibold"
        >
          https://tidyfirst.substack.com/s/thinkies
        </a>
      </p>
    </div>
  </footer>
</div>

