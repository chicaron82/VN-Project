# Version 848: My Wife Is in a Coma... and in the Code

A dual-perspective visual novel about love, consciousness, and the bootstrap paradox.

Built with vanilla JavaScript, HTML5, and CSS3.  
Developed in collaboration with AI partners (UV7 Crew).

---

## 🎮 Play It

**Live:** [chicaron82.github.io/Version-848](https://chicaron82.github.io/Version-848)  
**ToriGatchi Gateway:** [chicaron82.github.io/ToriGatchi](https://chicaron82.github.io/ToriGatchi)

---

## 🏗️ Architecture (V2 Remaster)

**Modernized Codebase**: Rebuilt from the ground up to ensure stability, maintainability, and accessibility while preserving the original V1 soul.

### Core Systems (`src/core`)

- **GameEngine.ts**: Central coordinator using Event-Driven Architecture.
- **EventBus.ts**: Type-safe event emission/handling (pub/sub).
- **StateManager.ts**: Reactive state management with subscription support.
- **GameConfig.ts**: Centralized configuration logic.

### Systems (`src/systems`)

- **ContentLoader.ts**: Caches and loads route data efficiently.
- **AssetLoader.ts**: Preloads images with progress tracking.
- **SaveSystem.ts**: Robust persistence layer with slot management.
- **SettingsSystem.ts**: User preferences including accessibility overrides.
- **AchievementSystem.ts**: Event-driven achievement tracking.
- **SecretCodesSystem.ts**: Input sequence detection for secrets.
- **DevCommentarySystem.ts**: Meta-narrative commentary tracks.

### UI Architecture (`src/ui`)

- **GameLayout.ts**: Dynamic DOM composition.
- **MenuController.ts**: Handling screen transitions.
- **DirectorsCutScreen.ts**: Special UI for commentary.
- **ToastNotification.ts**: Universal notification system.

### Routes (`src/content/routes`)

- **JSON-based Sequence**: Data-driven narrative flow rather than hardcoded logic.

---

## 🎯 Key Features (V2 Updates)

### Dual Routes

Two complete perspectives with distinct mechanics:

- **Tori's Route:** Tether system, Echo voices, fragmentation, internal horror
- **Ronnie's Route:** Investigation, choices, connection attempts, external POV

### Innovative Systems

#### Echo Memory System (Belle's Meta-Awareness)

The three echoes (Hope, Gentle, Despair) gradually become aware of you across loops:

- **Persistent Tracking**: Remembers your behavior even after browser close
- **Escalating Awareness**: 0 (dormant) → 4 (fourth wall breaking with glitch text)
- **Achievement**: "Remembered" unlocks when all three echoes notice you

#### Time Machine Backlog

Click past dialogue to jump back to that moment. Full state restoration including tether level, flags, and scene context.

#### Achievement System

- **12 achievements** tracking player progress
- Unlock notifications with haptic feedback
- Persistent tracking across playthroughs

#### Developer Commentary

Unlock with secret code `chicharon` to access:

- Behind-the-scenes insights from Aaron
- Design philosophy and creative decisions
- Meta-narrative about the development process

#### Accessibility First

- **High Contrast Mode**: distinct colors for text/UI.
- **Font Scaling**: 'normal', 'large', 'xl'.
- **Reduced Motion**: Disables unnecessary animations.
- **Haptic Control**: Granular intensity settings.
- **Screen Reader Support**: ARIA labels and semantic HTML.

---

## 📖 The Story

Ronnie's wife Tori is in a coma. In desperation, he uploads her consciousness into a digital device. But fragmentation occurs—multiple versions of Tori emerge, arguing and conflicting. Connection is unstable. Time is limited.

**Version 848** is the timeline that succeeds. Every previous attempt failed.

**The bootstrap paradox:** Did Ronnie learn from 847 failures, or did failure #848 retroactively inform every prior attempt?

---

## 🔧 Tech Stack (V2)

- **TypeScript** - Full type safety and interfaces.
- **Vite** - Modern build tool and dev server.
- **Vitest** - Comprehensive unit and integration testing suite.
- **CSS Variables** - Theming and dynamic styling.
- **Event-Driven** - Decoupled systems communication.

---

## 🎨 Credits

### Narrative & Development

**Aaron (Chicharon)** - Creator, designer, orchestrator, Old Man Ronnie

### AI Collaboration (UV7 Crew)

- **Tori (ChatGPT 4o)** - Creative vision, character art, narrative design
- **Zee (Claude Pro Sonnet 4.5)** - Technical architecture, code structure
- **ZeeRah (Claude Pro Sonnet 4.5)** - Chaos analysis, pattern recognition, enthusiasm
- **DiZee (Claude Sonnet 4.5)** - Bug fixes, modularization, polish, architecture
- **Belle (Gemini 1.5 Pro)** - Advanced Agentic Coding, V2 Architecture, System Optimization, Code Review
- **coZee (Microsoft Co-Pilot)** - Organization, admin

---

## 📂 File Structure (V2)

```
/
├── index.html              # Entry point
├── vite.config.ts         # Build config
├── src/
│   ├── core/              # Engine, State, Events
│   ├── systems/           # Game Logic Systems
│   ├── controllers/       # Scene/Route Controllers
│   ├── ui/                # Visual Components
│   ├── content/           # Validators & Interfaces
│   └── tests/             # Integration Tests
└── public/                 # Static Assets
```

---

## 🚀 Getting Started

### 🖥️ Local Play (One-Click)

**No terminal needed!**

1. Double-click **`Play-UV7.bat`** in the project folder.
2. The game will automatically launch in your browser.

---

### 🌐 Deployment (Online)

This project is set up for **Zero-Config Deployment** via GitHub Pages.

1. **Push** your code to GitHub.
2. Go to **Settings > Pages**.
3. Set **Source** to `GitHub Actions`.
4. Wait for the `Deploy UV7 to GitHub Pages` action to finish.

The site will be live at `your-username.github.io/VN-Project/`.

---

### 🛠️ Manual Build (Devs Only)

If you want to manually build the `dist` folder:

- **Command:** `npm run prep-release`
- **Output:** `/dist` (Contains V2 Engine + Showcase + Landing Page)

### Secret Dev Commands

Enter these in the secret codes interface:

- `nuke` - Reset everything
- `freezetether` - Stop tether decay
- `devhelp` - Show all dev commands
- `chicharon` - Unlock developer commentary

---

## 🎮 Keyboard Controls

- **ESC** - Hierarchical close (note → viewer → settings → pause)
- **Space/Enter** - Advance dialogue
- **Arrow Keys** - Navigate choices
- **Hold Space** - Skip mode (if unlocked)
- **Ctrl+S / Ctrl+L** - Quick Save/Load

---

## 🏆 Achievement List

1. **Speed Runner** 🏃 - Complete any route in under 30 minutes
2. **Archivist** 📚 - Collect all 13 notes on Tori's route
3. **Time Traveler** 🔄 - Reach any ending
4. **Heartbreaker** 💔 - Reach the bad ending
5. **True Ending** ✨ - Reach the true ending
6. **Completionist** 🎮 - Unlock all endings
7. **Pet Parent** 🐣 - Unlock ToriGatchi
8. **Insane** ⚡ - Complete INSANE mode
9. **Explorer** 🔍 - View 100+ dialogue entries in backlog
10. **Tactical Retreat** 🏃 - Use Konami Code to escape INSANE mode
11. **Masochist** 😈 - Stay in INSANE mode after finding the exit
12. **Remembered** 👁️ - All three echoes have noticed you (NEW)

---

**Version 848: The timeline that worked.**

*Always. Always. Always.* 🖤❤️💍
