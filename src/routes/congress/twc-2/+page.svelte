<script>
  import { base } from '$app/paths';
  function scrollToJoin(e) {
    e.preventDefault();
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<div class="min-h-screen flex flex-col bg-base-200">

  <!-- Hero Section -->
  <header class="twc2-hero py-24 px-4">
    <div class="text-center flex flex-col items-center max-w-3xl mx-auto">
      <p class="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">Virtual Unconference Event</p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white whitespace-nowrap">Thinkies World Congress II</h1>
      <p class="text-2xl font-semibold text-white/90 mb-3">A Creative Gathering for Unsticking Stuck Thinking</p>
      <p class="text-xl text-white/80 mb-8">May 20th, 2026</p>
      <a href="#join" on:click={scrollToJoin} class="btn-coral btn-coral-lg">Join the Event</a>
    </div>
  </header>

  <main class="flex-grow">

    <!-- About Section -->
    <section class="py-16 px-4 bg-base-100">
      <div class="container mx-auto max-w-3xl text-center">
        <p class="text-lg leading-relaxed mb-6">
          Thinkies are <strong>learnable pattern transformations</strong> you can use to shift how you see a situation,
          expand the space of options, and spark new ideas — especially when things feel stuck or prematurely decided.
          It's not about having the <em>right</em> idea, it's about generating <em>lots</em> of ideas — some of which
          might be brilliant.
        </p>
        <p class="text-lg leading-relaxed mb-6">
          Thinkies help you <strong>notice</strong> when a conversation or decision is falling into a predictable
          groove — and then offer you a way to step sideways, flip the frame, or open up new paths.
        </p>
        <p class="text-lg leading-relaxed">
          At the <strong>Thinkies World Congress</strong> virtual event, you won't just <em>learn</em> about
          Thinkies — you'll get <em>practice</em> with them.
        </p>
      </div>
    </section>

    <!-- Video Section -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold mb-4">See What It's All About</h2>
        <p class="text-lg text-neutral mb-8">
          Watch this short video to get a feel for what the Thinkies World Congress is — and why you should join.
        </p>
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/xx05TMxead0?start=3"
            title="What is the Thinkies World Congress?"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- What to Expect -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-4">What to Expect</h2>
        <p class="text-center max-w-2xl mx-auto mb-12 text-lg">
          A hands-on, virtual gathering designed for anyone who wants to strengthen their ability to think creatively
          and unstick stuck thinking — whether you're a software developer, engineering leader, or simply someone
          who cares about getting unstuck.
        </p>

        <h3 class="text-xl font-semibold text-center mb-8 text-neutral">Here's how the experience unfolds:</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card bg-base-100 shadow-lg hover:-translate-y-1 transition-transform">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-3">✨</div>
              <h3 class="card-title text-xl mb-2">Main Stage Kickoff</h3>
              <p>
                We'll start together with an introduction to Thinkies — what they are, how they work, and why they
                matter. You'll learn a few powerful transformations to try out.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-lg hover:-translate-y-1 transition-transform">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-3">🧩</div>
              <h3 class="card-title text-xl mb-2">Virtual Table Practice Sessions</h3>
              <p>
                Next, you'll join a virtual table where a facilitator will guide your group in applying a Thinkie
                to a sticky scenario and collaborating on generating fresh ideas.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-lg hover:-translate-y-1 transition-transform">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-3">🌱</div>
              <h3 class="card-title text-xl mb-2">The Idea Garden</h3>
              <p>
                Finally, we'll share our ideas in a virtual Idea Garden — an open discussion where you'll explore,
                reflect, and look for patterns. All ideas generated will be open source and available on thinkies.org.
              </p>
            </div>
          </div>
        </div>

        <!-- Inline CTA -->
        <div class="text-center mt-12">
          <p class="text-neutral mb-6">Ready to join? Grab your spot now.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="btn-coral btn-coral-lg">
              Join as Attendee
            </a>
            <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="btn-outline-purple btn-coral-lg">
              Join as Facilitator
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Panel Discussion -->
    <section class="py-16 px-4 bg-base-100">
      <div class="container mx-auto max-w-4xl">
        <p class="text-center max-w-2xl mx-auto mb-12 text-lg">
          We'll do 2 rounds of practice with applying Thinkies, then have a panel discussion on the keynote mainstage:
        </p>
        <div class="panel-quote text-center mb-12">
          <p class="text-2xl font-semibold italic text-primary">"Where does Creativity Come From?"</p>
          <p class="mt-3 text-neutral">Thought leaders from multiple perspectives sharing their take</p>
        </div>

        <!-- Panelists placeholder -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {#each ['Panelist A', 'Panelist B', 'Panelist C', 'Panelist D'] as panelist}
            <div class="card bg-base-200 border border-base-300">
              <div class="card-body flex-row items-center gap-4">
                <div class="avatar placeholder">
                  <div class="bg-base-300 text-base-content rounded-full w-14 h-14 flex items-center justify-center">
                    <span class="text-2xl">?</span>
                  </div>
                </div>
                <div>
                  <p class="font-semibold">{panelist}</p>
                  <p class="text-sm text-neutral opacity-70">Details coming soon</p>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="card bg-base-200 border border-base-300">
          <div class="card-body flex-row items-center gap-4">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-14 h-14 flex items-center justify-center">
                <span class="text-xl font-bold">KB</span>
              </div>
            </div>
            <div>
              <p class="font-semibold">Kent Beck</p>
              <p class="text-sm text-neutral opacity-70">Moderator — Creator of Thinkies</p>
            </div>
          </div>
        </div>
        <div class="card bg-base-200 border border-base-300 mt-4">
          <div class="card-body flex-row items-center gap-4">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-14 h-14 flex items-center justify-center">
                <span class="text-xl font-bold">AS</span>
              </div>
            </div>
            <div>
              <p class="font-semibold">Arty Starr</p>
              <p class="text-sm text-neutral opacity-70">Moderator</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Section -->
    <section id="join" class="py-20 px-4 twc2-join-bg">
      <div class="container mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold mb-6 text-white">Ready to Join?</h2>
        <p class="text-white/85 text-lg mb-10">
          You can join as an <strong class="text-white">attendee</strong> or as a
          <strong class="text-white">Thinkies facilitator</strong> and help guide a table discussion.
          Once you have your ticket, we'll send everything you need to participate in the event.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="btn-coral btn-coral-lg">
            Join as Attendee
          </a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="btn-outline-white btn-coral-lg">
            Join as Facilitator
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-neutral text-neutral-content">
    <div class="container mx-auto px-4 py-8 text-center space-y-2">
      <p class="text-sm opacity-80">
        Thinkies were created by Kent Beck —
        <a
          href="https://tidyfirst.substack.com/s/thinkies"
          target="_blank"
          rel="noopener noreferrer"
          class="link font-semibold"
        >
          learn more at Substack
        </a>
        &nbsp;·&nbsp;
        <a href="{base}/" class="link font-semibold">Back to thinkies.org</a>
      </p>
      <p class="text-sm opacity-60">
        <a href="{base}/code_of_conduct.html" class="link link-hover">Code of Conduct</a>
        <span class="mx-2">·</span>
        <a href="{base}/privacy.html" class="link link-hover">Privacy Policy</a>
      </p>
    </div>
  </footer>
</div>

<style>
  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    border-radius: 0.75rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .twc2-hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  }

  .twc2-join-bg {
    background: linear-gradient(135deg, #0f3460 0%, #533483 60%, #1a1a2e 100%);
  }

  .btn-outline-purple {
    background: transparent;
    color: #533483;
    border: 2px solid #533483;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background-color 0.2s ease, color 0.2s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-outline-purple:hover {
    background: #533483;
    color: white;
  }

  .btn-outline-white {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background-color 0.2s ease, color 0.2s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-outline-white:hover {
    background: white;
    color: #1a1a2e;
  }
</style>
