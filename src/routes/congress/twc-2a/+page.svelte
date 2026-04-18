<script>
  import { base } from '$app/paths';
  import './twc-2a.css';

  function scrollToJoin(e) {
    e.preventDefault();
    document.getElementById('join-a')?.scrollIntoView({ behavior: 'smooth' });
  }

  const panelists = [
    {
      name: 'Sowmya Somanath',
      role: 'HCI Researcher · Creativity Support Tools',
      bio: 'Associate Professor and Researcher at the University of Victoria who studies how to design tools that bring creativity to life through hands-on, do-it-yourself making—spanning electronics, fabrication, and interactive technologies.',
      photo: 'sowmya-pic.jpg'
    },
    {
      name: 'Marian Petre',
      role: 'SE Researcher · Developer Expertise & High-Performing Teams',
      bio: 'Emeritus Professor at the Open University (UK) with over three decades of experience studying high-performing software development teams to understand what distinguishes them, exposing actionable insights into how they think, communicate, design, and solve problems.',
      photo: 'marian-pic.jpg'
    },
    {
      name: 'Umit Akirmak',
      role: 'Cognitive Psychology · AI, Creativity & Human Behavior',
      bio: "Cognitive psychology PhD researcher and current Computer Science master's student at the University of Victoria, studying creativity in software development and bringing a cognitive perspective to how people create, collaborate, and adapt when working with AI tools.",
      photo: 'umit-pic.jpg'
    },
    {
      name: 'Arty Starr',
      role: 'Artist · Software Engineer · Researcher · Mystic',
      bio: "2D/3D animator and VFX artist, software engineer with 20+ years of experience, PhD student and author of troubleshooting theory — giving developers words to explain what's happening when software gets out of control.",
      photo: 'arty-pic.jpg'
    },
    {
      name: 'Kent Beck',
      role: 'Software Design Pioneer · Creator of Thinkies',
      bio: 'Helping geeks feel safer in the world by pioneering strategies for shared understanding (design patterns), better feedback loops (TDD), and better ways of collaborating (XP). With Thinkies, he explores how simple creative habits can help people see differently and get unstuck.',
      photo: 'kent-pic.jpg'
    }
  ];

  const schedule = [
    { time: '8:00am PT', activity: 'Introduction keynote by Kent Beck and Arty Starr', room: 'Keynote Room', hi: false },
    { time: '8:10am',    activity: 'Thinkies virtual table discussion — round 1',           room: 'Table Rooms',  hi: true  },
    { time: '8:35am',    activity: 'Idea Garden poster sharing for round 1',                room: 'Garden Rooms', hi: false },
    { time: '9:00am',    activity: 'Introducing next set of Thinkies by Kent Beck and Arty Starr', room: 'Keynote Room', hi: false },
    { time: '9:10am',    activity: 'Thinkies virtual table discussion — round 2',           room: 'Table Rooms',  hi: true  },
    { time: '9:35am',    activity: 'Idea Garden poster sharing for round 2',                room: 'Garden Rooms', hi: false },
    { time: '10:00am',   activity: 'Panel discussion and reflection led by Kent Beck and Arty Starr', room: 'Keynote Room', hi: false },
    { time: '11:00am',   activity: 'Conference Ends',                                       room: '',             hi: false }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="twc2a">

  <!-- Hero -->
  <header class="twc2a-hero">
    <div class="twc2a-hero__inner">
      <p class="twc2a-hero__eyebrow">Virtual Unconference Event · by Kent Beck</p>
      <h1 class="twc2a-hero__title">Thinkies World<br>Congress II</h1>
      <p class="twc2a-hero__subtitle">A Creative Gathering for Unsticking Stuck Thinking</p>
      <p class="twc2a-hero__date">May 20th, 2026 · 8:00am – 11:00am Pacific Time<br>5pm – 8pm CET</p>
      <a href="#join-a" on:click={scrollToJoin} class="twc2a-btn-primary">Join the Event</a>
    </div>
  </header>

  <main>

    <!-- About -->
    <section class="twc2a-section twc2a-section--surface">
      <div class="twc2a-container">
        <p class="twc2a-body-text">
          Thinkies are <strong>learnable pattern transformations</strong> you can use to shift how you see a situation,
          expand the space of options, and spark new ideas — especially when things feel stuck or prematurely decided.
          It's not about having the <em>right</em> idea, it's about generating <em>lots</em> of ideas — some of which might be brilliant.
        </p>
        <p class="twc2a-body-text">
          Thinkies help you <strong>notice</strong> when a conversation or decision is falling into a predictable groove —
          and then offer you a way to step sideways, flip the frame, or open up new paths.
        </p>
        <p class="twc2a-body-text" style="margin-bottom:0">
          At the <strong>Thinkies World Congress</strong> virtual event, you won't just <em>learn</em> about
          Thinkies — you'll get <em>practice</em> with them.
        </p>
      </div>
    </section>

    <!-- Video -->
    <section class="twc2a-section twc2a-section--dark">
      <div class="twc2a-container">
        <p class="twc2a-label twc2a-text-center">Watch</p>
        <h2 class="twc2a-title twc2a-text-center">See What It's All About</h2>
        <p class="twc2a-lead twc2a-lead--centered twc2a-text-center" style="margin-bottom:0">
          A short video to get a feel for what the Thinkies World Congress is — and why you should join.
        </p>
        <div class="twc2a-video-wrap">
          <iframe
            src="https://www.youtube.com/embed/xx05TMxead0?start=3"
            title="What is the Thinkies World Congress?"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- What to Expect -->
    <section class="twc2a-section twc2a-section--surface2">
      <div class="twc2a-container--wide">
        <p class="twc2a-label twc2a-text-center">The Experience</p>
        <h2 class="twc2a-title twc2a-text-center">What to Expect</h2>
        <p class="twc2a-lead twc2a-lead--centered twc2a-text-center">
          A hands-on, virtual gathering for anyone who wants to strengthen their ability to think creatively —
          whether you're a software developer, engineering leader, or simply someone who cares about getting unstuck.
        </p>

        <div class="twc2a-cards">
          <div class="twc2a-card">
            <div class="twc2a-card__icon twc2a-card__icon--coral">✨</div>
            <h3 class="twc2a-card__title">Main Stage Kickoff</h3>
            <p class="twc2a-card__text">We'll start with an introduction to Thinkies — what they are, how they work, and why they matter. You'll learn a few powerful transformations to try out.</p>
          </div>
          <div class="twc2a-card">
            <div class="twc2a-card__icon twc2a-card__icon--violet">🧩</div>
            <h3 class="twc2a-card__title">Virtual Table Practice</h3>
            <p class="twc2a-card__text">Join a virtual table where a facilitator guides your group in applying a Thinkie to a sticky scenario and collaborating on generating fresh ideas.</p>
          </div>
          <div class="twc2a-card">
            <div class="twc2a-card__icon twc2a-card__icon--teal">🌱</div>
            <h3 class="twc2a-card__title">The Idea Garden</h3>
            <p class="twc2a-card__text">Share ideas in a virtual Idea Garden — an open discussion where you'll explore, reflect, and look for patterns. All ideas will be open source on thinkies.org.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inline CTA -->
    <section class="twc2a-section twc2a-section--surface">
      <div class="twc2a-container twc2a-text-center">
        <p class="twc2a-label twc2a-text-center">Reserve Your Spot</p>
        <h2 class="twc2a-title" style="margin-bottom:0.5rem">Ready to Unstick Your Thinking?</h2>
        <p class="twc2a-lead twc2a-lead--centered" style="margin-bottom:2rem">
          Join as an attendee or step up as a Thinkies facilitator and guide a table discussion.
        </p>
        <div class="twc2a-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2a-btn-primary">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2a-btn-violet">Join as Facilitator</a>
        </div>
      </div>
    </section>

    <!-- Panel Discussion -->
    <section class="twc2a-section twc2a-section--dark">
      <div class="twc2a-container">
        <p class="twc2a-label twc2a-text-center">Speakers</p>
        <h2 class="twc2a-title twc2a-text-center">Panel Discussion</h2>
        <p class="twc2a-lead twc2a-lead--centered twc2a-text-center" style="margin-bottom:0">
          Where Does Creativity Come From? — After 2 rounds of Thinkies practice, thought leaders from multiple disciplines share their take.
        </p>

        <div class="twc2a-panelists">
          {#each panelists as p}
            <div class="twc2a-panelist">
              <div class="twc2a-panelist__photo-wrap">
                <div class="twc2a-panelist__ring"></div>
                <div class="twc2a-panelist__photo-inner">
                  <img src="{base}/img/{p.photo}" alt="{p.name}" />
                </div>
              </div>
              <div>
                <h3 class="twc2a-panelist__name">{p.name}</h3>
                <span class="twc2a-panelist__role">{p.role}</span>
                <p class="twc2a-panelist__bio">{p.bio}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section class="twc2a-section twc2a-section--surface">
      <div class="twc2a-container">
        <p class="twc2a-label twc2a-text-center">Program</p>
        <h2 class="twc2a-title twc2a-text-center">Schedule</h2>
        <p class="twc2a-lead twc2a-lead--centered twc2a-text-center" style="margin-bottom:0">
          May 20th, 2026 · 8:00am – 11:00am Pacific Time
        </p>

        <div class="twc2a-schedule-wrap">
          <div class="twc2a-sched-head">
            <span>Time</span><span>Activity</span><span style="text-align:right">Room</span>
          </div>
          {#each schedule as row}
            <div class="twc2a-sched-row {row.hi ? 'twc2a-sched-row--hi' : ''}">
              <span class="twc2a-sched-time">{row.time}</span>
              <span class="twc2a-sched-activity">{row.activity}</span>
              <span class="twc2a-sched-room">{row.room}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="join-a" class="twc2a-section twc2a-section--cta">
      <div class="twc2a-container twc2a-text-center">
        <p class="twc2a-label twc2a-text-center">May 20th, 2026</p>
        <h2 class="twc2a-title" style="margin-bottom:0.75rem">Ready to Join?</h2>
        <p class="twc2a-lead twc2a-lead--centered" style="margin-bottom:2.5rem">
          You can join as an <strong style="color:#f8f8fc">attendee</strong> or as a
          <strong style="color:#f8f8fc">Thinkies facilitator</strong> and help guide a table discussion.
          Once you have your ticket, we'll send everything you need.
        </p>
        <div class="twc2a-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2a-btn-primary">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2a-btn-secondary">Join as Facilitator</a>
        </div>
      </div>
    </section>

  </main>

  <footer class="twc2a-footer">
    <p>
      Thinkies were created by Kent Beck —
      <a href="https://tidyfirst.substack.com/s/thinkies" target="_blank" rel="noopener noreferrer">learn more at Substack</a>
      &nbsp;·&nbsp;
      <a href="{base}/">Back to thinkies.org</a>
    </p>
    <p style="margin-top:0.5rem;font-size:0.8rem">
      <a href="{base}/code_of_conduct.html">Code of Conduct</a>
      <span style="margin:0 0.5rem">·</span>
      <a href="{base}/privacy.html">Privacy Policy</a>
    </p>
  </footer>

</div>
