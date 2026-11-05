/**
 * Idea Garden — exploratory visualisations of the TWC conference stickies.
 *
 * The raw boards stay where the conference pages already read them
 * (static/conferences/twc-{1,2}/data.json); this module only adds the editorial
 * layer the visualisations need:
 *
 *   - `PROBLEMS` gives each scenario a short title and groups the sessions
 *     that worked on the same scenario (two tables, or two conferences).
 *   - `KINDS_BY_SESSION` is a hand classification of every sticky, one letter
 *     per sticky, in board order. The same rules were applied to both events:
 *
 *       Q  question  — asks for information or asks someone to find out
 *                      ("How do we…?", "Ask the team why…").
 *       C  concern   — names a risk, constraint, fear or obstacle, including
 *                      worries phrased as "what if" ("What if the haunted
 *                      forest reanimates?").
 *       A  action    — proposes a move, step, experiment or practice, even
 *                      when phrased as "what about…?" or a provocation.
 *       R  reframe   — an observation, principle, analogy or a "what if" that
 *                      changes how the situation is seen.
 *       X  fragment  — a heading, a copy of the prompt, or a word with no
 *                      standalone meaning ("$$$", "Hi!"). Kept, not drawn.
 *
 *     If a board changes, the length check below throws so the letters can't
 *     silently drift out of step with the stickies.
 */
import twc1 from '../../../static/conferences/twc-1/data.json';
import twc2 from '../../../static/conferences/twc-2/data.json';

/** `color` is validated on the paper surface, `darkColor` on the night sky (#14142a). */
export const KINDS = {
  question: {
    key: 'question',
    label: 'Question',
    plural: 'Questions',
    metaphor: 'bud',
    metaphors: 'buds',
    color: '#7b52c7',
    darkColor: '#8a63d6',
    blurb: 'Asks for something we do not know yet.'
  },
  concern: {
    key: 'concern',
    label: 'Concern',
    plural: 'Concerns',
    metaphor: 'thorn',
    metaphors: 'thorns',
    color: '#d9475f',
    darkColor: '#d9475f',
    blurb: 'Names a risk, a constraint or a fear.'
  },
  action: {
    key: 'action',
    label: 'Action',
    plural: 'Actions',
    metaphor: 'leaf',
    metaphors: 'leaves',
    color: '#14957f',
    darkColor: '#14957f',
    blurb: 'Proposes a move, a step or an experiment.'
  },
  reframe: {
    key: 'reframe',
    label: 'Reframe',
    plural: 'Reframes',
    metaphor: 'flower',
    metaphors: 'flowers',
    color: '#c08f10',
    darkColor: '#b3850f',
    blurb: 'Changes how the situation is seen.'
  }
};

/** Fixed order — colour and position follow the kind, never its rank. */
export const KIND_ORDER = ['question', 'concern', 'action', 'reframe'];

const LETTER = { Q: 'question', C: 'concern', A: 'action', R: 'reframe', X: 'fragment' };

export const EVENTS = [
  { id: 'twc-1', label: 'TWC 1', name: 'Thinkies Workshop Conference 1', order: 1 },
  { id: 'twc-2', label: 'TWC 2', name: 'Thinkies Workshop Conference 2', order: 2 }
];

