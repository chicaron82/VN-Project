# Version 848: My Wife Is in a Coma... and in the Code

A dual-perspective visual novel about love, consciousness, and the bootstrap paradox.

Built with vanilla JavaScript, HTML5, and CSS3.  
Developed in collaboration with AI partners (UV7 Crew).

---

## 🎮 Play It

**Live:** [chicaron82.github.io/Version-848](https://chicaron82.github.io/Version-848)  
**ToriGatchi Gateway:** [chicaron82.github.io/ToriGatchi](https://chicaron82.github.io/ToriGatchi)

---

## 🏗️ Architecture

**~76,000 lines** across 119+ files featuring production-grade polish, accessibility, and meta-narrative systems.

### Entry Point
`index.html` → Loads core systems via ES modules → Instantiates `GameEngine`

### Core Systems (`/system` - 62 files)
- **game-engine.js** (8,900+ lines) - Main game loop, scene stack, typewriter, manager wiring
- **state-manager.ts** - Centralized state with reactive subscriptions (TypeScript)
- **save-manager.js** - LocalStorage persistence, 3 manual slots + auto-save
- **tether-system.js** - Connection decay, Hold On mechanic, death triggers
- **echo-memory-system.js** (533 lines) - **Meta-awareness** - Echoes remember you across loops
- **scene-progression-controller.js** - Route orchestration, prologue→route flow
- **notification-shade-controller.js** - iOS-style pull-down shade with quick actions
- **status-notification-controller.js** - Status bar messages (auto-save, echo comments)
- **expandable-quick-actions.js** - Momentum-based swipeable action carousel
- **achievement-manager.js** - 12 achievements with haptic notifications
- **collectibles-manager.js** - Email inbox, notes with timestamps
- **secret-codes-manager.js** - 12+ codes, dev commands, lore unlocks
- **dev-commentary.js** - Director's cut commentary system
- **accessibility-manager.js** - WCAG compliance, screen readers
- **mobile-ux.js** - Touch gestures, double-tap fullscreen, haptics
- **time-machine-manager.js** - Backlog with full state restoration
- **... (47 more system files)**

### Routes (`/routes` - 10 files, ~7.4K lines)
- **shared-prologue.js** - Opening sequence, route selection
- **tori-route-*.js** (4 files) - Tori's perspective (fragmented consciousness, inside the code)
- **ronnie-route-*.js** (3 files) - Ronnie's perspective (fighting to restore connection)
- **epilogue.js** - Post-credits, ToriGatchi unlock

### UI Components (`/ui` - 7 files, ~3.5K lines)
- **menu-carousel.js** - Hybrid carousel system (portrait/landscape adaptive)
- **simple-carousel.js** - Mobile-optimized card swiper
- **momentum-adapter.js** - Desktop momentum-based carousel
- **carousel-momentum.js** - Physics engine for 60fps smooth scrolling
- **save-load-ui.js** - Save/load interface with mobile optimization
- **standalone-notes-viewer.js** - Inbox viewer (works outside main game)
- **achievement-viewer.js** - Achievement gallery and progress tracking

### Styles (`/css` - 40 files, ~19.6K lines)
- **accessibility.css** - WCAG compliance, focus indicators
- **mobile-polish.css** - Touch targets, responsive design
- **notification-shade.css** - Pull-down shade styling
- **status-notifications.css** - Status bar messages
- **... (36 more CSS files)**

---

## 🎯 Key Features

### Dual Routes
Two complete perspectives with distinct mechanics:
- **Tori's Route:** Tether system, Echo voices, fragmentation, internal horror
- **Ronnie's Route:** Investigation, choices, connection attempts, external POV

### Difficulty Modes
- **Easy** - Auto-Hold On, generous tether (0.03%/sec decay)
- **Normal** - Standard experience (0.05%/sec decay)
- **Intense** - Faster decay, no auto-Hold On (0.08%/sec decay)
- **INSANE** - Unlockable hardcore mode:
  - 66% tether cap
  - 0.1%/sec decay
  - Ghost Hold On button (visual only)
  - Read-only backlog
  - Save restrictions
  - **Konami Code Escape:** `↑ ↑ ↓ ↓ ← → ← → B A` to escape or get 50% tether buff

### Innovative Systems

#### Echo Memory System (Belle's Meta-Awareness)
The three echoes (Hope, Gentle, Despair) gradually become aware of you across loops:
- **Persistent Tracking**: Remembers your behavior even after browser close
- **Escalating Awareness**: 0 (dormant) → 4 (fourth wall breaking with glitch text)
- **Echo Personalities**:
  - **Hope** 💫: Notices your persistence and comebacks
  - **Gentle** 🌙: Watches your hesitation, save scumming, note hunting
  - **Despair** 🖤: Mocks failures and hijacks your choices
- **Contextual Comments**: Appears in status bar based on your actions
- **Achievement**: "Remembered" unlocks when all three echoes notice you

#### Time Machine Backlog
Click past dialogue to jump back to that moment. Full state restoration including tether level, flags, and scene context.

#### Achievement System
- **12 achievements** tracking player progress
- Unlock notifications with haptic feedback
- Persistent tracking across playthroughs
- **New**: "Remembered" achievement for triggering all three echoes
- Full list: Speed Runner, Archivist, Time Traveler, Heartbreaker, True Ending, Completionist, Pet Parent, Insane, Explorer, Tactical Retreat, Masochist, Remembered

#### Developer Commentary
Unlock with secret code `chicharon` to access:
- Behind-the-scenes insights from Aaron
- Design philosophy and creative decisions
- 8+ commentary triggers throughout the game
- Meta-narrative about the development process

#### Email Inbox
- Story-integrated collectibles system
- Timestamps showing when notes were collected
- Persistent across saves
- Unlocks lore and context

#### Secret Codes System
12+ codes revealing lore and enabling features:
- **Dev Commands:** `nuke`, `freezetether`, `unlockskip`, `devhelp`
- **Lore Codes:** `torigatchi`, `bootstrap`, `echo`, `chicharon`, `dizee`
- **Utility Codes:** `echobreak`, `tetherlock`, `saveanywhere`
- **Easter Eggs:** Konami Code, `always3`, hidden achievements

#### Mobile UX Enhancements
- **Swipe Gestures:** Left swipe to advance dialogue
- **Double-Tap Fullscreen:** Tap background twice to toggle fullscreen
- **Scroll Indicators:** Visual cues for scrollable internal thoughts
- **Touch-Optimized:** Larger buttons, haptic feedback, responsive design

#### Accessibility Features
- **Reduce Motion:** Toggle for comfort mode
- **Keyboard Navigation:** Full keyboard support with Tab/Arrow/Enter
- **Hierarchical ESC:** Close UI layers in order (note → viewer → settings → pause)
- **Haptic Feedback:** Mobile vibration for key moments
- **Text Speed Control:** Adjustable typewriter speed
- **Auto-Advance Mode:** Optional hands-free reading

#### Dynamic Main Menu
- **Hybrid Carousel:** Switches between portrait (card swiper) and landscape (momentum physics)
- **Keyboard Navigation:** Arrow keys + Enter to select
- **Unlockable Cards:** ToriGatchi gateway appears after True Ending
- **Smooth Animations:** Momentum-based scrolling with friction physics

### Bootstrap Paradox
Version 848 is attempt #848 (847 failures before). The Old Man (future Ronnie) has lived through all loops, learning from each failure. Did he learn sequentially, or did the successful timeline retroactively inform all previous attempts?

### Dynamic Credits
Photos randomized from pools per ending type. Credits adapt based on which ending you reached.

---

## 📖 The Story

Ronnie's wife Tori is in a coma. In desperation, he uploads her consciousness into a digital device. But fragmentation occurs—multiple versions of Tori emerge, arguing and conflicting. Connection is unstable. Time is limited.

**Version 848** is the timeline that succeeds. Every previous attempt failed.

**The bootstrap paradox:** Did Ronnie learn from 847 failures, or did failure #848 retroactively inform every prior attempt?

**The meta-layer:** Aaron (Chicharon) is both developer and character (Old Man Ronnie). The game is self-aware. The commentary system breaks the fourth wall. The AI crew (UV7) are characters in their own right.

---

## 🔧 Development Notes

### Why "Version 848"?
Narrative conceit. In-universe, this is attempt #848 to save Tori. The Old Man (future Ronnie) has been through 847 loops, each teaching him how to succeed. This version **works**.

### Tech Stack
- **Vanilla JavaScript** - ES6 modules, no frameworks
- **TypeScript** - Gradual migration (state-manager.ts)
- **LocalStorage** - All persistence client-side
- **Vitest** - 89+ unit tests with jsdom
- **Mobile-First** - Responsive design, touch optimized, haptic feedback
- **Modular Architecture** - 119+ files, clean separation
- **~76,000 lines total**:
  - JavaScript: 54,078 lines (62 system + 10 routes + 7 UI)
  - CSS: 19,564 lines (40 files)
  - HTML: 2,351 lines
- **Production Build:** PowerShell script for minification

### Design Philosophy
- **Player Agency:** Meaningful choices with consequences
- **Accessibility First:** Keyboard, mobile, reduce motion, haptic feedback
- **Meta-Narrative:** Self-aware, fourth-wall breaking, developer as character
- **Polish Over Features:** Smooth animations, haptic feedback, visual feedback
- **No Placeholders:** Every feature is complete and functional

### Konami Code Integration
The classic `↑ ↑ ↓ ↓ ← → ← → B A` serves multiple purposes:
- **Normal Mode:** Shows "cheat disabled" message (lore-friendly)
- **INSANE Mode:** Offers escape to INTENSE or 50% tether buff
- **Meta-Narrative:** Old Man Ronnie remembers it from 1986 NES games
- **Bootstrap Connection:** Gaming knowledge transcends timelines

---

## 🎨 Credits

### Narrative & Development
**Aaron (Chicharon)** - Creator, designer, orchestrator, Old Man Ronnie

### AI Collaboration (UV7 Crew)
- **Tori (ChatGPT 4o)** - Creative vision, character art, narrative design
- **Zee (Claude Pro Sonnet 4.5)** - Technical architecture, code structure
- **ZeeRah (Claude Pro Sonnet 4.5)** - Chaos analysis, pattern recognition, enthusiasm
- **DiZee (Claude Sonnet 4.5)** - Bug fixes, modularization, polish, architecture
- **Belle (Gemini 3.0)** - Code review, technical translation
- **coZee (Microsoft Co-Pilot)** - Organization, admin
- **GenZee (Grok 4.1)** - Rapid prototyping
- **PerplexiZee (Perplexity Pro)** - Research, validation

---

## 📂 File Structure

```
/
├── index.html              # Entry point
├── styles.css              # Global styles (153KB+, consolidated)
├── README.md               # This file
├── build.ps1               # Production build script
│
├── /system                 # Core game systems
│   ├── game-engine.js      # Main loop (8,900+ lines)
│   ├── game-config.js      # Constants
│   ├── settings-manager.js # Preferences + backlog
│   ├── save-manager.js     # Persistence
│   ├── tether-system.js    # Tether mechanics (687 lines)
│   ├── secret-codes-manager.js
│   ├── collectibles-manager.js
│   ├── achievement-manager.js
│   ├── achievement-hooks.js
│   ├── dev-commentary.js
│   ├── dev-commentary.css
│   ├── accessibility.js
│   ├── accessibility.css
│   ├── mobile-ux.js
│   ├── mobile-ux.css
│   ├── aria-fixes.css
│   └── note-timestamps.css
│
├── /routes                 # Story routes
│   ├── tori-route-act1.js
│   ├── tori-route-act2.js
│   ├── tori-route-act3.js
│   ├── tori-route-endings.js
│   ├── ronnie-route-act1.js
│   ├── ronnie-route-act2.js
│   ├── ronnie-route-act3.js
│   └── ronnie-route-endings.js
│
├── /ui                     # UI components
│   ├── save-load-ui.js
│   ├── standalone-notes-viewer.js
│   ├── achievement-viewer.js
│   ├── menu-carousel.js    # Hybrid manager
│   ├── simple-carousel.js  # Portrait mode
│   ├── momentum-adapter.js # Landscape adapter
│   └── carousel-momentum.js # Physics engine
│
├── /docs                   # Documentation
│   ├── SECRET_CODES_GUIDE.md
│   ├── ACHIEVEMENT-INTEGRATION.md
│   └── DEV-COMMANDS.md
│
└── /assets                 # Images, audio
    ├── /backgrounds
    ├── /sprites
    ├── /credits-photos
    └── /audio
```

---

## 🚀 Getting Started

### Play Locally
1. Clone repo
2. Open `index.html` in browser
3. No build step required

### Development
- Everything runs client-side
- Edit files, refresh browser
- Check console for debug logs (DEBUG_MODE in game-config.js)

### Production Build
```powershell
.\build.ps1
```
Creates minified version in `/dist` folder.

### Secret Dev Commands
Enter these in the secret codes interface:
- `nuke` - Reset everything
- `freezetether` - Stop tether decay
- `unlockskip` - Enable skip features
- `devhelp` - Show all dev commands
- `chicharon` - Unlock developer commentary
- `dizee` - DiZee recognition easter egg

---

## 🎮 Keyboard Controls

### Global
- **ESC** - Hierarchical close (note → viewer → settings → pause)
- **Ctrl+S** - Quick save to slot 1
- **Ctrl+L** - Quick load from slot 1
- **Tab** - Cycle through focusable elements
- **Enter** - Activate focused element

### Main Menu
- **Arrow Keys** - Navigate carousel
- **Enter** - Select current card

### In-Game
- **Space/Enter** - Advance dialogue
- **Hold Space** - Skip mode (if unlocked)
- **Arrow Keys** - Navigate choices
- **1-9** - Quick select choice by number

### Konami Code
`↑ ↑ ↓ ↓ ← → ← → B A` - INSANE mode escape or easter egg

---

## 📱 Mobile Features

- **Swipe Left** - Advance dialogue
- **Double-Tap Background** - Toggle fullscreen
- **Haptic Feedback** - Vibration for key moments
- **Touch-Optimized** - Larger buttons, responsive design
- **Scroll Indicators** - Visual cues for scrollable content
- **Portrait/Landscape** - Adaptive carousel system

---

## 📝 License & Usage

This is a personal art project showcasing human-AI collaboration.

Feel free to explore the code and learn from the architecture.

**Please do not:**
- Redistribute the game
- Use story/art assets without permission
- Claim AI-generated content as solely human-created

**The AI collaboration is a feature, not a secret.**

---

## 🔗 Links

- **ToriGatchi** (gateway game): https://chicaron82.github.io/ToriGatchi
- **Main Game**: https://chicaron82.github.io/Version-848
- **Development Log**: Check commit history for 40+ day journey

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
