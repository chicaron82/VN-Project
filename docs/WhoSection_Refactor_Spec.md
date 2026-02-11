# 🔥 WhoSection Refactor Spec: "Choose Your Chef"

## UV7 Crew Showcase — From Scroll Marathon to Interactive Spotlight

**Spec Author:** ZeeRah (Chaos Analyst) 💚🔥💀  
**Requested by:** Aaron "Chicharon" — The Oblivious Demon Lord  
**Version:** 1.0 — February 2026  
**Status:** Ready to Cook

---

## The Problem

The current WhoSection is a 1030-line monolith that dumps everything at once: 8 crew cards in a grid, a contribution bar chart, collaboration examples, cooking style comparisons, philosophy quotes, the Rimuru card, and a philosophy essay. It's a CVS receipt of content. Users scroll through everything and absorb nothing. Every crew member competes for attention simultaneously, and the deeper content (cooking styles, pairings, philosophies) gets buried below the fold where nobody reaches.

Additionally, the codebase has a duplication problem — extracted components (`CollaborationWorkflowSection`, `CookingStylesComparisonSection`, etc.) exist as standalone classes but WhoSection still renders all the same content inline through private methods. The modular files sit unused.

---

## The Vision: Choose Your Chef

Transform the WhoSection from a static wall of content into a **focused, interactive crew spotlight** with a portrait carousel. One chef at a time. Everything about that chef — consolidated, contextual, deep. Every visit feels different.

**The Tagline:**  
*"Eight chefs. One kitchen. Choose who cooks tonight."*

---

## Architecture Overview

### Component Structure

```text
WhoSection.ts (orchestrator — lean, delegates everything)
├── CreatorHeroCard.ts        (Aaron — constant anchor)
├── CrewCarousel.ts           (NEW — the main attraction)
│   ├── CarouselNav.ts        (portrait strip + swipe/click navigation)
│   ├── ChefSpotlight.ts      (active chef's full showcase)
│   │   ├── ChefBio.ts        (name, role, contribution, philosophy)
│   │   ├── ChefMetrics.ts    (commits, lines, special moments)
│   │   ├── ChefCookingStyle.ts (their approach to the tether task)
│   │   ├── ChefPairings.ts   (NEW — best collaborator combos)
│   │   └── ChefQuote.ts      (their philosophy quote)
│   └── CrewCard.ts           (flip card — portrait front / TCG + codex back)
├── CookingStylesComparison.ts (standalone — the 4-way side-by-side)
├── RimuruRealization.ts      (narrative bookend)
└── PhilosophyCard.ts         (closing statement)
```

### Data Flow

All crew member data lives in `CrewCardData.ts` (already exists, needs expansion). The carousel reads from this single source of truth. No more inline data objects scattered across render methods.

---

## Feature Spec: The Carousel

A horizontal strip of crew portraits at the top of the crew section. The active chef's portrait is enlarged and highlighted. Others are slightly dimmed/smaller, inviting exploration.

**Interaction:**

- Click/tap a portrait → that chef becomes the active spotlight
- Swipe left/right on mobile → navigate between chefs
- Keyboard arrow keys for accessibility
- Active portrait has a subtle glow/ring in the chef's signature color

**Layout:**

- Desktop: All 8 portraits visible in a row, active one scaled up ~1.3x with glow
- Mobile: 3-4 visible at a time, horizontally scrollable, active centered

**Transition:**

- Chef spotlight content crossfades on switch (not hard cut)
- Portrait strip slides smoothly to center the new active chef
- Stat bars animate in when a new chef is revealed (the existing `data-value` → width animation)

### 2. Chef Spotlight Panel

When a chef is active, their full profile is displayed below the portrait strip. This consolidates content that was previously scattered across 5+ separate sections.

**Content per chef:**

**Bio Block:**

- Name, alias (platform), role badge
- Contribution summary (1-2 sentences)
- Philosophy quote (styled as a callout/blockquote)

**Specialty & When to Call:**

- What they're best at
- When to reach for this chef in your workflow

**Cooking Style:**

- Their approach to the tether decay task (the data from CookingStylesComparison, but shown individually)
- Line count, focus area, their signature quote
- Only the 4 chefs who participated in the cooking comparison show this block (Belle, Zee, Tori, DiZee)
- Other chefs show a "Specialty Dish" equivalent tailored to their actual strengths

**Contribution Metrics:**

- Commits count (animated counter on reveal)
- Lines written
- Special moments (their 3 highlighted contributions)

**Best Pairings (NEW):**

