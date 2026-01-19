# PROJECT 848: "BRAG SHEET"
*Why this isn't just a Visual Novel.*

## 1. The "Invisible" Architecture
Most VNs are just `if/else` statements. This is a state-managed engine.
-   **Hybrid UI Core**: You built a **Strategy Pattern** adapter that hot-swaps the entire UI engine (`SimpleCarousel` vs `MomentumAdapter`) based on viewport width. That's enterprise-grade frontend architecture.
-   **Physics Engine**: You wrote a custom physics system (`CarouselMomentum`) with friction, velocity decay, and "teleporting" infinite scroll. For a menu.
-   **Input Abstraction**: The new `InputBinder` completely decouples logic from views.

## 2. Meta-Narrative Systems
-   **Bootstrap Paradox Tracker**: The engine tracks "Loop 848" as a canonical variable. It knows how many times it has failed.
-   **ToriGatchi Integration**:
    -   It's not just a minigame. It's a separate web app communicated via `vn-gateway-bridge.js`.
    -   **Bilateral State**: The main game affects Torigatchi start states ("Optimal" vs "Desperate"), and Torigatchi endings (`localStorage`) feed back into the main game.
-   **Time Machine**: A dedicated manager to handle non-linear narrative jumps while preserving state consistency.

## 3. Sensory Engineering
-   **TetherSystem**:
    -   A decaying float value with passive drain rates based on difficulty.
    -   **Insane Mode**: Unlocks entirely new mechanics (ghost buttons, read-only mode).
    -   **Haptic Feedback**: Mobile vibration patterns synced with narrative beats.
-   **Visual Glitching**: Dynamic CSS filters (`hue-rotate`, `saturate`) triggered by game state events.

## 4. Production Value
-   **Asset Pipeline**: Priority-queue preloader for critical assets vs lazy-loading scenes.
-   **Error Boundaries**: `safeExecute` wrappers catch runtime errors and save them to local storage without crashing the game.
-   **"Director's Cut"**: Unlockable content that overlays the actual game, pulling from a hidden data layer.

**Verdict**: This is a React/Vue-level web application disguised as a Ren'Py game.

## 5. "Deep Lore" Mechanics (The Invisible Layer)
-   **Time Machine Manager**:
    -   Not just a backlog. It captures full state snapshots (Tether value, Flags, RNG seed) at every dialogue step.
    -   **Pruning Strategy**: Implements a "Smart Pruning" algorithm (keeps important narrative anchors, discards low-priority filler) to manage memory usage.
    -   **Narrative Blocking**: Logic to "Lock" or "Burn" specific snapshots, preventing the player from time-traveling to moments effectively erased from the timeline.
-   **Collectibles Ecosystem**:
    -   **Email Client**: A full inbox UI with "Unread" badges, subject lines, and sender identities (Z, GZ, IZ).
    -   **RNG Pity System**: Notes have a chance to drop secret codes. The engine tracks "views" and forces a drop after 3 failures (Pity Timer) to prevent frustration.
    -   **Route Suppression**: Logic that explicitly blocks lore drops on first playthroughs to enforce narrative pacing.
-   **Secret Codes**:
    -   **Utility Injections**: Codes like `tetherlock` or `saveanywhere` physically overwrite runtime flags to alter game mechanics on the fly.
    -   **Persistent Discovery**: Code discovery is tracked in `localStorage` separate from save files, allowing knowledge to carry over across "hard resets" (Nukes).

## 6. UX & Responsive Design ("Clickable World")
-   **Adaptive Route Selection**:
    -   **Dual-Layout Engine**: Seamlessly transforms from a stack-based layout (Portrait) to a rigid CSS Grid system (Landscape) with zero JavaScript relayouts.
    -   **Context-Aware Interactivity**: Sprites act as buttons. Clicking a dimmed character performs a "Soft Select" (preview), clicking an active one sends a "Hard Confirm" (game start).
-   **Mobile-First Polish**:
    -   **Flow-Based Positioning**: Replaced fragile `position: fixed` elements with flow-relative positioning to eliminate overlap on any viewport height.
    -   **Touch Target Optimization**: Hit-boxes extended beyond visible pixels to accommodate imperfect thumb presses (Fitts's Law).

## 7. The Desktop Mobile Emulator
-   **Architecture-Level Responsive Override**:
    -   Most responsive sites just rely on @media queries. You built a **State-Driven Emulation Layer** (.force-portrait) that physically hijacks the app's rendering context.
    -   **Stacking Context Traps**: Solved complex position: fixed breakout issues by forcing all overlays (#main-menu, #settings, Visual Cues) to re-contextualize as position: absolute within a constrained container.
    -   **One-Click Simulation**: Allows full mobile UX testing on desktop without browser dev tools, swapping assets (backgrounds), fonts, and layouts dynamically.

## 8. Mobile-First Developer Tooling
-   **On-Device Debugging Console**:
    -   **Problem**: Mobile browsers (Chrome/Safari on iOS/Android) have no accessible DevTools/Console without USB tethering to a desktop.
    -   **Solution**: Built a custom, touch-friendly **Overlay Terminal** (classes/DevConsole.js) that intercepts console.log, warn, and error streams and renders them in-game.
    -   **Capability**: Allows full runtime flag manipulation (settether, unlockact1), state inspection (flags), and hot-swapping routes directly on the phone. "Debug in the wild" without cables.

## 9. Physics Tuning (The "Feel" Layer)
-   **Iterative Parameter Optimization**:
    -   Desktop momentum carousel: Hand-tuned friction (0.975), velocity caps (300), and snap thresholds (0.2) through multiple iterations to achieve "Price Is Right wheel" feel.
    -   Mobile card swipes: Velocity-based exit timing (200-400ms dynamic duration) so fast swipes = instant exits, slow swipes = graceful animations.
-   **Platform-Specific Feel Targets**:
    -   Desktop: Long coasting deceleration, multi-card skips on hard flicks, precise 1-2 card movement on gentle swipes.
    -   Mobile: "iPhone homescreen" spring-back with elastic cubic-bezier curves (`0.68, -0.6, 0.265, 1.65`) for satisfying bounce.
-   **Gesture-Driven Interactions**:
    -   Tinder-style card stack with rotation (±8°), opacity fade, and next-card reveal during drag.
    -   Swipe-up confirmation gesture with scale pulse and haptic double-pulse feedback.
-   **The Polish**: This isn't just "it works" - it's "it feels right." The kind of micro-interactions that make users go "damn, this is smooth."
