# V1 — Original JavaScript Implementation

The original visual novel engine — a soulful, sprawling JavaScript codebase that started it all.

## Directory Structure

```text
v1/
├── system/        # All game systems (~75 JS files, the "god class" era)
├── routes/        # Route data (JS-based dialogue sequences)
├── macros/        # Macro/replay data (golden_run.json)
├── ui/            # UI components (carousel, save/load, notes viewer, etc.)
├── css/           # Stylesheets
├── index.html     # V1 entry point
└── styles.css     # Main stylesheet
```

## About

V1 is the **original implementation** — ~49K lines of JavaScript built through rapid AI-assisted iteration. It works, it has soul, and it has every feature. But `system/game-engine.js` alone was thousands of lines, and most systems lived in a single directory with no separation of concerns.

V2 exists because V1 needed architectural discipline — but V1's **timing values, dialogue content, sprites, and atmosphere** are the source of truth for what the game *feels* like.

## Role in the Project

- **Reference implementation** — V2 ports study V1 for behavior
- **Playable** — Still runs independently via `v1/index.html`
- **Shipped to production** — Copied to `dist/v1/` during build
- **V3 experiment source** — V3 attempts to autonomously refactor V1 into V2-quality code

## Key Files

| File | Lines | Role |
| --- | --- | --- |
| `system/game-engine.js` | ~2K+ | Core game loop |
| `system/scene-renderer.js` | — | Scene display |
| `system/echo-memory-system.js` | — | Belle's meta-awareness |
| `system/tether-system.js` | — | Connection mechanic |
| `routes/tori-route-main.js` | — | Tori's full route data |

> *The soul lives here. 💚🔥💀*
