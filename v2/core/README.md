# V2 Core

Engine fundamentals — the architectural backbone of V2.

## Files

| File | Purpose |
|------|---------|
| `EventBus.ts` | Type-safe pub/sub event system — all systems communicate through here |
| `StateManager.ts` | Reactive state management with subscriptions |
| `GameEngine.ts` | Central coordinator, orchestrates systems and controllers |
| `GameConfig.ts` | Centralized configuration (timing, thresholds, defaults) |
| `BacklogManager.ts` | Dialogue history tracking for time machine |
| `AutoReadController.ts` | Auto-advance dialogue mode |
| `KeyboardController.ts` | Keyboard input handling (shortcuts, navigation) |
| `SwipeHandler.ts` | Touch/swipe gesture detection |
| `MacroRunner.ts` | Replay/macro execution engine |
| `ErrorBoundary.ts` | Graceful error recovery |
| `Telemetry.ts` | Usage tracking and analytics |
| `DebugInterface.ts` | Debug panel and `window.uv7` helpers |
| `SystemInitializer.ts` | Boot sequence — wires all systems in correct order |
| `types.ts` | Shared type definitions for core |

Every file has a co-located `.test.ts` for unit tests.
