# Showcase — Timeline, Blog & Portfolio

The public-facing showcase site: a development timeline, blog, lab experiments, and project portfolio for Version 848.

## Directory Structure

```text
showcase/
├── core/              # App state, main entry, tab/view/swipe controllers
├── components/        # UI sections (Hero, Home, Journey, Evolution, etc.)
├── controllers/       # Interaction controllers (Home, Banner, BougieTracker)
├── features/          # Blog system, search, Echo system
├── data/              # Blog entries, code snippets, lab entries
├── css/               # Stylesheets
├── styles/            # Additional style modules
├── effects/           # Visual effects
├── types/             # TypeScript type definitions
├── utils/             # Analytics, confetti, content features, stats loader
├── media/             # Images and media assets
├── v3-lab/            # V3 experiment showcase
├── index.html         # Standalone entry point
└── stats.json         # Generated project statistics
```

## Key Sections

- **Home** — Project overview with interactive elements
- **Journey** — Development timeline with filterable entries
- **Evolution** — V1 → V2 code comparison
- **Spotlight** — Feature deep-dives
- **Blog** — Organized posts by year/month
- **Lab** — Experimental features and prototypes

## Stats Generation

```bash
npm run stats          # Generate stats.json from codebase analysis
```

> *848 is sacred. 💚🔥💀*
