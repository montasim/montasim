// Builds assets/profile/open-to-work-{dark,light}.svg: the hiring card at the
// top of the README. Adapted from the CC0 "Open to Work" template in
// beydemirfurkan/awesome-github-profile.
// Edit the card object below, then run:
// node scripts/build-open-to-work-card.mjs

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'profile');

const card = {
    name: 'Mohammad Montasim Al Mamun Shuvo',
    role: 'AI-First Full-Stack Engineer · Real-Time, AI-Driven Products · React, Next.js, Node.js, TypeScript',
    lookingFor: [
        'Senior frontend or full-stack product roles',
        'Real-time, AI-driven or SaaS products',
        'Remote, hybrid, or on-site in Dhaka',
    ],
    notLookingFor: ['Junior or mid-level roles'],
    facts: [
        ['AVAILABLE', 'After notice'],
        ['TIMEZONE', 'UTC+6 (Dhaka)'],
        ['TYPE', 'Full-time'],
    ],
};

const themes = {
    dark: {
        card: '#0A101F',
        border: 'rgba(255,255,255,0.10)',
        ink: '#F1F5F9',
        body: '#CBD5E1',
        muted: '#64748B',
        rule: 'rgba(255,255,255,0.10)',
        yes: '#00B8B5',
        yesPill: 'rgba(0,184,181,0.12)',
        yesText: '#5EEAD4',
        no: '#EB008B',
        noText: '#94A3B8',
    },
    light: {
        card: '#F7F7F5',
        border: '#E2E2DD',
        ink: '#131316',
        body: '#22222A',
        muted: '#8A8A84',
        rule: '#E2E2DD',
        yes: '#008280',
        yesPill: '#D5F5F4',
        yesText: '#04524F',
        no: '#C50074',
        noText: '#5A5A62',
    },
};

const escape = (text) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SANS = "system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif";
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

// One grid for the whole card: equal padding on every side, two columns for
// the lists, and four fact columns whose third lines up with the second list.
const W = 1200;
const PAD = 64;
const GUTTER = 48;
const INNER = W - PAD * 2;
const COLS = [PAD, PAD + (INNER + GUTTER) / 2];
const FACT_W = (INNER - GUTTER * 3) / 4;
const FACT_X = [0, 1, 2, 3].map((i) => PAD + i * (FACT_W + GUTTER));
const MARKER_GAP = 20;
const LINE_H = 28;

// Vertical rhythm, top to bottom (y values are text baselines unless noted).
const Y = {};
Y.pillTop = PAD;
Y.pillMid = Y.pillTop + 16;
Y.name = Y.pillTop + 32 + 32 + 34;
Y.role = Y.name + 34;
Y.rule1 = Y.role + 30;
Y.label = Y.rule1 + 34;
Y.firstItem = Y.label + 30;
const listRows = Math.max(card.lookingFor.length, card.notLookingFor.length);
Y.rule2 = Y.firstItem + (listRows - 1) * LINE_H + 30;
Y.factLabel = Y.rule2 + 34;
Y.factValue = Y.factLabel + 24;
const H = Y.factValue + PAD - 4;

function build(t) {
    const list = (items, x, marker, color) =>
        items
            .map((item, i) => {
                const y = Y.firstItem + i * LINE_H;
                return `${marker(x, y)}<text x="${x + MARKER_GAP}" y="${y}" fill="${color}">${escape(item)}</text>`;
            })
            .join('\n    ');

    const dot = (x, y) => `<circle cx="${x + 4}" cy="${y - 5}" r="3.5" fill="${t.yes}"/>`;
    const cross = (x, y) =>
        `<path d="M${x} ${y - 9} l8 8 M${x + 8} ${y - 9} l-8 8" stroke="${t.no}" stroke-width="1.6" stroke-linecap="round"/>`;

    const facts = card.facts
        .map(
            ([label, value], i) =>
                `<text x="${FACT_X[i]}" y="${Y.factLabel}" font-size="10" fill="${t.muted}" letter-spacing="2.5">${label}</text><text x="${FACT_X[i]}" y="${Y.factValue}" font-size="16" font-weight="700" fill="${t.ink}">${escape(value)}</text>`,
        )
        .join('\n    ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escape(card.name)}: open to work">
  <title>Open to Work</title>
  <desc>${escape(card.name)} is open to ${escape(card.facts[2][1].toLowerCase())} ${escape(card.lookingFor[0].toLowerCase())}.</desc>
  <defs>
    <linearGradient id="live" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.yes}"/><stop offset="1" stop-color="${t.no}"/>
    </linearGradient>
    <clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18"/></clipPath>
  </defs>

  <g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="${t.card}"/>
  <rect width="${W}" height="5" fill="url(#live)"/>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18" fill="none" stroke="${t.border}"/>

  <!-- The status dot is the one animated element: it is the one fact with a shelf life. -->
  <rect x="${PAD}" y="${Y.pillTop}" width="172" height="32" rx="16" fill="${t.yesPill}" stroke="${t.yes}" stroke-width="1.2"/>
  <circle cx="${PAD + 20}" cy="${Y.pillMid}" r="5" fill="${t.yes}">
    <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <text x="${PAD + 36}" y="${Y.pillMid}" dominant-baseline="central" font-family="${MONO}" font-size="12" font-weight="700" fill="${t.yesText}" letter-spacing="2">OPEN TO WORK</text>

  <text x="${PAD}" y="${Y.name}" font-family="${SANS}" font-size="46" font-weight="800" fill="${t.ink}" letter-spacing="-1.2">${escape(card.name)}</text>
  <text x="${PAD}" y="${Y.role}" font-family="${SANS}" font-size="19" fill="${t.body}">${escape(card.role)}</text>

  <line x1="${PAD}" y1="${Y.rule1}" x2="${W - PAD}" y2="${Y.rule1}" stroke="${t.rule}"/>

  <text x="${COLS[0]}" y="${Y.label}" font-family="${MONO}" font-size="10" fill="${t.yes}" letter-spacing="3.5">LOOKING FOR</text>
  <text x="${COLS[1]}" y="${Y.label}" font-family="${MONO}" font-size="10" fill="${t.no}" letter-spacing="3.5">NOT LOOKING FOR</text>
  <g font-family="${SANS}" font-size="16">
    ${list(card.lookingFor, COLS[0], dot, t.body)}
    ${list(card.notLookingFor, COLS[1], cross, t.noText)}
  </g>

  <line x1="${PAD}" y1="${Y.rule2}" x2="${W - PAD}" y2="${Y.rule2}" stroke="${t.rule}"/>
  <g font-family="${MONO}">
    ${facts}
  </g>
</svg>
`;
}

for (const [name, theme] of Object.entries(themes)) {
    writeFileSync(join(outDir, `open-to-work-${name}.svg`), build(theme));
}
console.log('Wrote open-to-work-dark.svg and open-to-work-light.svg');