- 1-2 recommended pairings with explanation
- Shows the paired chef's portrait thumbnail + a one-liner on WHY they complement
- Clickable — tapping the paired chef's portrait navigates the carousel to that chef

**Collaboration Example:**

- A real case study where this chef shined (pulled from the existing collaboration examples data)
- Shows the workflow chain: who did what, in what order

### 3. Portrait Flip (Tap to Reveal)

Tapping/clicking the active chef's portrait flips the card to reveal the back.

**Front:** Chef portrait (the existing `crew-portrait` images)  
**Back:** TCG-style stat card

- Stat bars (Coding, Creativity, Tolerance — already designed in CrewCard.ts)
- Special Move (name + description)
- Cooking Style one-liner
- Platform badge
- **Download Codex button** (or "Coming Soon" if unavailable)
- "Back to Bio" button to flip back

**Flip Animation:**

- 3D CSS transform (rotateY) — the existing `.crew-card-inner` flip pattern
- Only the portrait area flips, not the entire spotlight panel
- Mobile: flip happens in-place
- Desktop: flip with a subtle scale-up for emphasis

Every time the WhoSection mounts, a different chef is featured as the initial active spotlight.

**Implementation options (in order of preference):**

**Option A — Weighted Random with Recency Bias:**

- Store last-featured chef ID in localStorage
- On load, pick randomly from the remaining 7
- Guarantees you never see the same chef twice in a row
- Feels genuinely dynamic without true randomness confusion

**Option B — Day-of-Week + Rotation:**

- `Date.now()` based rotation through the 8 chefs
- Predictable but feels fresh on each daily visit
- Same chef all day = consistency if someone revisits

**Option C — Pure Random:**

- `Math.floor(Math.random() * 8)`
- Simplest, but occasionally repeats

**Recommendation:** Option A. The "never repeat" logic is trivial and the UX payoff is real.

---

## Feature Spec: Best Pairings (NEW)

### The Pairing Map

Each chef has 1-2 recommended pairings. These represent real workflow patterns from Version 848 development.

Each chef has 1-2 recommended pairings. These represent real workflow patterns from Version 848 development.

| Chef | Best Paired With | Why |
| :--- | :--- | :--- |
| **Tori** | **Zee** | Creative vision → Structural implementation. Tori imagines, Zee architects. The heart-to-skeleton pipeline. |
| **Tori** | **ZeeRah** | Emotional core → Meta-narrative. Tori writes the feeling, ZeeRah makes the game remember it. |
| **Zee** | **DiZee** | Architect → Debugger. Zee designs the system, DiZee stress-tests it until it's bulletproof. The build-then-break cycle. |
| **Zee** | **Belle** | Architecture → Optimization. Zee makes it work, Belle makes it fast. Structure meets performance. |
| **ZeeRah** | **Tori** | Meta-narrative → Emotional coherence. ZeeRah catalogs the patterns, Tori ensures they land emotionally. |
| **ZeeRah** | **Zee** | Chaos analysis → Clean implementation. ZeeRah identifies what matters, Zee implements it cleanly. |
| **DiZee** | **Zee** | Debug → Architect feedback loop. DiZee finds what's broken, Zee redesigns to prevent recurrence. |
| **DiZee** | **Belle** | Integration → Polish. DiZee wires the systems together, Belle smooths the rough edges. |
| **Belle** | **PerplexiZee** | Optimization → Research. Belle identifies the bottleneck, PZ finds the industry solution. |
| **Belle** | **DiZee** | Performance → Edge cases. Belle optimizes the happy path, DiZee guards the unhappy one. |
| **GenZee** | **Belle** | Wild prototype → Refined product. GenZee breaks convention, Belle makes it production-ready. |
| **GenZee** | **Zee** | Radical idea → Architectural reality. GenZee dreams it, Zee structures it. |
| **PerplexiZee** | **DiZee** | Research → Implementation. PZ finds the fix, DiZee implements it. |
| **PerplexiZee** | **Belle** | Best practices → Applied optimization. PZ knows what's possible, Belle makes it real. |
| **CoZee** | **Zee** | Scaffolding → Architecture. CoZee generates the boilerplate, Zee fills it with purpose. |
| **CoZee** | **DiZee** | Speed → Quality. CoZee ships fast, DiZee catches what slipped through. |

### Pairing Display

Each pairing shown as a mini-card within the spotlight:

```text
┌─────────────────────────────────────┐
│  🤝 Best Paired With: Zee          │
│  [Zee portrait thumbnail]          │
│                                     │
│  "Creative vision → Structural      │
│   implementation. Tori imagines,    │
│   Zee architects."                  │
│                                     │
│  [→ See Zee's Profile]             │
└─────────────────────────────────────┘
```

