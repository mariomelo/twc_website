<script>
  import { base } from '$app/paths';
  import './twc-2b.css';

  function scrollToJoin(e) {
    e.preventDefault();
    document.getElementById('join-b')?.scrollIntoView({ behavior: 'smooth' });
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
      bio: 'Emeritus Professor at the Open University (UK) with over three decades of experience studying high-performing software development teams, exposing actionable insights into how they think, communicate, design, and solve problems.',
      photo: 'marian-pic.jpg'
    },
    {
      name: 'Umit Akirmak',
      role: 'Cognitive Psychology · AI, Creativity & Human Behavior',
      bio: "Cognitive psychology PhD researcher and current Computer Science master's student at the University of Victoria, studying creativity in software development and bringing a cognitive perspective to how people create, collaborate, and adapt with AI tools.",
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
      bio: 'Helping geeks feel safer in the world by pioneering strategies for shared understanding (design patterns), better feedback loops (TDD), and better ways of collaborating (XP). With Thinkies, he explores how simple creative habits can help people see differently.',
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
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="twc2b">

  <!-- Hero -->
  <header class="twc2b-hero">
    <div class="twc2b-hero__inner">
      <span class="twc2b-hero__tag">// virtual_unconference · may_20_2026</span>
      <h1 class="twc2b-hero__title">Thinkies<br><span>World Congress</span> II</h1>
      <p class="twc2b-hero__subtitle">A Creative Gathering for Unsticking Stuck Thinking</p>
      <p class="twc2b-hero__date">08:00 — 11:00 PT &nbsp;|&nbsp; 17:00 — 20:00 CET</p>
      <a href="#join-b" on:click={scrollToJoin} class="twc2b-btn-cyan">Join the Event</a>
    </div>
  </header>

  <main>

    <!-- About -->
    <section class="twc2b-section twc2b-section--dark2" style="padding-top:6rem">
      <div class="twc2b-container">
        <p class="twc2b-overline twc2b-overline--cyan">About</p>
        <h2 class="twc2b-title">What are Thinkies?</h2>
        <p class="twc2b-body">
          Thinkies are <strong style="color:#fff">learnable pattern transformations</strong> you can use to shift how you see a situation,
          expand the space of options, and spark new ideas — especially when things feel stuck or prematurely decided.
        </p>
        <p class="twc2b-body">
          They help you <strong style="color:#fff">notice</strong> when a conversation or decision is falling into a predictable groove —
          then offer you a way to step sideways, flip the frame, or open up new paths.
        </p>
        <p class="twc2b-body" style="margin-bottom:0">
          At the <strong style="color:#00d4ff">Thinkies World Congress</strong>, you won't just <em>learn</em> about Thinkies — you'll <em>practice</em> with them.
        </p>
      </div>
    </section>

    <!-- Video -->
    <section class="twc2b-section twc2b-section--dark3">
      <div class="twc2b-container">
        <p class="twc2b-overline twc2b-overline--orange">Watch</p>
        <h2 class="twc2b-title">See What It's All About</h2>
        <p class="twc2b-lead" style="margin-bottom:0">A short video on what the Thinkies World Congress is — and why you should join.</p>
        <div class="twc2b-video-wrap">
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
    <section class="twc2b-section twc2b-section--dark2">
      <div class="twc2b-container--wide">
        <p class="twc2b-overline twc2b-overline--purple" style="text-align:center">The Experience</p>
        <h2 class="twc2b-title" style="text-align:center">What to Expect</h2>
        <p class="twc2b-lead twc2b-lead--center">
          Hands-on, virtual — for developers, engineering leaders, and anyone who cares about getting unstuck.
        </p>
        <div class="twc2b-cards">
          <div class="twc2b-card">
            <div class="twc2b-card__accent twc2b-card__accent--cyan"></div>
            <div class="twc2b-card__num">01</div>
            <div class="twc2b-card__icon">✨</div>
            <h3 class="twc2b-card__title">Main Stage Kickoff</h3>
            <p class="twc2b-card__text">Introduction to Thinkies — what they are, how they work, why they matter. Learn a few powerful transformations to try out.</p>
          </div>
          <div class="twc2b-card">
            <div class="twc2b-card__accent twc2b-card__accent--orange"></div>
            <div class="twc2b-card__num">02</div>
            <div class="twc2b-card__icon">🧩</div>
            <h3 class="twc2b-card__title">Virtual Table Practice</h3>
            <p class="twc2b-card__text">Join a virtual table where a facilitator guides your group in applying a Thinkie to a sticky scenario and generating fresh ideas.</p>
          </div>
          <div class="twc2b-card">
            <div class="twc2b-card__accent twc2b-card__accent--green"></div>
            <div class="twc2b-card__num">03</div>
            <div class="twc2b-card__icon">🌱</div>
            <h3 class="twc2b-card__title">The Idea Garden</h3>
            <p class="twc2b-card__text">Share ideas in a virtual Idea Garden — explore, reflect, look for patterns. All ideas open source and available on thinkies.org.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inline CTA -->
    <section class="twc2b-section twc2b-section--cta-light">
      <div class="twc2b-container" style="text-align:center">
        <p class="twc2b-overline twc2b-overline--cyan" style="text-align:center">May 20th, 2026</p>
        <h2 class="twc2b-title" style="margin-bottom:0.75rem">Ready to Unstick Your Thinking?</h2>
        <p class="twc2b-lead twc2b-lead--center" style="margin-bottom:2rem">
          Join as an attendee or step up as a Thinkies facilitator and guide a table.
        </p>
        <div class="twc2b-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2b-btn-cyan">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2b-btn-orange">Join as Facilitator</a>
        </div>
      </div>
    </section>

    <!-- Panel Discussion -->
    <section class="twc2b-section twc2b-section--dark" style="padding-bottom:2rem">
      <div class="twc2b-container--wide">
        <p class="twc2b-overline twc2b-overline--purple" style="text-align:center">Panelists</p>
        <h2 class="twc2b-title" style="text-align:center;margin-bottom:0.5rem">Panel Discussion</h2>
        <p class="twc2b-lead twc2b-lead--center" style="margin-bottom:2.5rem">
          Where Does Creativity Come From? — thought leaders from multiple disciplines share their take after 2 rounds of Thinkies practice.
        </p>
      </div>
    </section>

    <div class="twc2b-panelists">
      {#each panelists as p}
        <div class="twc2b-panelist">
          <div class="twc2b-panelist__photo-side">
            <img src="{base}/img/{p.photo}" alt="{p.name}" />
            <div class="twc2b-panelist__photo-overlay"></div>
          </div>
          <div class="twc2b-panelist__bio-side">
            <h3 class="twc2b-panelist__name">{p.name}</h3>
            <p class="twc2b-panelist__role">{p.role}</p>
            <p class="twc2b-panelist__text">{p.bio}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Schedule -->
    <section class="twc2b-section twc2b-section--dark2">
      <div class="twc2b-container">
        <p class="twc2b-overline twc2b-overline--cyan">Program</p>
        <h2 class="twc2b-title">Schedule</h2>
        <p class="twc2b-lead" style="margin-bottom:0">May 20th, 2026 · 8:00am – 11:00am Pacific Time</p>

        <div class="twc2b-schedule-wrap">
          <div class="twc2b-sched-head">
            <span>Time</span><span>Activity</span><span style="text-align:right">Room</span>
          </div>
          {#each schedule as row}
            <div class="twc2b-sched-row {row.hi ? 'twc2b-sched-row--hi' : ''}">
              <span class="twc2b-sched-time">{row.time}</span>
              <span class="twc2b-sched-activity">{row.activity}</span>
              <span class="twc2b-sched-room">{row.room}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="join-b" class="twc2b-section twc2b-section--cta-final">
      <div class="twc2b-cta-inner twc2b-container" style="text-align:center">
        <p class="twc2b-overline twc2b-overline--cyan" style="text-align:center">Reserve Your Spot</p>
        <h2 class="twc2b-title" style="margin-bottom:0.75rem">Ready to Join?</h2>
        <p class="twc2b-lead twc2b-lead--center" style="margin-bottom:2.5rem">
          Join as an <strong style="color:#e8eaf0">attendee</strong> or as a
          <strong style="color:#e8eaf0">Thinkies facilitator</strong> and help guide a table discussion.
          Once you have your ticket, we'll send everything you need.
        </p>
        <div class="twc2b-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2b-btn-cyan">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2b-btn-outline">Join as Facilitator</a>
        </div>
      </div>
    </section>

  </main>

  <footer class="twc2b-footer">
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
