# Dev Commands - Secret Codes System

## How It Works

The secret codes input in Settings now accepts **both** player secret codes AND hidden dev commands for mobile debugging!

## Available Dev Commands

### Testing & Debugging
- `clearnotes` - Clear all collected notes (useful for testing note collection)
- `reset848` - Reset loop version to 848 (default/fresh state)
- `reset849` - Set loop version to 849 (first retry)
- `clearall` - Clear ALL localStorage data (asks for confirmation)

### Feature Unlocking
- `unlockskip` - Unlock the skip feature immediately
- `unlockcodes` - Unlock the secret codes section in settings
- `unlockact1saves` - Enable saves in Act 1 (normally locked until Tori's route)

### Ending States
- `succeeding` - Set game to SUCCEEDED state (True Ending - gold VERSION text)
- `accepting` - Set game to ACCEPTED state (Digital Forever - cyan ETERNAL text)

### Tether Control (Tori's Route)
- `freezetether` - Stop tether decay completely (for testing/accessibility)
- `resumetether` - Resume tether decay
- `settethermax` - Set tether to 100 (maximum)
- `settether50` - Set tether to 50 (warning zone for testing)

### Discovery
- `revealcodes` - Reveal all 7 secret codes in the settings UI
- `devhelp` - Show list of all dev commands

## Usage

1. Go to Settings
2. Navigate to "Secret Codes" tab
3. Type any dev command (lowercase, no spaces)
4. Press "Redeem Code"
5. Most commands require a page refresh to see changes

## Features

✅ **Hidden from players** - Dev commands don't count as "discovered codes"
✅ **Mobile-friendly** - No console needed!
✅ **Safe testing** - Most commands are non-destructive (except `clearall`)
✅ **Instant feedback** - Shows confirmation message with 💚 DEV prefix
✅ **Accessibility options** - Tether freeze commands help players who struggle with time pressure

## Accessibility Use Cases

The tether control commands (`freezetether`, `resumetether`) serve dual purposes:

**For Development:**
- Test Tori's route scenes without time pressure
- Debug specific dialogue branches
- Screenshot scenes for documentation

**For Players:**
- Players with slower reading speeds can freeze tether to enjoy the story
- Those who want to experience Tori's route without stress
- Content creators who want to showcase scenes without rushing

> **Note:** These are dev commands, not official accessibility features. For the full experience with difficulty options, see the upcoming difficulty toggle in Settings.

## Example Flow

```
1. Type "devhelp" → See all available commands
2. Type "unlockcodes" → Unlock secret codes section
3. Type "revealcodes" → See all 7 secret codes
4. Type "reset848" → Reset to clean state
5. Type "clearnotes" → Test note collection from scratch
```

## Regular Secret Codes (for reference)

These are the player-facing codes that count as discoveries:
- `torigatchi` - The Reverse Door
- `always3` - Storm Dragon Signature
- `uv7crew` - Meet the 848 Crew (includes the v849 FAQ!)
- `chicharon` - Dev Commentary
- `bootstrap` - Loop Timeline (reveals iteration count lore)
- `echo` - Voices of 847
- `848` - True Attempt Number (THE BIG REVEAL)

## The Version 848 Revelation

**IMPORTANT META-NARRATIVE:**

Version 848 is NOT a build number — it's the **loop iteration count**.

- 847 failed attempts where Ronnie couldn't save Tori
- Version 848 is the FIRST successful timeline
- There is no v849 — this is the loop that worked

**Where players discover this:**
1. `848` code - Full dramatic reveal with overlay
2. `bootstrap` code - Timeline visualization + explanation
3. `uv7crew` code - FAQ section addressing "When is v849?"

This meta-narrative layer blows reviewers' minds when they realize the "version number" IS the story.

## Implementation Notes

- Dev commands are checked **first** before secret codes
- Dev commands return `isDev: true` flag to prevent discovery counting
- All commands use lowercase for consistency
- Destructive commands (like `clearall`) ask for confirmation
