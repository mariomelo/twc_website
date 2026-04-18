<script>
  import { base } from '$app/paths';
  import './twc-2c.css';

  function scrollToJoin(e) {
    e.preventDefault();
    document.getElementById('join-c')?.scrollIntoView({ behavior: 'smooth' });
  }

  const panelists = [
    {
      name: 'Sowmya Somanath',
      role: 'HCI Researcher of Creativity Support Tools and Creative Experience Design',
      bio: 'Associate Professor and Researcher at the University of Victoria who studies how to design tools that bring creativity to life through hands-on, do-it-yourself making—spanning electronics, fabrication, and interactive technologies.',
      photo: 'sowmya-pic.jpg'
    },
    {
      name: 'Marian Petre',
      role: 'SE Researcher of Developer Expertise and High-Performing Teams',
      bio: 'Emeritus Professor at the Open University (UK) with over three decades of experience studying high-performing software development teams to understand what distinguishes them, exposing actionable insights into how they think, communicate, design, and solve problems.',
      photo: 'marian-pic.jpg'
    },
    {
      name: 'Umit Akirmak',
      role: 'Cognitive Psychology Researcher exploring AI, Creativity, and Human Behavior',
      bio: "Cognitive psychology PhD researcher and current Computer Science master's student at the University of Victoria, studying creativity in software development and bringing a cognitive perspective to how people create, collaborate, and adapt when working with AI tools.",
      photo: 'umit-pic.jpg'
    },
    {
      name: 'Arty Starr',
      role: 'Artist, Software Engineer, Researcher and Mystic',
      bio: "2D/3D animator and VFX artist, software engineer with 20+ years of experience, PhD student and author of troubleshooting theory — giving developers words to explain what's happening when software gets out of control. Also trying to be a more integrated human being.",
      photo: 'arty-pic.jpg'
    },
    {
      name: 'Kent Beck',
      role: 'Software Design Pioneer, Artist, Musician, and Creator of Thinkies',
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
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="twc2c">

  <!-- Hero -->
  <header class="twc2c-hero">
    <div class="twc2c-hero__giant-num" aria-hidden="true">II</div>
    <div class="twc2c-hero__inner">
      <p class="twc2c-hero__eyebrow">✦ Virtual Unconference · by Kent Beck ✦</p>
      <h1 class="twc2c-hero__title">Thinkies<br>World <em>Congress</em> II</h1>
      <p class="twc2c-hero__subtitle">A Creative Gathering for Unsticking Stuck Thinking</p>
      <p class="twc2c-hero__date">May 20th, 2026 &nbsp;·&nbsp; 8am – 11am Pacific</p>
      <a href="#join-c" on:click={scrollToJoin} class="twc2c-btn-coral">Join the Event</a>
    </div>
  </header>

  <main>

    <!-- About -->
    <section class="twc2c-section twc2c-section--dark2">
      <div class="twc2c-container">
        <p class="twc2c-annotation twc2c-annotation--coral">✦ What are Thinkies?</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--coral" style="margin-bottom:2rem">
          <h2 class="twc2c-title">Unstick your thinking.</h2>
        </div>
        <p class="twc2c-body">
          Thinkies are <strong style="color:#f0ede4">learnable pattern transformations</strong> — tools you can pick up and apply whenever a conversation, decision, or creative problem feels stuck. It's not about having the <em>right</em> idea. It's about generating <em>lots</em> of ideas, some of which might be brilliant.
        </p>
        <p class="twc2c-body">
          Thinkies help you <strong style="color:#f0ede4">notice</strong> when thinking is falling into a predictable groove — and offer you a way to step sideways, flip the frame, or open up entirely new paths forward.
        </p>
        <p class="twc2c-body" style="margin-bottom:0">
          At the <strong style="color:#ff4f7b">Thinkies World Congress</strong>, you won't just <em>learn</em> — you'll <em>practice</em>.
        </p>
      </div>
    </section>

    <!-- Video -->
    <section class="twc2c-section twc2c-section--dark3">
      <div class="twc2c-container">
        <p class="twc2c-annotation twc2c-annotation--yellow">✦ Watch</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--yellow">
          <h2 class="twc2c-title">See what it's all about.</h2>
        </div>
        <p class="twc2c-lead" style="margin-bottom:0">A short video on what the TWC is — and why you'll want in.</p>
        <div class="twc2c-video-wrap">
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
    <section class="twc2c-section twc2c-section--dark2">
      <div class="twc2c-container--wide">
        <p class="twc2c-annotation twc2c-annotation--sky" style="text-align:center">✦ The Experience</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--sky" style="display:block;text-align:center;margin-bottom:1.5rem">
          <h2 class="twc2c-title" style="text-align:center">Here's how it unfolds.</h2>
        </div>
        <p class="twc2c-lead" style="text-align:center;margin:0 auto 3rem;max-width:38rem">
          Hands-on, collaborative, and designed to leave you with real tools — not just ideas.
        </p>
        <div class="twc2c-cards">
          <div class="twc2c-card twc2c-card--coral">
            <div class="twc2c-card__num">01</div>
            <div class="twc2c-card__emoji">✨</div>
            <h3 class="twc2c-card__title">Main Stage Kickoff</h3>
            <p class="twc2c-card__text">We start together: introduction to Thinkies, what they are, how they work. You'll learn powerful transformations ready to try right away.</p>
          </div>
          <div class="twc2c-card twc2c-card--sky">
            <div class="twc2c-card__num">02</div>
            <div class="twc2c-card__emoji">🧩</div>
            <h3 class="twc2c-card__title">Virtual Table Practice</h3>
            <p class="twc2c-card__text">You join a virtual table. A facilitator guides your group: apply a Thinkie to a real sticky scenario and co-create fresh solutions.</p>
          </div>
          <div class="twc2c-card twc2c-card--lime">
            <div class="twc2c-card__num">03</div>
            <div class="twc2c-card__emoji">🌱</div>
            <h3 class="twc2c-card__title">The Idea Garden</h3>
            <p class="twc2c-card__text">All groups reconvene. Share, explore, reflect. Look for patterns across the ideas. Everything generated is open source on thinkies.org.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inline CTA -->
    <section class="twc2c-section twc2c-section--dark" style="padding:4rem 1.5rem">
      <div class="twc2c-container" style="text-align:center">
        <p class="twc2c-annotation twc2c-annotation--lime" style="text-align:center">✦ Reserve your spot</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--lime" style="display:block;margin-bottom:1rem">
          <h2 class="twc2c-title" style="text-align:center">Ready to Unstick?</h2>
        </div>
        <p class="twc2c-lead" style="text-align:center;margin:0 auto 2rem;max-width:34rem">
          Join as an attendee or step up as a facilitator and guide a table.
        </p>
        <div class="twc2c-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2c-btn-coral">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2c-btn-lime">Join as Facilitator</a>
        </div>
      </div>
    </section>

    <!-- Panel Discussion -->
    <section class="twc2c-section twc2c-section--dark2">
      <div class="twc2c-container">
        <p class="twc2c-annotation twc2c-annotation--coral">✦ Panel Discussion</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--coral" style="margin-bottom:1rem">
          <h2 class="twc2c-title">Where does creativity<br>come from?</h2>
        </div>
        <p class="twc2c-lead" style="margin-bottom:3rem">
          After 2 rounds of Thinkies practice, thought leaders from multiple disciplines share their take on the keynote stage.
        </p>

        <div class="twc2c-panelists">
          {#each panelists as p}
            <div class="twc2c-panelist">
              <div class="twc2c-panelist__photo-wrap">
                <div class="twc2c-panelist__photo-blob">
                  <img src="{base}/img/{p.photo}" alt="{p.name}" />
                </div>
              </div>
              <div>
                <h3 class="twc2c-panelist__name">{p.name}</h3>
                <p class="twc2c-panelist__role">{p.role}</p>
                <p class="twc2c-panelist__bio">{p.bio}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section class="twc2c-section twc2c-section--dark3">
      <div class="twc2c-container">
        <p class="twc2c-annotation twc2c-annotation--yellow">✦ Program</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--yellow" style="margin-bottom:0.5rem">
          <h2 class="twc2c-title">Schedule</h2>
        </div>
        <p class="twc2c-lead" style="margin-bottom:0">May 20th, 2026 · 8:00am – 11:00am Pacific Time</p>
        <div class="twc2c-schedule-wrap">
          <div class="twc2c-sched-head">
            <span>Time</span><span>Activity</span><span style="text-align:right">Room</span>
          </div>
          {#each schedule as row}
            <div class="twc2c-sched-row {row.hi ? 'twc2c-sched-row--hi' : ''}">
              <span class="twc2c-sched-time">{row.time}</span>
              <span class="twc2c-sched-activity">{row.activity}</span>
              <span class="twc2c-sched-room">{row.room}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="join-c" class="twc2c-section twc2c-section--dark" style="padding:6rem 1.5rem">
      <div class="twc2c-container" style="text-align:center">
        <p class="twc2c-annotation twc2c-annotation--coral" style="text-align:center">✦ May 20th, 2026</p>
        <div class="twc2c-heading-wrap twc2c-heading-wrap--coral" style="display:block;margin-bottom:1rem">
          <h2 class="twc2c-title" style="text-align:center">Ready to Join?</h2>
        </div>
        <p class="twc2c-lead" style="text-align:center;margin:0 auto 2.5rem;max-width:34rem">
          Join as an <strong style="color:#f0ede4">attendee</strong> or as a <strong style="color:#f0ede4">Thinkies facilitator</strong> and guide a table discussion.
          Once you have your ticket, we'll send everything you need.
        </p>
        <div class="twc2c-btn-row">
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Attendee" class="twc2c-btn-coral">Join as Attendee</a>
          <a href="mailto:hello@thinkies.org?subject=TWC II - Join as Facilitator" class="twc2c-btn-lime">Join as Facilitator</a>
        </div>
      </div>
    </section>

  </main>

  <footer class="twc2c-footer">
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