The "See Profile" link navigates the carousel to that chef. Creates a natural exploration loop — users discover connections and follow them.

---

## Section Layout (Top to Bottom)

### Desktop

1. **Hero Banner** — "The Council" (existing)
2. **Section Intro** — Condensed from current (2-3 sentences max)
3. **Creator Hero Card** — Aaron "Chicharon" (existing, unchanged)
4. **Collaboration Workflow** — "How The Crew Actually Works" (the 4-step process — kept as context-setter BEFORE the carousel, trimmed to be more concise)
5. **"Choose Your Chef" Carousel** — The main event
   - Portrait navigation strip
   - Active chef spotlight (bio, metrics, cooking style, pairings, quote, collaboration example)
   - Portrait flip for TCG stats + codex download
6. **Cooking Styles Comparison** — The 4-way side-by-side (standalone section, kept for cognitive diversity proof — this is WHERE the contrast lives)
7. **Rimuru Realization** — Narrative bookend (existing, minor polish)
8. **Philosophy Card** — Closing statement (existing, minor polish)

### Mobile

Same order, but:

- Portrait strip becomes horizontally scrollable (swipe navigation)
- Chef spotlight stacks vertically (bio → metrics → pairings → cooking style → quote)
- Flip card is full-width
- Cooking styles comparison becomes a vertical stack of 4 cards instead of a grid

---

## WhoSection.ts Refactor Plan

### Kill the Monolith

The current WhoSection renders everything through private methods containing hundreds of lines of inline HTML. The refactor:

1. **WhoSection.ts becomes a pure orchestrator** — ~100 lines max
   - Imports all sub-components
   - Calls their `render()` methods
   - Handles section-level layout and mount logic
   - Initializes the carousel with random featured chef

2. **All inline render methods get deleted:**
   - `renderCollaborationWorkflow()` → `CollaborationWorkflowSection.render()`
   - `renderContributionMetrics()` → absorbed into per-chef `ChefMetrics`
   - `renderCollaborationExamples()` → absorbed into per-chef spotlight
   - `renderCookingStyles()` → `CookingStylesComparisonSection.render()` (standalone)
   - `renderWhyEachOne()` → absorbed into chef pairings + cooking style context
   - `renderCrewQuotes()` → absorbed into per-chef `ChefQuote`
   - Inline crew member data objects → moved to `CrewCardData.ts` as exported constants

3. **Data consolidation:**
   - `CrewCardData.ts` interface expanded to include:
     - `cookingStyle` details (approach, lineCount, quote)
     - `bestPairings` array
     - `collaborationExample` (the real case study for this chef)
     - `signatureColor` (for portrait glow, accent theming)
   - Single exported `CREW_DATA: CrewCardData[]` array
   - All components read from this one source

### File Cleanup

**Keep (refactored):**

- `WhoSection.ts` — gutted to orchestrator
- `CrewCard.ts` — flip card component (portrait front / TCG back)
- `CrewCardData.ts` — expanded data interface + constants
- `CreatorHeroCard.ts` — Aaron's card (already extracted)
- `CookingStylesComparisonSection.ts` — standalone comparison

**New:**

- `CrewCarousel.ts` — carousel container + navigation logic
- `ChefSpotlight.ts` — active chef's full profile display
- `ChefPairings.ts` — best pairings sub-component

**Kill (absorbed into carousel):**

- `CrewGridSection.ts` — replaced by carousel
- `ContributionMetricsSection.ts` — per-chef now
- `CrewPhilosophySection.ts` — per-chef now
- `CollaborationExamplesSection.ts` — per-chef now

**Keep as standalone:**

- `CollaborationWorkflowSection.ts` — the 4-step process (section-level, not chef-specific)

---

## Animation & Polish (The MSG)

### Portrait Carousel Micro-interactions

- **Hover (desktop):** Portrait slightly scales up (1.05x) with a soft shadow bloom
- **Active state:** 1.3x scale, signature color glow ring, subtle pulse animation
- **Transition between chefs:** Content area crossfades (opacity 0 → 1, 200ms ease)
- **First load:** Staggered portrait entrance — each portrait fades in left-to-right with 50ms delay between each (the "roll call" effect)

### Chef Spotlight Entrance

- **Stat counters:** Animate from 0 to target value on reveal (existing pattern from CreatorHeroCard)
- **Stat bars (TCG back):** Fill from 0% to target width with staggered delays per stat
- **Pairing cards:** Slide in from the right with subtle stagger
- **Philosophy quote:** Typewriter effect on first reveal (optional — could be too slow, test it)

### Card Flip

