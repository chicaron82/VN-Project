# SYSTEM ARCHITECTURE: PROJECT 848

## Overview
**Version 848** is a web-based visual novel engine built with a custom "Hybrid Carousel" UI and a robust state management system. The architecture prioritizes separation of concerns, modularity, and "premium" user experience.

---

## 1. Core Mechanics

### The Game Loop (GameEngine)
The `GameEngine` class (`system/game-engine.js`) is the central orchestrator. It manages:
- **State**: `gameState` object (flags, inventory, choices).
- **Scene flow**: `updateScene()` handles transitions and asset loading.
- **Input**: Centralized handling via `InputBinder` and keyboard listeners.

### The Bootstrap Paradox
A meta-mechanic tracking "failed loops."
- **Persistence**: Uses `localStorage` to persist data across "full resets" (refreshing the page).
- **Version 848**: The narrative justification for the current stable build.

---

## 2. UI Architecture

### Hybrid Carousel System
To solve the "Desktop vs Mobile" UX challenge, we use a Strategy Pattern managed by `MenuCarousel.js`:

1.  **SimpleCarousel** (Mobile/Portrait):
    -   Touch-optimized, 1:1 swipe tracking.
    -   Performance focused for lower-end devices.

2.  **MomentumAdapter** (Desktop/Landscape):
    -   Wraps the `CarouselMomentum` physics engine.
    -   **Infinite Scrolling**: Uses a 3x buffer (cloned nodes) to create a seamless loop.
    -   **Physics**: Friction-based deceleration and snapping.

### Input Binder
All static UI interactions are decoupled from HTML.
-   **Old Pattern**: `<button onclick="game.start()">` (Removed)
-   **New Pattern**: `InputBinder` attaches listeners by ID at runtime.

---

## 3. Data Flow

### Save Management
-   **Slots**: Auto-save + 3 Manual Slots.
-   **Format**: JSON serialization of `gameState` + metadata (timestamp, route, preview text).
-   **Safety**: Wrappers (`safeLocalStorageSet`) prevent crashes if storage is full/disabled.

### Asset Pipelines
-   **Preloading**: Critical assets (fonts, UI) load before splash.
-   **Lazy Loading**: Scene images load on demand with a `Promise`-based queue.

---

## 4. Key Systems
-   **TetherSystem**: Visual/Haptic feedback mechanic for the "Tori" route.
-   **CutsceneEngine**: specialized renderer for frame-by-frame animations (HTML5 Canvas).
-   **Dev Console**: Runtime debugging tool (`~` key) for inspecting state on mobile.
