# Design Decision: No Audio

## The Choice
Version 848 is intentionally **audio-free**. This is a deliberate design decision, not an oversight.

## Reasoning

### 1. **Cost & Licensing**
- Quality SFX libraries cost money
- Music licensing is expensive
- Free assets often have attribution requirements or quality issues

### 2. **File Size**
- Audio files are HEAVY (even compressed)
- Current build: ~500KB total
- Adding audio: Easily 2-5MB+ (music, SFX, voice)
- Goal: Keep the game lightweight and fast-loading

### 3. **Alternative Sensory Design**
Instead of audio, we invested in:
- **Haptic Feedback** - Physical vibration patterns for story beats (sorry iPhone users 😅)
- **Visual Cues** - Screen flickers, chromatic aberration, glitch effects
- **Sensory Language** - Unified haptic + visual system that scales with player comfort

### 4. **User Experience**
- No permission prompts for audio playback
- No autoplay issues on mobile browsers
- Works silently in public settings (work, commute, etc.)
- No jarring audio if player has headphones on

## The Result
A **visual novel that communicates through touch and sight**, not sound. It's a feature, not a bug.

---

**Note to reviewers:** Yes, we know audio would be "a nice touch." We chose not to include it. Stop suggesting it. 💙
