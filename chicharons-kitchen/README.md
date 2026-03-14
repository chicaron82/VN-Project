# 🍳 chicharon's kitchen

> *every commit, a new dish*

A standalone dev journal blog — beautifully rendered, automatically updated. The blog IS the product.

## What is this?

chicharon's kitchen is a living development journal that documents the making of [UV7 Visual Novel](https://github.com/chicaron82/VN-Project) and related projects. Every commit to any tracked repo can automatically generate a blog entry via AI, written in the voice of the kitchen crew.

118 entries and counting. 💚

## Tech Stack

- **Vite** — lightning-fast builds and dev server
- **TypeScript** — full type safety
- **Glassmorphism CSS** — dark theme, backdrop blur, animated cards
- **GitHub Pages** — static deployment, no backend
- **GitHub Actions** — auto-blog on every push

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build |
| `npm run generate:timeline` | Regenerate `entries/index.ts` from all entry files |
| `npm run typecheck` | TypeScript type check only |

## Adding Blog Entries

### Automatically (via GitHub Actions)

Push any commit to `main`. If `OPENAI_API_KEY` is set in repository secrets, the `auto-blog` workflow will:

1. Analyse the commit message and changed files
2. Call `gpt-4o-mini` to generate a narrative blog entry
3. Write the entry to `entries/YYYY/MM/slug.ts`
4. Regenerate `entries/index.ts`
5. Commit and push the new entry

**Setup:** Go to **Settings → Secrets and variables → Actions** and add `OPENAI_API_KEY`.

### Manually

Create a new file in `entries/YYYY/MM/your-slug.ts`:

```typescript
import type { BlogEntry } from '../../types';

export const entry: BlogEntry = {
    id: 'your-slug-unique-id',
    date: 'Mar 14, 2026',
    sortDate: '2026-03-14T12:00:00',
    emoji: '🍳',
    title: 'Your Entry Title',
    type: 'note',
    tags: ['your-tag'],
    modelId: 'dizee',
    summary: 'What happened in this session.',
};
```

Then run `npm run generate:timeline` to rebuild the index.

## Deployment

The `publish` workflow deploys automatically on every push to `main`:

1. Install deps → regenerate index → type-check → build
2. Deploy `dist/` to GitHub Pages

**Setup:** Enable GitHub Pages in **Settings → Pages → Source: GitHub Actions**.

## Crew

| Handle | Role |
|--------|------|
| `dizee` | TypeScript, architecture |
| `belle` | UI/UX |
| `tori` | QA |
| `genzee` | DevOps |
| `cozee` | New kid on the block |
| `copilot` | Auto-blog AI writer |

---

*Built with love. 💚🔥💀*
