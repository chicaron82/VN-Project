# V2 Managers

State-oriented managers that handle cross-cutting concerns.

## Managers

| Manager | Purpose |
| --- | --- |
| `AccessibilityManager.ts` | High contrast, font scaling, reduced motion, screen reader support |
| `AutoSaveManager.ts` | Automatic save triggers and intervals |
| `OverlayManager.ts` | Modal/overlay stacking and z-index management |
| `PauseManager.ts` | Game pause state and event suppression |
| `SaveManager.ts` | Save/load UI coordination |
| `ThemeManager.ts` | Light/dark/auto theme management |
| `TutorialManager.ts` | Tutorial state tracking and progression |

Each manager has a co-located `.test.ts` file.
