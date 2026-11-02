// Builds assets/profile/profile-{dark,light}.svg: a terminal-style profile card
// with the ASCII portrait on the left and profile details on the right.
// Run: node scripts/build-profile-card.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'profile');

const portrait = readFileSync(join(outDir, 'portrait.txt'), 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter((line, i, all) => i < all.length - 1 || line.trim());

const sections = [
    {
        title: 'SYSTEM.INFO',
        rows: [
            ['Subject', 'Mohammad Montasim Al Mamun Shuvo'],
            ['Role', 'Senior Software Engineer @ MyMedicalHub'],
            ['Venture', 'Co-Founder @ Qubrel'],
            ['Origin', 'Dhaka, Bangladesh'],
            ['Builds', 'Real-time apps · Extensions · Dev tools · SaaS'],
            ['Workflow', 'AI-first with Claude Code and Codex'],
        ],
    },
    {
        title: 'STACK',
        rows: [
            ['Core.Lang', 'TypeScript, JavaScript, SQL'],
            ['Core.Frontend', 'React, Next.js, Redux Toolkit, Tailwind CSS'],
            ['Core.Backend', 'Node.js, NestJS, Express, Socket.IO'],
            ['Core.Data', 'PostgreSQL, MongoDB, Redis, Prisma'],
            ['Core.Realtime', 'WebRTC, MediaPipe, Canvas'],
            ['Core.Infra', 'Azure, Docker, GitHub Actions'],
        ],
    },
    {
        title: 'CONTACT',
        rows: [
            ['Grid.Web', 'montasim.dev'],
            ['Grid.Mail', 'montasimmamun@gmail.com'],
            ['Grid.LinkedIn', 'in/montasim'],
        ],
    },
];

const themes = {
    dark: {
        frame: '#070B16',
        panelTop: '#0A101F',
        panelBottom: '#0C1426',
        bar: '#0B1222',
        divider: 'rgba(255,255,255,0.10)',
        muted: '#64748B',
        key: '#00B8B5',
        value: '#E2E8F0',
        heading: '#EB008B',
        ascii: ['#00B8B5', '#38BDF8', '#EB008B'],
        mapBg: 'rgba(255,255,255,0.02)',
        // portrait.txt is drawn as dark ink; light glyphs on a dark panel need the ramp flipped.
        invertPortrait: true,
    },
    light: {
        frame: '#E2E8F0',
        panelTop: '#FFFFFF',
        panelBottom: '#F8FAFC',
        bar: '#F1F5F9',
        divider: 'rgba(15,23,42,0.10)',
        muted: '#64748B',
        key: '#008280',
        value: '#0F172A',
        heading: '#C50074',
        ascii: ['#008280', '#0369A1', '#C50074'],
        mapBg: 'rgba(15,23,42,0.03)',
    },
};

const escape = (text) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Same ramp the portrait was sampled with; spaces (the photo background) stay blank.
const RAMP = '.:-=+*#%@';
const invertRamp = (line) =>
    [...line]
        .map((char) => {
            const i = RAMP.indexOf(char);
            return i === -1 ? char : RAMP[RAMP.length - 1 - i];
        })
        .join('');

const W = 1180;
const H = 610;
const MAP = { x: 36, y: 84, w: 400, h: 492 };
const INFO_X = 476;
const VALUE_X = 640;
const ROW_H = 25;

function build(t) {
    const asciiLineH = (MAP.h - 24) / portrait.length;
    const ascii = portrait
        .map((line) => (t.invertPortrait ? invertRamp(line) : line))
        .map((line, i) => {
            const y = (MAP.y + 16 + i * asciiLineH).toFixed(1);
            return `<text x="${MAP.x + 2}" y="${y}" textLength="${MAP.w - 4}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${escape(line)}</text>`;
        })
        .join('\n');

    let y = 100;
    let step = 0;
    const info = [];
    const reveal = () => `opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(0.3 + step++ * 0.08).toFixed(2)}s" dur="0.3s" fill="freeze"/`;

    for (const section of sections) {
        info.push(
            `<g ${reveal()}><text x="${INFO_X}" y="${y}" font-size="13" font-weight="700" letter-spacing="2" fill="${t.heading}">${section.title}</text><line x1="${INFO_X + section.title.length * 10 + 12}" y1="${y - 4}" x2="${W - 40}" y2="${y - 4}" stroke="${t.divider}"/></g>`,
        );
        y += ROW_H + 2;
        for (const [key, value] of section.rows) {
            info.push(
                `<g ${reveal()}><text x="${INFO_X}" y="${y}" font-size="14" fill="${t.key}">${escape(key)}</text><text x="${VALUE_X}" y="${y}" font-size="14" fill="${t.value}">${escape(value)}</text></g>`,
            );
            y += ROW_H;
        }
        y += 12;
    }

    const [a1, a2, a3] = t.ascii;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace" role="img" aria-label="Montasim: profile.sh --live">
<defs>
<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${a1}"><animate attributeName="stop-color" values="${a1};${a3};${a2};${a1}" dur="10s" repeatCount="indefinite"/></stop>
<stop offset="1" stop-color="${a3}"><animate attributeName="stop-color" values="${a3};${a2};${a1};${a3}" dur="10s" repeatCount="indefinite"/></stop>
</linearGradient>
<linearGradient id="asciiGrad" x1="0" y1="${MAP.y}" x2="0" y2="${MAP.y + MAP.h}" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="${a1}"/>
<stop offset="0.5" stop-color="${a2}"/>
<stop offset="1" stop-color="${a3}"/>
<animateTransform attributeName="gradientTransform" type="translate" values="0 -120; 0 120; 0 -120" dur="9s" repeatCount="indefinite"/>
</linearGradient>
<linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.panelTop}"/><stop offset="1" stop-color="${t.panelBottom}"/></linearGradient>
<clipPath id="win"><rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="18"/></clipPath>
</defs>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="18" fill="${t.frame}"/>
<g clip-path="url(#win)">
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" fill="url(#panel)"/>
<rect x="2" y="2" width="${W - 4}" height="46" fill="${t.bar}"/>
<rect x="2" y="47" width="${W - 4}" height="2" fill="url(#accent)"/>
<circle cx="30" cy="25" r="5.5" fill="#ff5f56"/>
<circle cx="50" cy="25" r="5.5" fill="#ffbd2e"/>
<circle cx="70" cy="25" r="5.5" fill="#27c93f"/>
<text x="${W / 2}" y="29" text-anchor="middle" font-size="12" fill="${t.muted}">montasim@dhaka: ~/profile</text>
<text x="${MAP.x}" y="72" font-size="13" fill="${t.muted}">montasim@dhaka ~ % <tspan fill="${t.value}">./profile.sh --live</tspan><tspan fill="${t.key}">▌<animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></tspan></text>
<rect x="${MAP.x}" y="${MAP.y}" width="${MAP.w}" height="${MAP.h}" rx="10" fill="${t.mapBg}" stroke="${t.divider}"/>
<g font-size="9" fill="url(#asciiGrad)">
${ascii}
</g>
<line x1="${INFO_X - 18}" y1="${MAP.y}" x2="${INFO_X - 18}" y2="${MAP.y + MAP.h}" stroke="${t.divider}"/>
${info.join('\n')}
</g>
</svg>
`;
}

for (const [name, theme] of Object.entries(themes)) {
    writeFileSync(join(outDir, `profile-${name}.svg`), build(theme));
}
console.log('Wrote profile-dark.svg and profile-light.svg');
