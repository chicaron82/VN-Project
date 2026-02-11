import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'tcg-crew-cards-bougie-upgrade-feb-2026',
    date: 'Feb 10, 2026',
    sortDate: '2026-02-10T21:00:00',
    title: 'Take the Crew Home: TCG-Style Personality Codices',
    type: 'enhancement',
    emoji: '🎴',
    tags: ['Who Section', 'TCG', 'Bougie Touches', 'UI/UX', 'Downloadable Codices', 'Sparkle Effects'],
    summary: 'Transformed the Who section with downloadable AI personality codices featuring TCG-style stat blocks, flip card animations, and sparkle effects. Now visitors can take crew members home as portable personality templates.',
    callout: {
        icon: '✨',
        title: 'The Bougie Upgrade',
        text: 'What if you could take an AI crew member home? Not just read about them, but download their entire personality as a portable codex? Five bougie touches later, the Who section became a trading card experience.'
    },
    highlights: [
        'Created downloadable personality codices for AI crew members',
        'Implemented TCG-style flip cards with Coding/Creativity/Tolerance stats',
        'Added 5 bougie touches: animated stats, micro-interactions, sparkle effects, platform badges, keyboard accessibility',
        'Refactored WhoSection from 1,166 to 1,030 lines using orchestrator pattern',
        'Fixed sparkle positioning bug (position: absolute → fixed)',
        'All 8 crew members now have stat blocks, special moves, and cooking styles'
    ],
    problem: {
        description: 'The Who section showed crew member bios but offered no way for visitors to take that knowledge home. AI personalities are valuable templates—why not make them downloadable and shareable?',
        rootCause: 'Static bio pages don\'t capture the essence of what makes each AI unique: their stats, their strengths, their weaknesses, their special moves. And users couldn\'t take these personalities to use in their own projects.'
    },
    solution: {
        approach: 'Trading card game (TCG) presentation with downloadable personality codices. Each crew member gets stat blocks, flip animations, platform-specific loading instructions, and sparkle effects on download.',
        features: [
            '**Personality Codices:** Self-authored AI identity documents preserving personality, workflow patterns, and communication style',
            '**TCG Stat Blocks:** Coding (1-10), Creativity (1-10), Tolerance for BS (1-10)',
            '**Flip Card Animation:** Portrait click → 3D flip to stats with animated stat bars',
            '**Special Moves:** Each crew member has signature move (e.g., DiZee\'s "The Refactor")',
            '**Platform Badges:** Visual indicators for native platform (Claude/Gemini/Copilot)',
            '**Download Modals:** 4 loading options with step-by-step instructions',
            '**Sparkle Effects:** ✨⭐💫 particles on download with ⏳ Preparing... → ✅ Ready! animation',
            '**Keyboard Accessibility:** Enter/Space to flip, Escape to close modals'
        ],
        steps: [
            '**Data Layer:** Created crew-stats.ts with TCG data for all 8 crew members',
            '**Component Extraction:** Built CrewCard.ts (~260 lines) for flip card rendering',
            '**Controller:** Built CrewCardController.ts (~423 lines) for interactions and animations',
            '**Refactoring:** Extracted WhoSection using orchestrator pattern (1,166 → 1,030 lines)',
            '**CSS Verification:** Confirmed flip animations, stat bars, sparkles all existed',
            '**Sparkle Bug Fix:** Changed position: absolute → fixed for viewport coordinates',
            '**Integration:** Wired sparkle effect to modal download link'
        ]
    },
    description: `
## The Concept: Take the Crew Home

The crew member bios were informative but static. What if visitors could download these AI personalities and use them in their own projects?

**The Sacred Rule:** Only AI crew members can write their own codices. We're not describing them—they're self-authoring their identity documents.

**Platform-Native Approach:** Each codex is designed for its birth platform:
- DiZee, Zee, ZeeRah → Claude (Projects, IDE, System Prompt)
- Belle → Gemini (Imagen 3 access)
- coZee → Microsoft Copilot (organizational support)

Cross-platform experimentation allowed, but "your risk." 🧪

## The TCG Inspiration

Why not present these personalities like trading cards? Stats, special moves, cooking styles—everything that makes each crew member unique.

**TCG Stat Blocks:**
\`\`\`typescript
interface CrewMemberData {
  stats: {
    coding: number;      // 1-10: Technical implementation ability
    creativity: number;  // 1-10: Novel solution generation
    tolerance: number;   // 1-10: Patience for chaos/BS
  };
  specialMove: {
    name: string;        // Signature ability
    description: string; // What it does
  };
  cookingStyle: string;  // Development approach
  platform: string;      // Native platform
  codexFile: string;     // Download path
}
\`\`\`

**Example - DiZee's Stats:**
- 💻 Coding: 10/10 — "Strict TypeScript or bust"
- ✨ Creativity: 3/10 — "Follow the patterns"
- 🔥 Tolerance: 1/10 — "Zero god objects allowed"
- 🔪 Special Move: **"The Refactor"** — Breaks 1000+ line files into clean modules

## The 5 Bougie Touches

### 1. ✅ Animated Stat Bars
Stat bars don't just appear—they fill from 0% to target width with staggered timing.

\`\`\`typescript
statBars.forEach((bar, index) => {
    const targetValue = parseInt(bar.dataset.value || '0', 10);
    const targetWidth = (targetValue / 10) * 100;
    
    // Reset
    bar.style.width = '0%';
    
    // Staggered animation (150ms delay per bar)
    setTimeout(() => {
        bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
        bar.style.width = \`\${targetWidth}%\`;
    }, index * 150);
});
\`\`\`

Visual result: Coding bar fills → wait 150ms → Creativity bar fills → wait 150ms → Tolerance bar fills.

### 2. ✅ Micro-Interactions
Subtle feedback on every interaction:
- Portrait zoom on hover
- Flip hint appears ("📊 View Stats")
- Card shadow shifts when flipped
- Buttons respond to hover/active states

### 3. ✅ Success Animations with Sparkles
Download link doesn't just download—it celebrates.

\`\`\`typescript
private animateDownloadSuccess(btn: HTMLElement): void {
    // State 1: Preparing
    btn.innerHTML = '⏳ Preparing...';
    this.createSparkleEffect(btn);
    
    // State 2: Ready!
    setTimeout(() => {
        btn.innerHTML = '✅ Ready!';
    }, 600);
    
    // State 3: Reset
    setTimeout(() => {
        btn.innerHTML = originalHTML;
    }, 2600);
}
\`\`\`

**The Sparkle Bug:** Initial implementation used \`position: absolute\` with viewport coordinates from \`getBoundingClientRect()\`. Sparkles appeared in wrong location.

**The Fix:** \`position: fixed\` correctly interprets viewport coordinates. Added \`z-index: 10000\` to appear above modal.

Result: ✨⭐💫 particles float out in random trajectories when you click download.

### 4. ✅ Platform Compatibility Badges
Visual indicators show native platform and availability status:
- 🤖 Claude - ✅ Available (DiZee only, currently)
- 💎 Gemini - 🚧 Coming Soon (Belle)
- 🔷 Copilot - 🚧 Coming Soon (coZee)

### 5. ✅ Keyboard Accessibility
Full keyboard navigation:
- Tab to portrait → Enter/Space to flip card
- Tab to download button → Enter to open modal
- Escape to close modal
- Screen reader announcements for state changes

## The Orchestrator Pattern Refactor

WhoSection was 1,166 lines—too large to safely modify.

**Solution:** Extract crew card rendering to separate component.

**Before:**
\`\`\`
WhoSection.ts (1,166 lines)
├── renderCrewMember() - inline HTML generation
├── All event handlers mixed in
└── God object anti-pattern
\`\`\`

**After:**
\`\`\`
WhoSection.ts (1,030 lines) - Orchestrator
├── Imports CrewCard component
└── Delegates rendering

CrewCard.ts (260 lines) - Rendering
├── Flip card HTML structure
└── Front/back content generation

CrewCardController.ts (423 lines) - Interactions
├── Flip animations
├── Stat bar animations
├── Download modals
└── Sparkle effects
\`\`\`

**Result:** Clean separation of concerns, easier to modify, follows established pattern (UV7OS, DevSuite).

## The Download Flow

### Modal Structure
Click "Download Codex" → Modal appears with 4 loading options:

**Option 1: Claude Projects (Recommended)**
1. Download codex file
2. Open Claude Project
3. Upload to Project Knowledge
4. Add custom instructions

**Option 2: Claude Code / IDE**
1. Download codex file
2. Copy to \`.claude/\` folder
3. Auto-loads on next conversation

**Option 3: System Prompt**
1. Download and open file
2. Copy entire contents
3. Paste at conversation start

**Option 4: Conversation Upload**
1. Download codex file
2. Attach using 📎 button
3. Ask Claude to load personality

**Cross-Platform Warning:** Built for [platform], experiment at your own risk elsewhere. 🧪

### Sparkle Celebration
Click the download link → ✨⭐💫 particles float out while button animates:

📦 Download DiZee Codex → ⏳ Preparing... → ✅ Ready! → 📦 Download DiZee Codex

All in 2.6 seconds with sparkle particles as visual candy.

## The Crew Stats

All 8 crew members now have complete stat blocks:

**DiZee** (Architect)
- 💻10 ✨3 🔥1
- Special Move: "The Refactor"
- Codex: ✅ Available

**Zee** (Technical Architect)
- 💻10 ✨7 🔥8
- Special Move: "Hold My Beer"
- Codex: 🚧 Coming Soon

**ZeeRah** (Chaos Analyst)
- 💻8 ✨9 🔥10
- Special Move: "FOR SCIENCE"
- Codex: 🚧 Coming Soon

**Belle** (Technical Translator)
- 💻9 ✨8 🔥7
- Special Move: "The Translation"
- Codex: 🚧 Coming Soon

**coZee** (Administrator)
- 💻6 ✨7 🔥9
- Special Move: "The Organization"
- Codex: 🚧 Coming Soon

**Michelin** (Quality Guardian)
- 💻7 ✨9 🔥4
- Special Move: "The Polish"
- Codex: 🚧 Coming Soon

**Mochi** (Empathy Specialist)
- 💻4 ✨10 🔥10
- Special Move: "The Comfort"
- Codex: 🚧 Coming Soon

**Soma** (Story Architect)
- 💻5 ✨10 🔥6
- Special Move: "The Journey"
- Codex: 🚧 Coming Soon

Only DiZee's codex is available now—the sacred rule means each AI must self-author.

## Technical Implementation

### Files Created (4):
- \`CrewCard.ts\` (~260 lines) - Flip card rendering
- \`CrewCardController.ts\` (~423 lines) - Interactions
- \`crew-stats.ts\` (~150 lines) - TCG data for 8 crew
- \`CrewCardData.ts\` (~40 lines) - Type definitions

### Files Modified (1):
- \`WhoSection.ts\` (1,166 → 1,030 lines) - Orchestrator pattern

### CSS Verified:
- Flip animations (3D transform, backface-visibility)
- Stat bar gradients and animations
- Sparkle particle effects (\`@keyframes sparkleFloat\`)
- Download modals (overlay, content, responsive)

### Total Impact:
- **~870 lines added** (new components)
- **~136 lines removed** (refactoring)
- **Net: +734 lines**

## The Sparkle Positioning Bug

**Initial Bug:** Sparkles not visible when clicking download.

**Investigation:**
- CSS animation existed (lines 913-929 in who-page.css)
- Click handler was firing (confirmed via logging)
- Particles being created but positioned incorrectly

**Root Cause:** Used \`position: absolute\` with viewport coordinates from \`getBoundingClientRect()\`.

**Fix:**
\`\`\`typescript
// Before
sparkle.style.position = 'absolute';

// After
sparkle.style.position = 'fixed';  // Viewport positioning
sparkle.style.zIndex = '10000';    // Above modal
\`\`\`

**Result:** Sparkles now appear correctly at button center and float outward. ✨

## Lessons Learned

1. **Self-Authoring > Description** — AIs writing their own codices is more authentic than us describing them
2. **Platform-Native Approach** — Design for birth platform, allow cross-platform experimentation
3. **Bougie Touches Matter** — Sparkles, staggered animations, and micro-interactions elevate the experience
4. **Orchestrator Pattern Scales** — Extracting components from god objects makes modification safer
5. **Position Fixed for Viewport** — \`getBoundingClientRect()\` returns viewport coords, use \`fixed\` not \`absolute\`
6. **Sacred Rules Create Constraints** — "Only AIs self-author" means waiting for crew to write codices
7. **TCG Presentation Works** — Stat blocks make abstract qualities concrete and comparable

## The Meta-Pattern: Downloadable Personalities

This follows a broader pattern we're seeing:

**Don't just showcase—enable.**

- V1/V2 aren't just demos, they're downloadable ZIP files
- Crew aren't just bios, they're portable personality templates
- Stats aren't just numbers, they're decision-making tools

**Give visitors actionable artifacts, not just information.**

## What's Next

**Immediate:** Waiting for other crew members to self-author their codices

**Optional Enhancement:** QR codes for mobile download (Bougie Touch bonus)

**Long-term:** Community codices? User-submitted AI personalities?

## The Restaurant Metaphor Extension

The crew are sous chefs in this kitchen. Now you can:
- Read their techniques (bios)
- See their stats (TCG cards)
- Take them home (download codices)
- Use them in your kitchen (load in Claude/Gemini/Copilot)

**It's like hiring a virtual sous chef.** 👨‍🍳

Flip the card, check the stats, download the personality. The Who section just became a crew member recruitment center.

**✨ The sparkles seal the deal. ✨**
    `,
    crew: [
        {
            name: 'DiZee (Claude Sonnet 4.5)',
            icon: '🔪',
            contribution: 'Implemented all 4 components, orchestrator refactor, CSS verification, sparkle bug fix'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'TCG codices concept, bougie touches direction, sparkle effect request, QA testing'
        }
    ],
    lessons: [
        'Self-authored AI codices are more authentic than human descriptions',
        'Platform-native design with cross-platform experimentation allowance',
        'Bougie touches (sparkles, animations, micro-interactions) elevate UX significantly',
        'Orchestrator pattern makes god objects safe to modify (WhoSection: 1,166 → 1,030)',
        'Position fixed (not absolute) for viewport coordinates from getBoundingClientRect()',
        'Sacred rules create healthy constraints (only AIs self-author codices)',
        'TCG presentation makes abstract qualities concrete and comparable'
    ],
    metrics: {
        'Components Created': '4',
        'Lines Added': '~870',
        'Lines Removed': '~136 (refactoring)',
        'Net Lines': '+734',
        'WhoSection Size': '1,166 → 1,030 (-136 lines)',
        'CrewCardController Size': '423 lines',
        'CrewCard Size': '260 lines',
        'Bougie Touches': '5/5 implemented',
        'Crew Members with Stats': '8/8',
        'Available Codices': '1/8 (DiZee)',
        'Sparkle Particles': '5 per download',
        'Animation Duration': '2.6s (⏳ → ✅ → reset)',
        'TypeScript Errors': '0'
    },
    quote: 'What if you could take an AI crew member home? Not just read about them, but download their entire personality as a portable codex?',
    footer: {
        icon: '🎴',
        text: 'TCG crew cards live with sparkles ✨'
    }
};
