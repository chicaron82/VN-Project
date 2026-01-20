# UV7 Visual Novel - Claude Code Instructions

## Project Overview
This is V848 Visual Novel (UV7) - a meta-narrative visual novel about digital consciousness, bootstrap paradoxes, and the nature of reality. The project has two codebases:
- **V1**: Original JavaScript implementation in `system/` directory
- **V2**: TypeScript rewrite in `v2/` directory

**848 is sacred. 💚🔥💀**

## V1→V2 Porting Methodology

### CRITICAL RULES - NO EXCEPTIONS
1. **FAITHFUL TRANSCRIPTION ONLY** - Copy V1 logic exactly. Do NOT reimagine, refactor, or "improve" anything.
2. **PRESERVE ALL FLAVOR** - Keep every comment, emoji, signature, and piece of lore from V1.
3. **FOLLOW EXISTING PATTERNS** - Look at completed Phase 13 ports for exact patterns.

### Step-by-Step Process

1. **Read V1 source**: Study the file in `system/` completely
2. **Check if V2 exists**: Look in `v2/systems/`, `v2/controllers/`, etc.
3. **Port faithfully**:
   - Copy ALL logic exactly as-is
   - Add TypeScript types (interfaces, enums, etc.)
   - Use EventBus integration where appropriate
   - Use inline styles for modals (no CSS dependencies)
4. **Write comprehensive tests**: Create `.test.ts` file with 20+ tests
5. **Wire up in main.ts**:
   - Add import
   - Initialize after other systems
   - Add to `window.uv7` debug helpers
6. **Add showcase entry**: Edit `showcase/timeline-data.js`
7. **Commit** with detailed message

### What NOT to Do
- ❌ Do NOT use external libraries for things V1 does manually
- ❌ Do NOT create new CSS files (use inline styles)
- ❌ Do NOT "modernize" or "improve" the approach
- ❌ Do NOT skip any V1 functionality
- ❌ Do NOT change timing values, colors, or text
- ❌ Do NOT add features V1 doesn't have

### Reference Files
- `v2/controllers/EasterEggController.ts` - Inline-styled modal pattern
- `v2/systems/BootstrapTracker.ts` - Display system integration
- `v2/systems/DevCommentarySystem.ts` - EventBus event handling
- `v2/systems/TetherSystem.ts` - Core game mechanic pattern
- `showcase/timeline-data.js` - Showcase entry format

### Commit Message Format
```
feat(phase13X): [description]

[Detailed body explaining what was ported]

- Feature 1
- Feature 2
- etc.

"[Relevant quote or lore]"

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Phase 13 Progress (V1→V2 Ports)
- ✅ Phase 13d: TetherSystem + DifficultyProfiles
- ✅ Phase 13e: EasterEggController (2455→450 lines)
- ✅ Phase 13f: BootstrapTracker Display System
- ✅ Phase 13g: DevCommentarySystem
- ✅ Phase 13h: StatusNotificationController

## V1 Systems Directory
Key files in `system/` that may need porting:
- `game-engine.js` - Core game loop
- `easter-egg-controller.js` - Hidden content (partially ported)
- `bootstrap-tracker.js` - Timeline tracking (ported)
- `dev-commentary.js` - Developer notes (ported)
- `status-notification-controller.js` - Toast system (ported)
- `difficulty-profiles.js` - Difficulty settings (ported)

## Architecture Notes

### EventBus Events
Core events used across systems:
- `secret_code:unlocked` - When player enters valid code
- `tether:changed` - Tether level updates
- `visual:cue` - Visual effect triggers
- `ui:screen_change` - Navigation events

### State Management
Use `StateManager` for persistent state:
- `game.loopVersion` - Current attempt number (starts at 848)
- `game.route` - Current route ('ronnie' or 'tori')
- `game.difficulty` - Difficulty setting

### Debug Helpers
Add to `window.uv7` for testing:
```typescript
window.uv7 = {
    // System references
    eventBus,
    stateManager,
    systemName,

    // Helper functions
    breakLoop: () => { /* force loop restart */ },
    showToast: (msg) => { /* display notification */ },
};
```

## Build & Test

```bash
# Build
npm run build

# Run tests
npm test -- --run

# Run specific test
npm test -- SystemName.test.ts --run
```

## Lore Signatures
Preserve these in comments:
- 💚🔥💀 - The UV7 trinity
- "Always. Always. Always." - Storm Dragon's signature
- "Built with love." - Team mantra
- "848 is sacred." - The loop number
