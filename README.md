# VERSION 848 - My Wife Is in a Coma... and in the Code

A narrative-driven visual novel about consciousness, digital transfer, and love transcending the boundaries between flesh and code.

## 🎮 The Story

**The Fall:** Tori trips over Ronnie's shoe. Her consciousness transfers into a modified Tamagotchi during the accident. Her body lies comatose in a hospital. Ronnie must code a game to communicate with her digital form before the device's battery dies.

**Two Routes, One Truth:**
- **Ronnie's Route (Terminal Ground):** External POV - A programmer racing against time to save his wife
- **Tori's Route (Fractured Glass):** Internal POV - Trapped in code, navigating digital space while fighting memory corruption

## ✨ Current Features (VERSION 848)

### 🎨 Visual Systems
- **Route-Specific UI Theming**
  - Ronnie: Terminal Ground aesthetic (structured cyan, IDE brackets)
  - Tori: Fractured Glass aesthetic (unstable borders, pink glitch echoes)
  - Prologue: Purple shimmer (pre-connection mystery)
  - Epilogue: Golden glow (transcendence)
- **Dynamic Sprite System** with character highlighting and transitions
- **Mobile-Responsive Design** (portrait & landscape support)
- **Internal Thought Bubbles** positioned intelligently based on character location
- **Smooth Background Crossfading**