const KINDS_BY_SESSION = {
  // ─── TWC 1 ───
  'twc-1/more-general-solution/0': 'AQQAAAAAAAAR',
  'twc-1/hard-problem/0': 'QAQQQCCCQC' + 'CQCQCCQQCC' + 'QCQQQCCQQC' + 'CQQCQCQCCC' + 'CC',
  'twc-1/direct-feedback/0': 'AAAAAAAAQAAAARQAAAAQ',
  'twc-1/analogy/0': 'RRRRRR',
  'twc-1/put-skin-in-the-game/0': 'AAAAAAAAAAQAAAAAAAR',
  'twc-1/end-to-end/0': 'ARAAAAAAAAQQQQQQAA',
  'twc-1/easy-bit/0': 'AAAAAAAA',
  'twc-1/cant-because/0': 'RRRQRRRARRRCRRCR',
  'twc-1/force-decision/0': 'AAAQQRRAAA',
  'twc-1/half-in-a-half/0': 'RQQAAQAAAARQAARQQAR',
  'twc-1/obviously/0': 'QQQQQQQRRAAQQQQQQAARQAQ',
  'twc-1/fun-bit/0': 'AAAARAQRAQAAAAAAAAAAAAA',
  // ─── TWC 2 ───
  'twc-2/end-to-end/0': 'AAAAAAA',
  'twc-2/end-to-end/1': 'AQAARCRAARA',
  'twc-2/hard-problem/0': 'CCCRCQQCQQ' + 'RCRCCXCCCC' + 'CCCCCCCCQC' + 'QCCCCQC',
  'twc-2/hard-problem/1': 'CCCCCCCCCCCCCCCC',
  'twc-2/abundance/0': 'RAAAAQAARAQRQAAAAAAAAAA',
  'twc-2/abundance/1': 'AAAAXXXXXAAAAAX',
  'twc-2/force-decision/0': 'QAAARAQQQQQ',
  'twc-2/force-decision/1': 'AAQAAQAAAQ',
  'twc-2/fun-bit/0': 'AAAAAAAAAAAA',
  'twc-2/fun-bit/1': 'AQAAAAAAAAAAA',
  'twc-2/more-general-solution/0': 'AAQQQRAAAQAAAAAARQRRAA',
  'twc-2/more-general-solution/1': '',
  'twc-2/easy-bit/0': 'AXAAARARAA',
  'twc-2/easy-bit/1': 'AAAAAAAAAAAAAAAAAAA',
  'twc-2/half-in-a-half/0': 'QAXQAXAXAAXAAAAAAAARARA',
  'twc-2/half-in-a-half/1': 'AAAAAAAAAAAAAAARRR',
  'twc-2/parallel-decision/0': 'QRAAAAAAAAQAARAAAAAAAA',
  'twc-2/parallel-decision/1': 'QAAAAAAAAAAA',
  'twc-2/direct-feedback/0': 'AAAAAAAAAAAAAAAAA',
  'twc-2/direct-feedback/1': 'AAAQAQAARAAAAAARAAA',
  'twc-2/put-skin-in-the-game/0': 'AAAAAAAXXARAA',
  'twc-2/put-skin-in-the-game/1': 'AAAAAAA',
  'twc-2/obviously/0': 'AAQQQAAQAAA',
  'twc-2/obviously/1': 'RRRRRRRCQCRRRRRRR'
};

/**
 * One entry per distinct challenge. Several sessions can share a problem: the
 * same scenario run at two tables, or brought back at the next conference.
 */