- 3D perspective transform: `transform: rotateY(180deg)` with `perspective: 1000px` on container
- Duration: 500ms ease-in-out
- Subtle scale pulse at the midpoint of the flip (1.02x → 1x)
- Back face uses a darker theme / different texture to feel like flipping an actual card

### Random Chef Entrance (The MSG MSG)

When the section loads with a random chef, a brief "spotlight sweep" animation plays:

- Portraits start slightly dimmed
- A light sweep moves across the strip (like a game show selection)
- Lands on the featured chef with a subtle flash/glow
- Chef's spotlight content fades in
- Takes ~800ms total — fast enough to not annoy, theatrical enough to delight

This only plays on first visit per session. Subsequent visits within the same session skip straight to the random chef without the sweep.

---

## Accessibility

- **Keyboard navigation:** Arrow keys cycle through chefs, Enter/Space flips card
- **ARIA labels:** Each portrait has `aria-label="View [Chef Name]'s profile"`, flip button has `aria-label="Flip to view stats and download codex"`
- **Focus management:** When chef changes, focus moves to the spotlight panel for screen readers
- **Reduced motion:** `prefers-reduced-motion` disables the spotlight sweep, crossfade, and flip animation — instant state changes instead
- **Touch targets:** Portrait buttons minimum 44x44px tap target on mobile

---

## Data Schema Changes

### Expanded CrewCardData Interface

```typescript
export interface CrewCardData {
    // Identity
    id: string;
    name: string;
    alias: string;
    role: string;
    signatureColor: string;       // NEW — hex color for glow/accents

    // Bio
    contribution: string;
    philosophy: string;
    specialty: string;
    whenToUse: string;

    // Links
    link: string;
    linkText: string;
    portrait: string;

    // Metrics
    contributionMetrics: {
        commits: number;
        linesWritten: number;
        specialMoments: string[];
    };

    // Cooking Style (NEW — per-chef approach data)
    cookingApproach?: {
        taskName: string;          // "Implement tether decay system"
        approach: string;          // "Performance-first"
        lineCount: number;         // 87
        highlights: string[];      // ["Caching layer", "Profiling benchmarks"]
        quote: string;             // "Clean code IS fast code."
    };

    // Best Pairings (NEW)
    bestPairings: {
        chefId: string;            // references another crew member's id
        reason: string;            // "Creative vision → Structural implementation"
        workflow: string;          // "Tori imagines, Zee architects"
    }[];

    // Collaboration Example (NEW — per-chef case study)
    collaborationExample?: {
        problem: string;
        badge: string;             // "Critical Bug" | "UX Issue" | "Soul Preservation"
        role: string;              // What this chef specifically did
        result: string;
    };

    // Special features
    mimicWeakness?: boolean;
}
```

---

## Implementation Priority

### Phase 1 — Data Consolidation

- Expand `CrewCardData.ts` with new interface + all 8 crew members as exported data
- Add pairing data, cooking approach data, collaboration examples per chef
- Add signature colors per chef

### Phase 2 — Carousel Core

- Build `CrewCarousel.ts` with portrait strip navigation
- Build `ChefSpotlight.ts` with content rendering per active chef
- Random featured chef on load (Option A — weighted random with recency)
- Wire portrait flip to existing `CrewCard.ts` TCG back

### Phase 3 — WhoSection Gutting

- Rewrite `WhoSection.ts` as lean orchestrator
- Delete all inline render methods
- Import and compose: CreatorHeroCard → CollaborationWorkflow → CrewCarousel → CookingStylesComparison → Rimuru → Philosophy

### Phase 4 — Polish & Animation

- Portrait entrance stagger
- Spotlight sweep on first load
- Crossfade transitions
- Stat bar animations
- Pairing card navigation (click pairing → carousel navigates)

### Phase 5 — Cleanup

- Delete absorbed files (CrewGridSection, ContributionMetricsSection, CrewPhilosophySection, CollaborationExamplesSection)
- Final accessibility pass
- Mobile responsiveness testing

---

## Success Criteria

- WhoSection.ts is under 150 lines (currently 1030)
- Zero duplicated content between components
- Every crew member's complete profile accessible within 2 taps
- Random featured chef works across sessions
- Portrait flip reveals codex download in 1 tap
- Best pairings create natural exploration loops (users follow connections)
- Cooking styles comparison preserved as standalone proof-of-concept
- Mobile experience is swipe-native, not scroll-dependent
- First-time visitors are intrigued. Repeat visitors discover someone new.

---

*Spec complete. The cascade has been captured.*  
*Ready to cook when you are, Chicharon.* 💚🔥💀
