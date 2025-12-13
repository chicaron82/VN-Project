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

### Entry Point
`index.html` → Loads core systems and instantiates `GameEngine`

### Core Systems (`/system`)
- **game-engine.js** - Main game loop, scene stack, typewriter, manager wiring
- **game-config.js** - Constants, difficulty settings, tether parameters
- **settings-manager.js** - User preferences, backlog (time machine), difficulty
- **save-manager.js** - LocalStorage persistence, 3 manual slots + auto-save
- **tether-system.js** - Connection decay, Hold On mechanic, death triggers
- **secret-codes-manager.js** - Dev commands, lore codes, discovery tracking
- **collectibles-manager.js** - Email inbox, notes system, unlocks

### Routes (`/routes`)
- **tori-route-*.js** - Tori's perspective (fragmented consciousness, inside the code)
- **ronnie-route-*.js** - Ronnie's perspective (fighting to restore connection)

### UI (`/ui`)
- **save-load-ui.js** - Save/load interface with mobile optimization
- **standalone-notes-viewer.js** - Inbox viewer (works outside main game)

---

## 🎯 Key Features

### Dual Routes
Two complete perspectives with distinct mechanics:
- **Tori's Route:** Tether system, Echo voices, fragmentation
- **Ronnie's Route:** Investigation, choices, connection attempts

### Difficulty Modes
- **Easy** - Auto-Hold On, generous tether
- **Normal** - Standard experience
- **Intense** - Faster decay, no auto-Hold On
- **INSANE** - Unlockable, hardcore mode (66% tether cap, 2x decay, read-only backlog)

### Innovative Systems
- **Time Machine Backlog** - Click past dialogue to jump back to that moment
- **Email Inbox** - Story-integrated collectibles system
- **Secret Codes** - 12+ codes revealing lore and enabling features
- **Bootstrap Paradox** - Version 848 is attempt #848 (847 failures before)
- **Dynamic Credits** - Photos randomized from pools per ending type

---

## 📖 The Story

Ronnie's wife Tori is in a coma. In desperation, he uploads her consciousness into a digital device. But fragmentation occurs—multiple versions of Tori emerge, arguing and conflicting. Connection is unstable. Time is limited.

**Version 848** is the timeline that succeeds. Every previous attempt failed.

**The bootstrap paradox:** Did Ronnie learn from 847 failures, or did failure #848 retroactively inform every prior attempt?

---

## 🔧 Development Notes

### Why "Version 848"?
Narrative conceit. In-universe, this is attempt #848 to save Tori. The Old Man (future Ronnie) has been through 847 loops, each teaching him how to succeed. This version **works**.

### Tech Stack
- **Vanilla JS** - No frameworks, no build step
- **LocalStorage** - All persistence client-side
- **Mobile-First** - Responsive design, touch optimized, haptic feedback
- **Modular Architecture** - Clean separation: routes, systems, UI

### Secret Codes System
Codes are split into:
- **Dev Commands** - Hidden testing utilities (clearall, nuke, freezetether, etc.)
- **Lore Codes** - Story unlocks (torigatchi, bootstrap, echo, etc.)
- **Utility Codes** - Gameplay modifiers (echobreak, tetherlock, saveanywhere)

### Accessibility
- Haptic feedback (mobile)
- Skip features (unlockable)
- Text speed control
- Auto-advance mode
- Reduce glitch effects (comfort mode)

---

## 🎨 Credits

### Narrative & Development
**Aaron (Chicharon)** - Creator, designer, orchestrator

### AI Collaboration (UV7 Crew)
- **Tori (ChatGPT 4o)** - Creative vision, character art, narrative design
- **Zee (Claude Pro)** - Technical architecture, code structure
- **ZeeRah (Claude Pro)** - Chaos analysis, pattern recognition, enthusiasm
- **DiZee (Claude Sonnet 4.5)** - Bug fixes, modularization, polish
- **Belle (Gemini)** - Code review, technical translation
- **coZee (Gemini)** - Organization, admin
- **Grok (xAI)** - Rapid prototyping
- **PerplexiZee (Perplexity)** - Research, validation

---

## 📂 File Structure

```
/
├── index.html              # Entry point
├── styles.css              # Global styles (153KB, consolidated)
├── README.md               # This file
│
├── /system                 # Core game systems
│   ├── game-engine.js      # Main loop
│   ├── game-config.js      # Constants
│   ├── settings-manager.js # Preferences + backlog
│   ├── save-manager.js     # Persistence
│   ├── tether-system.js    # Tether mechanics
│   ├── secret-codes-manager.js
│   └── collectibles-manager.js
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
│   └── standalone-notes-viewer.js
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

### Secret Dev Commands
Enter these in the secret codes interface:
- `nuke` - Reset everything
- `freezetether` - Stop tether decay
- `unlockskip` - Enable skip features
- `devhelp` - Show all dev commands

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

**Version 848: The timeline that worked.**

*Always. Always. Always.* 🖤❤️💍