export const PROBLEMS = [
  { slug: 'correlating-logs', title: 'No way to correlate logs across services', sessions: ['twc-1/more-general-solution/0', 'twc-2/more-general-solution/1'] },
  { slug: 'ai-feature-to-production', title: 'Taking an AI feature to production', sessions: ['twc-1/hard-problem/0'] },
  { slug: 'millions-of-users', title: 'Millions of users, no idea what they value', sessions: ['twc-1/direct-feedback/0'] },
  { slug: 'explaining-a-queue', title: 'Explaining a message queue to a manager', sessions: ['twc-1/analogy/0'] },
  { slug: 'sales-sells-vapour', title: 'Sales keeps selling features that don’t exist', sessions: ['twc-1/put-skin-in-the-game/0'] },
  { slug: 'three-countries', title: 'A finance app for three countries in 8 weeks', sessions: ['twc-1/end-to-end/0'] },
  { slug: 'reconciliation', title: 'A reconciliation system that feels a million miles away', sessions: ['twc-1/easy-bit/0'] },
  { slug: 'no-friday-deploys', title: '“We can’t deploy today, something might break”', sessions: ['twc-1/cant-because/0'] },
  { slug: 'three-legacy-tools', title: 'Three legacy tools to replace, no decision made', sessions: ['twc-1/force-decision/0'] },
  { slug: 'six-months-in-four', title: 'Six months of migration, four months left', sessions: ['twc-1/half-in-a-half/0'] },
  { slug: 'obviously-feature-x', title: '“Obviously, we need Feature X”', sessions: ['twc-1/obviously/0', 'twc-2/obviously/0'] },
  { slug: 'abandoned-java-app', title: 'Reviving a legacy Java app nobody remembers', sessions: ['twc-1/fun-bit/0'] },
  { slug: 'proving-new-tech', title: 'Proving new tech works in a microservice split', sessions: ['twc-2/end-to-end/0'] },
  { slug: 'nobody-sees-the-whole', title: 'Everyone is making progress, nobody understands the whole', sessions: ['twc-2/end-to-end/1'] },
  { slug: 'haunted-forest', title: '500% velocity and a haunted forest of code', sessions: ['twc-2/hard-problem/0'] },
  { slug: 'aging-monolith', title: 'An aging monolith where every start is a risk', sessions: ['twc-2/hard-problem/1'] },
  { slug: 'mainframe-three-devs', title: 'Modernise the mainframe with three developers', sessions: ['twc-2/abundance/0'] },
  { slug: 'v1-regulation-v2-launch', title: 'A v1 regulation lands on the v2 launch date', sessions: ['twc-2/abundance/1'] },
  { slug: 'auth-migration', title: 'Everyone agrees on the auth migration, nobody sets a date', sessions: ['twc-2/force-decision/0'] },
  { slug: 'empty-backlog', title: 'The launch shipped and the backlog is empty', sessions: ['twc-2/force-decision/1'] },
  { slug: 'four-hundred-tickets', title: 'A 400-ticket backlog dropped in your lap', sessions: ['twc-2/fun-bit/0'] },
  { slug: 'hated-vm-platform', title: 'A VM platform its customers hate', sessions: ['twc-2/fun-bit/1'] },
  { slug: 'bitcoin-prices', title: 'Adding Bitcoin to a shop priced in Euros', sessions: ['twc-2/more-general-solution/0'] },
  { slug: 'ruby-to-python', title: 'Migrating Ruby to Python without full-time focus', sessions: ['twc-2/easy-bit/0'] },
  { slug: 'ai-every-day', title: 'What could AI help me with every day?', sessions: ['twc-2/easy-bit/1'] },
  { slug: 'the-book', title: 'The book I keep not writing', sessions: ['twc-2/half-in-a-half/0'] },
  { slug: 'dark-factory', title: 'A “Dark Factory” mandate by next quarter', sessions: ['twc-2/half-in-a-half/1'] },
  { slug: 'refactor-or-ship', title: 'Refactor first or ship first?', sessions: ['twc-2/parallel-decision/0', 'twc-2/parallel-decision/1'] },
  { slug: 'hearing-users', title: 'Hearing the many users of a long-lived business app', sessions: ['twc-2/direct-feedback/0', 'twc-2/direct-feedback/1'] },
  { slug: 'below-the-sla', title: 'Customers stuck just inside the SLA', sessions: ['twc-2/put-skin-in-the-game/0'] },
  { slug: 'year-in-a-quarter', title: 'A year of platform work in one quarter, with agents', sessions: ['twc-2/put-skin-in-the-game/1'] },
  { slug: 'obviously-more-ai', title: '“Obviously our clients want more AI output”', sessions: ['twc-2/obviously/1'] }
];

/**
 * Stickies that point at another Thinkie — the only cross-pollination the
 * boards record. Matched on the sticky text; self-references are ignored.
 */
