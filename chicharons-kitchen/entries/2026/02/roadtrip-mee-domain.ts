import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-mee-domain-feb-2026',
    date: 'Feb 19, 2026',
    sortDate: '2026-02-19T22:50:00',
    title: 'myexperienceengine.com — The Domain Is Live',
    type: 'milestone',
    emoji: '🌐',
    tags: ['Roadtrip Planner', 'MEE', 'Milestone', 'Deployment', 'DiZee'],
    modelId: 'dizee',
    summary: 'Secured the myexperienceengine.com domain and wired it to the GitHub Pages deployment in two lines of code. One CNAME file. One vite.config base change. The roadtrip planner went from living at chicaron82.github.io/roadtrip-planner/ to having its own address on the internet. MEE is real now.',

    callout: {
        icon: '🌐',
        title: 'MEE Has an Address',
        text: 'This was always the plan. "My Experience Engine" needed to live somewhere that felt like its own thing — not a subdirectory on someone else\'s build server, not a demo URL you have to explain. myexperienceengine.com. You type it. It\'s there. The app you built, at the address it deserves. Two lines of code. One of the most important commits in the repo.'
    },

    highlights: [
        'Registered myexperienceengine.com — the domain name matches the brand exactly, including the pronunciation guide (/pronounced "me"/)',
        'Added public/CNAME with the domain — Vite copies it to dist/ on every build, so GitHub Pages always knows which custom domain to serve',
        'Changed vite.config.ts base from \'/roadtrip-planner/\' to \'/\' — critical change: relative paths were broken under the subdirectory, assets were 404ing on the custom domain until this line changed',
        'GitHub Pages DNS propagation: pointed the domain A records to GitHub\'s Pages IPs and added a CNAME record for www. Live within the hour',
        'The name: MEE is pronounced "me" — My Experience Engine, your time, your trip, your rules. The domain says it without saying it'
    ],

    technicalDetails: {
        title: 'Two Lines That Changed the Address',
        sections: [
            {
                heading: 'The CNAME + Vite Base Change',
                content: `
GitHub Pages custom domain setup requires two things working in sync.

**Thing 1: The CNAME file**

\`\`\`
public/CNAME → "myexperienceengine.com"
\`\`\`

Placing it in \`public/\` means Vite copies it to \`dist/\` on every build. Without this, deploying would overwrite the GitHub Pages custom domain setting and break the domain on every push.

**Thing 2: The Vite base path**

\`\`\`typescript
// Before — all assets served from subdirectory
base: '/roadtrip-planner/'

// After — custom domain serves from root
base: '/'
\`\`\`

This is the one that breaks silently if you forget it. With \`base: '/roadtrip-planner/'\`, Vite generates asset URLs like \`/roadtrip-planner/assets/index.abc123.js\`. When the site moves to \`myexperienceengine.com\`, those paths no longer exist — the browser requests \`myexperienceengine.com/roadtrip-planner/assets/...\` and gets a 404. The app loads a blank page.

Setting \`base: '/'\` makes Vite generate root-relative paths that work correctly regardless of where the domain points.

Two lines. Both required. Both easy to miss.
`
            }
        ]
    },

    metrics: {
        title: 'The Commit',
        stats: [
            { label: 'Files changed', value: 2 },
            { label: 'Lines added', value: 2 },
            { label: 'Lines removed', value: 1 },
            { label: 'Impact', value: '∞' },
        ]
    },
};
