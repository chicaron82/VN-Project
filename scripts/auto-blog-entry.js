#!/usr/bin/env node
/**
 * auto-blog-entry.js
 *
 * Generates a blog entry TypeScript file for a git commit using the OpenAI API.
 *
 * Required env vars:
 *   OPENAI_API_KEY   - OpenAI API key (from repo secrets)
 *   COMMIT_SHA       - Full commit SHA
 *   COMMIT_MESSAGE   - Commit message
 *   COMMIT_AUTHOR    - Author name
 *   COMMIT_DATE      - ISO date string
 *   CHANGED_FILES    - Newline-separated list of changed file paths
 *
 * Writes to: showcase/data/blog/entries/YYYY/MM/<slug>.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ──────────────────────────────────────────────────────────────────

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COMMIT_SHA = process.env.COMMIT_SHA || 'unknown';
const COMMIT_MESSAGE = process.env.COMMIT_MESSAGE || 'chore: update';
const COMMIT_AUTHOR = process.env.COMMIT_AUTHOR || 'unknown';
const COMMIT_DATE = process.env.COMMIT_DATE || new Date().toISOString();
const CHANGED_FILES = process.env.CHANGED_FILES || '';

const ENTRIES_DIR = path.resolve(__dirname, '../showcase/data/blog/entries');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a commit message into a URL-safe slug.
 * e.g. "feat(phase13X): Add blog system 🔥" → "feat-phase13x-add-blog-system"
 */
function makeSlug(message) {
    return message
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // strip non-alphanumeric (removes emoji etc.)
        .trim()
        .replace(/\s+/g, '-')         // spaces → hyphens
        .replace(/-+/g, '-')          // collapse multiple hyphens
        .slice(0, 60)                 // max length
        .replace(/-$/, '');           // strip trailing hyphen
}

/**
 * Format a JS Date as "Mar 14, 2026"
 */
function formatDate(isoDate) {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Build the path for the entry file, appending a timestamp suffix if the file already exists.
 */
function resolveEntryPath(date, slug) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dir = path.join(ENTRIES_DIR, String(year), month);
    fs.mkdirSync(dir, { recursive: true });

    let filePath = path.join(dir, `${slug}.ts`);
    if (fs.existsSync(filePath)) {
        const suffix = Date.now();
        filePath = path.join(dir, `${slug}-${suffix}.ts`);
    }
    return filePath;
}

/**
 * Render a TimelineEntry object as a .ts file.
 */