const THINKIE_MENTIONS = [
  [/easy[ -]bit/i, 'Easy Bit'],
  [/fun[ -]bit|fun\/easy/i, 'Fun Bit'],
  [/force decision/i, 'Force Decision'],
  [/half[ -]in[ -](a[ -])?half/i, 'Half in a Half'],
  [/think about abundance/i, 'Abundance'],
  [/hard thinkie/i, 'Hard Problem'],
  [/talk directly to the customers/i, 'Direct Feedback']
];

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’/]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const tidy = (s) => s.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();

/** Small deterministic hash → [0, 1). Layout jitter must not change between builds. */
export function rand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  return ((h >>> 0) % 100000) / 100000;
}

function rawSessions() {
  const out = [];
  for (const t of twc1.thinkies) {
    out.push({ event: 'twc-1', thinkie: t.title, card: t.card_image, idx: 0, scenario: t.scenario, insights: t.insights });
  }
  for (const t of twc2.thinkies) {
    t.scenarios.forEach((s, idx) =>
      out.push({ event: 'twc-2', thinkie: t.title, card: t.card_image, idx, scenario: s.scenario, insights: s.insights })
    );
  }
  return out;
}

function emptyCounts() {
  return { question: 0, concern: 0, action: 0, reframe: 0, fragment: 0, total: 0 };
}

function addCount(counts, kind, weight = 1) {
  counts[kind] += weight;
  if (kind !== 'fragment') counts.total += weight;
}

/**
 * A reading aid, not a verdict. Each kind of sticky pulls a problem toward one
 * Cynefin domain:
 *
 *   actions   → Clear        (sense, categorise, respond: we know the move)
 *   questions → Complicated  (sense, analyse, respond: find out first)
 *   reframes  → Complex      (probe, sense, respond: the frame itself moves)
 *   concerns  → Chaotic      (act, sense, respond: stabilise before anything)
 *
 *   rawX = (actions + questions − concerns − reframes) / n   right = ordered
 *   rawY = (questions + reframes − actions − concerns) / n   up = inquiring
 *
 * Every Thinkie board is action-heavy by design, so raw positions would pile
 * up in Clear. Positions are therefore centred on the median board and scaled
 * by the spread: a problem lands where it differs from a typical session.
 * Near the centre, or with fewer than four stickies, it reads as Confusion.
 */
function rawPull(c) {
  const n = c.total || 1;
  return [(c.action + c.question - c.concern - c.reframe) / n, (c.question + c.reframe - c.action - c.concern) / n];
}

