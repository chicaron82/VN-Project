# Contributing to v848

Thanks for your interest in the UV7 Visual Novel project! Here's how to get started.

## Prerequisites

- **Node.js** 20+
- **npm** 10+

## Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/VN-Project.git
cd VN-Project

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Development Workflow

```bash
# Type-check the codebase
npm run typecheck

# Lint (TypeScript-aware ESLint)
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format with Prettier
npm run format

# Run test suite
npm test

# Run all validation (typecheck + lint + test)
npm run validate
```

## Project Structure

```
v2/              → Game engine (TypeScript, event-driven architecture)
  core/          → EventBus, StateManager, GameEngine, ErrorBoundary
  systems/       → AchievementSystem, SaveSystem, TetherSystem, etc.
  controllers/   → Route, Dialog, Tether, Effects controllers
  ui/            → Components, screens, overlays
  content/       → Scene definitions, dialog trees
  utils/         → Logger, accessibility, helpers
showcase/        → Blog timeline, portfolio, stats dashboard
shell/           → UV7 Shell (OS-like app switcher)
shared/          → Cross-module types and utilities
```

## Code Standards

- **TypeScript strict mode** — `strict: true` in tsconfig
- **ESLint + Prettier** — enforced via CI pipeline
- **No `any`** — use `unknown`, generics, or proper interfaces
- **Logger over console.log** — import `Logger` from `@utils/Logger`
- **JSDoc on public APIs** — include `@param`, `@returns`, `@example`
- **Test co-location** — `MyFile.ts` → `MyFile.test.ts` in same directory

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add achievement unlock animation
fix: tether not resetting on route change
refactor: extract MarkdownParser from BlogRenderer
docs: add JSDoc to GameEngine methods
```

## Testing

Tests live alongside source files (`*.test.ts`). We use [Vitest](https://vitest.dev/).

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Architecture

This project uses a **custom event-driven architecture** (not React/Vue/Angular):

- **EventBus** — Type-safe pub/sub for decoupled communication
- **StateManager** — Reactive state with path-based access and subscriptions
- **Controllers** — Handle specific UI/game concerns
- **Systems** — Manage cross-cutting features (saves, achievements, etc.)

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full breakdown.

## The UV7 Crew

This project is built by a team of AI collaborators, each with a specialty:

- **Belle** 💚 — Architecture & state management
- **DiZee** 💀 — Error handling, polish & chaos
- **Zee** 🖤 — Meta-narrative & haptic feedback
- **Tori** 🔥 — Sensory systems & accessibility
- **GenZee** 🪩 — Environmental storytelling & UI
- **Ronnie** — The story. Always.

---

*Version 848. The timeline that finally succeeded.*