function renderEntryFile(entry) {
    // Escape backticks inside string values so the template literal stays valid.
    const json = JSON.stringify(entry, null, 4)
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');

    return `import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = ${json};
`;
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────

async function callOpenAI(commitMessage, author, date, sha, changedFiles) {
    const formattedDate = formatDate(date);
    const shortSha = sha.slice(0, 7);
    const fileList = changedFiles
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean)
        .slice(0, 20) // keep prompt size reasonable
        .join(', ');

    const systemPrompt = `You are the AI chronicler for VN-Project — a meta-narrative visual novel dev blog. \
Every commit gets a blog entry written in the voice of a passionate dev who runs the kitchen like a Michelin-star chef. \
Write in first-person plural ("we", "the crew", "the kitchen"). \
Use food/cooking metaphors naturally: "mise en place", "plating", "the kitchen was on fire", "we seasoned the codebase", "the session", etc. \
Be punchy, technical, with personality. Reference "848" (the sacred loop number) and the codebase soul where fitting. \
Never be dry or corporate. Every entry should feel like a dev journal from a team that actually cares.`;

    const userPrompt = `Write a blog entry for this git commit. Return ONLY a valid JSON object — no markdown fences, no extra text.

Commit info:
- SHA: ${shortSha}
- Message: ${commitMessage}
- Author: ${author}
- Date: ${formattedDate}
- Changed files: ${fileList || 'not specified'}

The JSON must match this TypeScript interface (use only these fields):
{
  "id": string,          // unique slug, e.g. "auto-blog-${shortSha}"
  "title": string,       // human-readable title
  "date": string,        // e.g. "${formattedDate}"
  "sortDate": string,    // ISO 8601, e.g. "${new Date(date).toISOString().slice(0, 19)}"
  "type": string,        // highlight=notable feature, milestone=major achievement, fix=bug fix, architecture=structural change, order-entry=routine maintenance
  "emoji": string,       // single emoji that captures the session vibe
  "tags": string[],      // 2–5 relevant tags
  "modelId": "copilot",  // always "copilot" for auto-blog entries
  "summary": string,     // one paragraph, narrative dev-journal voice
  "highlights": string[], // 3–6 bullet strings, each starting with bold **Thing** — description
  "callout": {
    "icon": string,
    "title": string,
    "text": string        // punchy one-liner about the session vibe
  },
  "footer": {
    "icon": string,
    "text": string        // closing note, brief
  },
  "status": "completed"
}

Write in the voice of the kitchen crew. Make it feel alive.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.8,
            max_tokens: 1200,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    return content.trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    // Bail gracefully if no API key
    if (!OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY is not set — skipping auto-blog generation.');
        process.exit(0);
    }

    // Skip trivial commit messages
    const trivialPatterns = [
        /^merge\b/i,
        /^initial commit/i,
        /^wip\b/i,
        /^auto-blog:/i,     // our own commits — belt-and-suspenders guard
        /^📝 auto-blog:/,  // same with emoji prefix (as written by the workflow)
    ];
    if (trivialPatterns.some(p => p.test(COMMIT_MESSAGE.trim()))) {
        console.log('ℹ️  Skipping trivial commit — generating minimal entry.');
        const slug = makeSlug(COMMIT_MESSAGE) || `commit-${COMMIT_SHA.slice(0, 7)}`;
        const filePath = resolveEntryPath(COMMIT_DATE, slug);
        const minimalEntry = {
            id: slug,
            title: COMMIT_MESSAGE.slice(0, 80),
            date: formatDate(COMMIT_DATE),
            sortDate: new Date(COMMIT_DATE).toISOString().slice(0, 19),
            type: 'fix',
            emoji: '🔧',
            tags: ['Maintenance'],
            modelId: 'copilot',
            summary: `Routine maintenance commit by ${COMMIT_AUTHOR}: ${COMMIT_MESSAGE}`,
            highlights: [`**Commit** — ${COMMIT_SHA.slice(0, 7)}`],
            callout: { icon: '🔧', title: 'Maintenance', text: 'Small but necessary kitchen work.' },
            footer: { icon: '✅', text: 'Committed and shipped.' },
            status: 'completed',
        };
        fs.writeFileSync(filePath, renderEntryFile(minimalEntry), 'utf8');
        console.log(`✅ Minimal entry written to ${filePath}`);
        return;
    }

    console.log(`🤖 Generating blog entry for: "${COMMIT_MESSAGE}"`);

    let rawJson;
    try {
        rawJson = await callOpenAI(COMMIT_MESSAGE, COMMIT_AUTHOR, COMMIT_DATE, COMMIT_SHA, CHANGED_FILES);
    } catch (err) {
        console.error('❌ OpenAI call failed:', err.message);
        process.exit(1);
    }

    // Strip any accidental markdown code fences
    const cleaned = rawJson
        .replace(/^```(?:json|typescript|ts)?\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

    let entry;
    try {
        entry = JSON.parse(cleaned);
    } catch (err) {
        console.error('❌ Failed to parse JSON from OpenAI response:\n', cleaned);
        process.exit(1);
    }

    // Always override modelId
    entry.modelId = 'copilot';

    // Ensure status is present
    if (!entry.status) entry.status = 'completed';

    // Derive slug from id or commit message
    const slug = makeSlug(entry.id || COMMIT_MESSAGE) || `commit-${COMMIT_SHA.slice(0, 7)}`;
    const filePath = resolveEntryPath(COMMIT_DATE, slug);

    fs.writeFileSync(filePath, renderEntryFile(entry), 'utf8');
    console.log(`✅ Blog entry written to ${filePath}`);
}

main().catch(err => {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
});