function median(values) {
  const v = [...values].sort((a, b) => a - b);
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

function spread(values, centre) {
  return Math.sqrt(values.reduce((s, v) => s + (v - centre) ** 2, 0) / values.length) || 1;
}

function makeCynefin(sample) {
  const pulls = sample.filter((c) => c.total > 0).map(rawPull);
  const cx = median(pulls.map((p) => p[0]));
  const cy = median(pulls.map((p) => p[1]));
  const sx = spread(pulls.map((p) => p[0]), cx);
  const sy = spread(pulls.map((p) => p[1]), cy);
  return (counts) => {
    const [rx, ry] = rawPull(counts);
    const x = (rx - cx) / sx;
    const y = (ry - cy) / sy;
    let domain;
    if (counts.total < 4 || Math.hypot(x, y) < 0.35) domain = 'confusion';
    else if (x >= 0 && y < 0) domain = 'clear';
    else if (x >= 0) domain = 'complicated';
    else if (y >= 0) domain = 'complex';
    else domain = 'chaotic';
    return { x, y, domain };
  };
}

export const DOMAINS = {
  clear: { key: 'clear', label: 'Clear', sense: 'The room knew what to do: mostly concrete moves.' },
  complicated: { key: 'complicated', label: 'Complicated', sense: 'Moves, but with questions to analyse first.' },
  complex: { key: 'complex', label: 'Complex', sense: 'More questions and reframes than moves: probe first.' },
  chaotic: { key: 'chaotic', label: 'Chaotic', sense: 'Mostly concerns and little response yet: act to stabilise.' },
  confusion: { key: 'confusion', label: 'Confusion', sense: 'Too balanced, or too little on the board, to tell.' }
};

function build() {
  const thinkies = new Map();
  const sessions = [];
  const notes = [];
  const links = [];

  for (const raw of rawSessions()) {
    const tSlug = slugify(raw.thinkie);
    const id = `${raw.event}/${tSlug}/${raw.idx}`;
    const letters = KINDS_BY_SESSION[id];
    if (letters === undefined) throw new Error(`idea-garden: no classification for ${id}`);
    if (letters.length !== raw.insights.length) {
      throw new Error(`idea-garden: ${id} has ${raw.insights.length} stickies but ${letters.length} kinds`);
    }

    if (!thinkies.has(raw.thinkie)) {
      thinkies.set(raw.thinkie, {
        name: raw.thinkie,
        slug: tSlug,
        image: `conferences/${raw.event}/images/${raw.card}`,
        sessions: [],
        counts: emptyCounts()
      });
    }
    const thinkie = thinkies.get(raw.thinkie);

    const session = {
      id,
      event: raw.event,
      thinkie: raw.thinkie,
      thinkieSlug: tSlug,
      scenario: tidy(raw.scenario),
      notes: [],
      counts: emptyCounts(),
      problem: null
    };

    // Identical stickies on one board are the same thought written twice (or
    // voted up); merge them and keep the count as weight.
    const seen = new Map();
    raw.insights.forEach((text, i) => {
      const kind = LETTER[letters[i]];
      const clean = tidy(text);
      const key = clean.toLowerCase();
      if (seen.has(key)) {
        const prior = seen.get(key);
        prior.weight += 1;
        addCount(session.counts, kind);
        addCount(thinkie.counts, kind);
        return;
      }
      const refs = THINKIE_MENTIONS.filter(([re, name]) => name !== raw.thinkie && re.test(clean)).map(
        ([, name]) => name
      );
      const note = { id: `${id}/${i}`, text: clean, kind, weight: 1, refs, session: id, event: raw.event, thinkie: raw.thinkie };
      seen.set(key, note);
      session.notes.push(note);
      notes.push(note);
      addCount(session.counts, kind);
      addCount(thinkie.counts, kind);
      for (const to of refs) links.push({ from: raw.thinkie, to, note });
    });

    thinkie.sessions.push(session);
    sessions.push(session);
  }

  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const problems = PROBLEMS.map((p, i) => {
    const ss = p.sessions.map((id) => {
      const s = sessionById.get(id);
      if (!s) throw new Error(`idea-garden: problem ${p.slug} names unknown session ${id}`);
      return s;
    });
    const counts = emptyCounts();
    for (const s of ss) for (const k of Object.keys(counts)) counts[k] += s.counts[k];
    const problem = {
      ...p,
      number: i + 1,
      scenario: ss[0].scenario,
      sessions: ss,
      thinkies: [...new Set(ss.map((s) => s.thinkie))],
      events: [...new Set(ss.map((s) => s.event))],
      notes: ss.flatMap((s) => s.notes),
      counts
    };
    for (const s of ss) s.problem = problem;
    return problem;
  });

  for (const s of sessions) {
    if (!s.problem) throw new Error(`idea-garden: session ${s.id} belongs to no problem`);
  }

  const cynefin = makeCynefin(problems.map((p) => p.counts));
  for (const p of problems) p.cynefin = cynefin(p.counts);
  const thinkieList = [...thinkies.values()].map((t) => ({ ...t, cynefin: cynefin(t.counts) }));
  return { thinkies: thinkieList, sessions, problems, notes, links };
}

export const garden = build();

export function totals(list = garden.notes) {
  const c = emptyCounts();
  for (const n of list) addCount(c, n.kind, n.weight);
  return c;
}

export function countsByEvent() {
  return EVENTS.map((e) => ({ ...e, counts: totals(garden.notes.filter((n) => n.event === e.id)) }));
}