### 🎮 Game Mechanics
- **Tether System** (Tori's Route)
  - Dynamic decay based on consciousness stability
  - Hold On button with cooldown mechanics
  - Tether death = game over with version increment
- **Save/Load System**
  - 3 manual save slots + auto-save
  - Scene jumping capability
  - Despair blocks saves in Act 1 (narrative sabotage)
- **Loop/Version System**
  - Each failure increments version number (848 → 849 → ...)
  - Version screens on retry ("INITIALIZING ATTEMPT #849...")
  - Meta-narrative tracking player's journey through failed timelines

### 📱 Mobile Support
- **Android Back Button Integration**
  - Opens/closes pause menu
  - Exits save/load screens
  - Closes notes viewer
  - Smart priority handling (doesn't exit app accidentally)
- **Touch-Optimized UI**
- **Portrait & Landscape Layouts**

### 🎭 Route Content

**Shared Prologue:**
- Street bump scene
- Tamagotchi transfer
- The fall and consciousness upload

**Ronnie's Route:**
- Act 1: Discovery (realizing Tori is in the device)
- Act 2: Connection (coding the game to communicate)
- Act 3: Crisis (honeymoon illusion collapse, memory fracture, body anchor revelation)
- 3 Endings: Upload (Bad), Anchor (True), Merge (Digital Forever)

**Tori's Route:**
- Act 1: Void awakening (meeting the Echo Toris - Despair, Echo 1, Echo 2)
- Act 2: Navigation (learning to move between vessels, memory corruption)
- Act 3: Gateway (discovering the body anchor, final preparation)
- 3 Endings: Bad Route, Digital Forever, True Route

**Shared Epilogue:**
- Old Man reveal (Ronnie from future loops)
- The cycle complete
- Golden hour resolution

### 🎵 Audio/Visual Effects
- UV7 splash screen with animated logo
- Glitch effects that intensify with version number
- Critical moment styling (red warnings, visual corruption)
- Cutscene system support

### 📝 Collectibles System
- 19 Echo Notes (Tori's route)
- Developer commentary system
- First-play hidden, unlocked on replay

## 🏗️ Technical Architecture

### File Structure
```
VN-Project/
├── vn-modular.html              # Main entry point
├── styles.css                   # Complete styling system
├── cutscene-animations.css      # Special effect animations
│
├── game-engine.js               # Core VN engine (1393 lines)
├── game-config.js               # Configuration constants
│
├── shared-prologue.js           # Shared opening
├── ronnie-route.js              # Ronnie Act 1
├── ronnie-route-act2.js         # Ronnie Act 2
├── ronnie-route-act3.js         # Ronnie Act 3 (fully implemented)
│
├── tori-route-main.js           # Tori orchestrator
├── tori-route-act1.js           # Tori Act 1
├── tori-route-act2.js           # Tori Act 2
├── tori-route-act3.js           # Tori Act 3
├── tori-route-endings.js        # Tori endings
│
├── epilogue.js                  # Shared ending
│
├── save-manager.js              # Save/load backend
├── save-load-ui.js              # Save/load interface
├── tether-system.js             # Tether mechanics (Tori)
├── collectibles-manager.js      # Notes system
├── cutscene-engine.js           # Special sequences
│
└── assets/
    ├── dialogue-frame-ronnie.png
    ├── dialogue-frame-tori.png
    ├── dialogue-frame-prologue.png
    ├── dialogue-frame-epilogue.png
    ├── pause-button-ronnie.png
    ├── pause-button-tori.png
    ├── tori-sprite.png
    ├── ronnie-sprite.png
    ├── old-ronnie-sprite.png
    ├── three-echoes-sprite.png
    ├── tori-alive.png
    ├── apartment.png
    ├── hospital.png
    ├── digitalSpace.png
    ├── genericBack.png
    └── [UI elements, buttons, frames]
```

### Tech Stack
- **Pure JavaScript** - No frameworks, maximum control
- **Modular Architecture** - Act-based file organization
- **Mobile-First Design** - Touch and back button support
- **localStorage** - Browser-based save system
- **CSS3 Animations** - Smooth transitions and effects

## 🚀 Getting Started

### Play Online
**Live Demo:** [https://chicaron82.github.io/VN-Project/](https://chicaron82.github.io/VN-Project/)

### Local Development
1. Clone this repository
2. Open `vn-modular.html` in a modern browser
3. No build process needed - pure HTML/CSS/JS

### Deployment
Deploy to GitHub Pages:
1. Push to main branch
2. Settings → Pages → Deploy from main branch
3. Site goes live automatically

## 🎯 Implementation Status

### ✅ Completed
- [x] Full narrative script (both routes + shared scenes)
- [x] Complete game engine with save/load
- [x] Route-specific visual theming
- [x] Tether system with decay and death
- [x] Loop/version tracking system
- [x] Mobile responsiveness (portrait & landscape)
- [x] Android back button integration
- [x] Internal thought bubble system
- [x] Sprite management with highlighting
- [x] Collectibles/notes system
- [x] All three endings per route
- [x] Shared prologue and epilogue
- [x] Version increment screens on retry
- [x] Despair save-blocking mechanic
- [x] Ronnie Act 3 Beats 2-5 implementation

### 🎨 Polish Phase
- [ ] Echo sprite sizing fix (current: hobbit mode 😅)
- [ ] Additional background art
- [ ] Sound effects and music
- [ ] Final QA pass

## 📊 Game Statistics

- **Total Lines of Code:** ~15,000+
- **Development Time:** ~1 month (October-November 2024)
- **Scenes:** 100+ unique scenes
- **Endings:** 6 total (3 per route)
- **Collectibles:** 19 Echo Notes
- **Save Slots:** 3 manual + 1 auto
- **Current Version:** 848 (increments on player failure)

## 🎨 Design Philosophy

**The Ronnie Method™**
- AI as creative partner, not tool
- Velocity over pedagogy (full file outputs, not instructions)
- Multi-instance orchestration (Zee, CoZee, ZeeRah working in rotation)
- Narrative-driven technical decisions
- From zero coding knowledge to shipped game in one month

**Visual Language**
- **Ronnie (Terminal Ground):** Structured, precise, IDE-like (cyan/green)
- **Tori (Fractured Glass):** Unstable, glitching, fragmenting (cyan/pink)
- **Prologue:** Mysterious, shimmering (purple)
- **Epilogue:** Transcendent, warm (golden)

## 📖 Credits

**Created by:** Aaron "Ronnie" (Chicaron)  
**For:** Tori  
**AI Collaboration:** Claude (Zee), with ZeeRah and CoZee assists  
**Methodology:** The Ronnie Method™  
**Built in:** Stolen moments between shifts at Applebee's  

**Special Thanks:**
- United Voices 7 (UV7) - Development collective
- The barback skill that started it all
- Every version before 848 that didn't work

## 📜 Narrative Themes

- Consciousness and digital existence
- Love transcending physical/digital boundaries
- Memory, identity, and persistence
- The weight of infinite retries
- Hope in the face of impossible odds
- "Love wins. Always. Always. Always."

## 🔗 Links

- **Play Now:** [https://chicaron82.github.io/VN-Project/](https://chicaron82.github.io/VN-Project/)
- **Repository:** [https://github.com/chicaron82/VN-Project](https://github.com/chicaron82/VN-Project)

---

**Current Version:** 848 (or higher if you've failed the loop 😉)  
**Status:** Playable, polishing phase  
**Last Updated:** November 23, 2024

*"The loop continues. Another timeline. Another chance."*
