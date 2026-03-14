#!/usr/bin/env node
// auto-blog-entry.js — chicharons-kitchen AI blog writer
// Triggered by GitHub Actions on push to main.
// Generates a BlogEntry TypeScript file from commit context using OpenAI gpt-4o-mini.
// Exits gracefully (code 0) if OPENAI_API_KEY is not set.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ──────────────────────────────────────────────────────────────────

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COMMIT_SHA = process.env.COMMIT_SHA || 'unknown';
const COMMIT_MESSAGE = process.env.COMMIT_MESSAGE || 'no message';
const COMMIT_AUTHOR = process.env.COMMIT_AUTHOR || 'unknown';
const COMMIT_DATE = process.env.COMMIT_DATE || new Date().toISOString();
const CHANGED_FILES = process.env.CHANGED_FILES || '';
const SOURCE_REPO = process.env.SOURCE_REPO || 'chicharons-kitchen';

// ── Guards ───────────────────────────────────────────────────────────────────

if (!OPENAI_API_KEY) {
    console.log('⚠️  OPENAI_API_KEY not set — skipping auto-blog entry generation.');
    console.log('    Add the secret in: Settings → Secrets and variables → Actions');
    process.exit(0);
}

// Skip merge commits and bot commits
if (COMMIT_MESSAGE.startsWith('Merge ') || COMMIT_AUTHOR.includes('github-actions')) {
    console.log('⏭️  Skipping auto-blog for merge/bot commit.');
    process.exit(0);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60);
}

function getEntryPath(slug, dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return path.resolve(__dirname, `../entries/${year}/${month}/${slug}.ts`);
}

function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function entryToTypeScript(entry) {
    const json = JSON.stringify(entry, null, 4);
    // Convert JSON to TS object literal (remove quotes from keys)
    const tsObj = json.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:/g, '$1:');
    return `import type { BlogEntry } from '../../types';

export const entry: BlogEntry = ${tsObj};
`;
}

// ── OpenAI Call ───────────────────────────────────────────────────────────────

const systemPrompt = `You are the voice of chicharons-kitchen — a dev journal with personality.
Write entries like a chef narrating their kitchen sessions: vivid, technical, grounded.
Use kitchen/cooking metaphors naturally: commits are dishes, bugs are burnt sauce, features are recipes.
The tone is warm, a little dramatic, always honest about what worked and what didn't.
Crew members: dizee (TypeScript, architecture), belle (UI/UX), tori (QA), genzee (DevOps), cozee (new kid).

IMPORTANT: Return ONLY valid JSON matching the BlogEntry interface. No markdown, no explanation.
The JSON must be parseable with JSON.parse().`;

const userPrompt = `Generate a blog entry for this commit:

Repository: ${SOURCE_REPO}
Commit: ${COMMIT_SHA.slice(0, 7)}
Author: ${COMMIT_AUTHOR}
Date: ${COMMIT_DATE}
Message: ${COMMIT_MESSAGE}
Changed files:
${CHANGED_FILES}

Return a JSON object with these fields (all optional except id, title, type):
{
  "id": "slug-based-unique-id",
  "date": "Mon DD, YYYY",
  "sortDate": "YYYY-MM-DDTHH:mm:ss",
  "emoji": "single emoji",
  "title": "engaging title for the entry",
  "type": "highlight|milestone|fix|architecture|note",
  "tags": ["tag1", "tag2", "${SOURCE_REPO}"],
  "modelId": "copilot",
  "summary": "2-3 sentence narrative summary in chicharons-kitchen voice",
  "highlights": ["key point 1", "key point 2"],
  "callout": { "icon": "emoji", "title": "short title", "text": "insight or quote" }
}

Rules:
- Always include "${SOURCE_REPO}" in tags
- Set modelId to "copilot"
- Keep summary under 300 characters
- Write in first-person kitchen voice`;

async function generateEntry() {
    console.log(`🍳 Generating blog entry for: ${COMMIT_MESSAGE.slice(0, 60)}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 800
        })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error(`❌ OpenAI API error ${response.status}: ${err}`);
        process.exit(0); // Graceful exit — don't fail the build
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        console.error('❌ No content in OpenAI response');
        process.exit(0);
    }

    // Parse the JSON response
    let entry;
    try {
        // Strip markdown code fences if present
        const cleaned = content.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
        entry = JSON.parse(cleaned);
    } catch (e) {
        console.error('❌ Failed to parse OpenAI response as JSON:', e.message);
        console.error('Raw response:', content.slice(0, 500));
        process.exit(0);
    }

    // Ensure required fields
    if (!entry.id) entry.id = slugify(COMMIT_MESSAGE) + '-' + COMMIT_SHA.slice(0, 7);
    if (!entry.title) entry.title = COMMIT_MESSAGE;
    if (!entry.sortDate) entry.sortDate = COMMIT_DATE;
    if (!entry.modelId) entry.modelId = 'copilot';
    if (!entry.tags) entry.tags = [SOURCE_REPO];
    else if (!entry.tags.includes(SOURCE_REPO)) entry.tags.push(SOURCE_REPO);

    // Write the entry file
    const slug = slugify(entry.id);
    const filePath = getEntryPath(slug, entry.sortDate || COMMIT_DATE);
    ensureDir(filePath);

    if (fs.existsSync(filePath)) {
        console.log(`⏭️  Entry already exists: ${filePath}`);
        process.exit(0);
    }

    const tsContent = entryToTypeScript(entry);
    fs.writeFileSync(filePath, tsContent);
    console.log(`✅ Written: ${filePath}`);

    // Regenerate the index
    try {
        execSync('npm run generate:timeline', {
            cwd: path.resolve(__dirname, '..'),
            stdio: 'inherit'
        });
        console.log('✅ Index regenerated');
    } catch (e) {
        console.error('⚠️  generate:timeline failed:', e.message);
        // Don't fail — the file was written successfully
    }
}

generateEntry().catch(e => {
    console.error('❌ Unexpected error:', e.message);
    process.exit(0); // Always exit gracefully
});
