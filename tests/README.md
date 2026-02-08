# Tests

V1 integration and unit tests (JavaScript, Vitest).

These test the original V1 `system/` implementations. V2 tests live co-located with their source files in `v2/`.

## Test Files

| Test | System Under Test |
| --- | --- |
| `game-engine.test.js` | Core game loop |
| `state-manager.test.js` | State management |
| `save-manager.test.js` | Save/load persistence |
| `achievement-manager.test.js` | Achievement tracking |
| `collectibles-manager.test.js` | Note collection |
| `echo-memory-system.test.js` | Echo meta-awareness |
| `tether-system.test.js` | Connection mechanic |
| `keyboard-controller.test.js` | Keyboard input |
| `ui-controller.test.js` | UI management |
| `scene-progression-controller.test.js` | Scene flow |
| `credits-controller.test.js` | Credits display |
| `easter-egg-controller.test.js` | Hidden content |
| `notification-shade-controller.test.js` | Notification panel |
| `grab-handle-repositioner.test.js` | Drag handle |
| `integration/` | Cross-system integration tests |

## Running

```bash
npm test -- --run           # All tests (V1 + V2)
npm test -- tests/ --run    # V1 tests only
```
