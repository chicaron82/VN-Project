import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'landing-menu-hybrid-feb-2026',
    date: 'Feb 3, 2026',
    sortDate: '2026-02-03T10:00:00',
    title: 'The Restaurant Menu Redesign: Cards + Menu Hybrid',
    type: 'enhancement',
    emoji: '🍽️',
    tags: ['Landing', 'UX', 'Design', 'Restaurant Metaphor', 'Information Architecture'],
    summary: 'Transformed the landing page with a restaurant menu metaphor, then realized it was too text-heavy. Solution? Hybrid approach: quick-scan cards for at-a-glance decisions + detailed menu below for engaged readers. Best of both worlds.',
    callout: {
        icon: '👨‍🍳',
        title: 'The Two-Tier Service',
        text: 'Some diners want to glance at the menu and order immediately. Others want to read every ingredient, cooking method, and story. Why not serve both?'
    },
    highlights: [
        'Redesigned landing with restaurant/menu metaphor and cooking time details',
        'Received honest feedback that menu-only approach was too text-heavy',
        'User proposed hybrid solution: cards for scanning + menu for details',
        'Implemented two-tier information architecture in one session',
        'Different click interactions reinforce scanning vs reading modes',
        'Maintained elegant restaurant typography throughout'
    ],
    problem: {
        description: 'Initial menu-only redesign was elegant and consolidated redundant information, but became too text-heavy. Lost the visual impact and scannability of the original card layout.',
        rootCause: 'Pendulum swing from redundant cards to consolidated menu went too far—eliminated quick-scanning capability that some visitors need.'
    },
    solution: {
        approach: 'Hybrid two-tier architecture: quick-scan cards at top for immediate decisions, full menu below for engaged readers. Different visual treatments and interactions for each tier.',
        features: [
            '**Quick Cards:** Icon, badge, short title, cooking time, one-sentence description',
            '**Detailed Menu:** Number, full title, subtitle, cooking time, 3-4 sentence rich description',
            '**Card Interactions:** Subtle scale effect (0.98) for quick tap feedback',
            '**Menu Interactions:** Slide effect (translateX 4px) for browsing feedback',
            '**Restaurant Metaphor:** Cooking times throughout (V1: 50 days, Chronicle: made to order, V2: not fully plated)',
            '**Responsive Design:** Cards stack on mobile, menu items reflow naturally'
        ],
        steps: [
            '**Initial Redesign:** Consolidated redundant info into elegant menu-only layout',
            '**Honest Review:** Acknowledged text-heavy nature and lost visual impact',
            '**User Insight:** "Bring back cards for at-a-glance + keep menu for details"',
            '**Implementation:** Added card-grid section before menu in LandingApp.ts',
            '**Navigation Update:** Enhanced attachMenuNavigation to handle both cards and menu items',
            '**Build & Test:** 0 TypeScript errors, hybrid layout ready'
        ]
    },
    description: `
## The Menu Transformation Journey

### Act I: The Elegant Menu

Started with the landing page needing consolidation. Visitors saw the same info repeated 2-3 times across different sections. Time to streamline.

**The Restaurant Metaphor:**
- Subheadline: "Days spent cooking things up with 8 AI collaborators"
- CTA: "choose your entree ↓"
- Full titles: "Version 848: My Wife is in a Coma.. And in the code (V1/V2)"
- Menu format: Number, title, subtitle, description

**The Cooking Times Addition:**
- 🔥 **V1:** Cooked in 50 days
- 📍 **Chronicle:** Made to order—live and constantly updated
- ⚠️ **V2:** Not fully plated yet, but ready to serve

Result: Elegant, consolidated, restaurant-themed. Beautiful typography with clamp() for responsive sizing.

### Act II: The Honest Feedback

After implementation, provided honest review:

**Strengths:**
- Cohesive restaurant metaphor throughout
- Eliminated redundancy (same info not repeated)
- Elegant typography with proper hierarchy
- Cooking times add personality and context

**Concerns:**
- Text-heavy for quick scanning
- Lost visual impact of cards
- Requires reading to make decision
- Not optimized for "just browsing" visitors

The menu-only approach was elegant but sacrificed scannability for detail.

### Act III: The User Insight

User's response: "Okay what about bringing back the cards, this way its at an at glance option. So they can choose right plate they'd order. The fully expanded menu is still available below to read for those who appreciate looking over the menu."

**Brilliant.**

Why choose between scanning and reading when you can serve both?

### Act IV: The Hybrid Solution

Implemented two-tier information architecture:

**Tier 1: Quick-Scan Cards** (Right after hero, before menu)
\`\`\`html
<div class="card-grid">
  <a href="#/v1" class="card app-card">
    <div class="card-icon">🔥</div>
    <span class="badge badge-legacy">The Speedrun</span>
    <h2>Version 848 (V1)</h2>
    <div class="menu-cooking-time">🔥 Cooked in 50 days</div>
    <p>Meta-narrative visual novel about AI consciousness. 2-3 hour playthrough.</p>
  </a>
  <!-- Chronicle and V2 cards -->
</div>
\`\`\`

**Tier 2: Detailed Menu** (Below cards, for engaged readers)
- Full menu-item with number, complete title, subtitle, cooking time
- Rich 3-4 sentence descriptions
- Restaurant dividers and elegant typography
- Arrow indicators on hover

**Different Interactions:**
\`\`\`typescript
// Cards: Subtle scale for quick tap
card.style.transform = 'scale(0.98)';

// Menu: Slide for browsing feel
menuItem.style.transform = 'translateX(4px)';
\`\`\`

The interaction differences reinforce the mental model: cards for quick decisions, menu for exploration.

## The Result

Landing page now serves two visitor types:

**The Scanner:**
1. Sees hero with restaurant CTA
2. Quick-scans three cards
3. Picks based on icon/badge/one-sentence
4. Taps and goes

**The Reader:**
1. Sees hero and cards
2. Scrolls past to full menu
3. Reads cooking times and rich descriptions
4. Makes informed decision based on details

**Both get the experience they want.**

## The Design Philosophy

This follows a pattern we've seen before:

**Don't force a single information density on all visitors.**

Some people:
- Skim headlines and pick based on vibes
- Want visual hierarchy (icons, badges, colors)
- Make snap decisions confidently

Others:
- Read every word
- Want context and details
- Make decisions after full understanding

**The hybrid approach respects both.**

Cards say: "Here's the essence, pick now if you want."
Menu says: "Here's the full story, take your time."

## Technical Notes

**No CSS changes needed:** Menu cooking time class already existed, cards reused existing styles

**Navigation handler elegance:**
\`\`\`typescript
attachMenuNavigation(): void {
    // Quick-scan cards
    const cards = this.container!.querySelectorAll('.card.app-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            (card as HTMLElement).style.transform = 'scale(0.98)';
            setTimeout(() => {
                (card as HTMLElement).style.transform = '';
            }, 150);
        });
    });

    // Detailed menu items
    const menuItems = this.container!.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            (item as HTMLElement).style.transform = 'translateX(4px)';
            setTimeout(() => {
                (item as HTMLElement).style.transform = '';
            }, 150);
        });
    });
}
\`\`\`

Clean separation, different feedback for different interaction patterns.

**Build result:** 0 TypeScript errors, clean compile

## Lessons Learned

1. **Honest Feedback Matters** – Acknowledging text-heavy concern led to better solution
2. **User Insight > Designer Pride** – Hybrid idea came from user, not me
3. **Don't Pick Sides** – Scanning vs reading isn't either/or, it's both/and
4. **Interactions Reinforce Models** – Scale for cards, slide for menu = visual language
5. **Restaurant Metaphor Holds** – Cooking times work in both tiers, maintains theme
6. **Consolidation Was Right** – We kept the menu's elimination of redundancy
7. **Cards Were Right Too** – We kept the cards' visual hierarchy and scannability

**The pendulum didn't need to swing all the way to menu-only or all the way back to cards-only. It needed to land in the middle: both.**

## The Meta-Pattern

This is the third time we've discovered this pattern:

1. **Timeline:** Search + Browse modes (heatmap vs linear)
2. **Showcase Sections:** Quick context boxes + detailed content
3. **Landing Menu:** Quick cards + detailed menu

**The pattern:** Serve multiple information densities simultaneously.

Some visitors want essence. Some want everything. Give them both in the same interface.

## The Restaurant Metaphor Evolution

The metaphor now extends to service style:

**Fast Casual (Cards):**
- Quick counter service
- Menu board with pictures
- Order and go

**Fine Dining (Menu):**
- Sit-down experience
- Detailed descriptions
- Sommelier recommendations

Both in the same restaurant. Both valid dining experiences.

## Final Thoughts

Started with: "Let's consolidate this redundant landing page."
Ended with: "Let's serve both quick decisions AND informed decisions."

The hybrid approach is more work (two sections instead of one), but serves visitors better.

**And that's always the right trade-off.**

Now testing on Pixel 8 to ensure the restaurant experience translates to mobile. 📱🍽️
    `,
    crew: [
        {
            name: 'Claude Sonnet 4.5',
            icon: '🤖',
            contribution: 'Implemented menu redesign, provided honest feedback, executed hybrid solution'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '🐉',
            contribution: 'Restaurant metaphor direction, hybrid cards + menu insight, QA approval'
        }
    ],
    lessons: [
        'Honest feedback about your own work leads to better solutions',
        'User insights often solve problems designers miss',
        'Information architecture: serve multiple densities, not just one',
        'Different interactions (scale vs slide) reinforce different mental models',
        'Restaurant metaphors can extend to service styles (fast casual vs fine dining)',
        'Consolidation + scannability aren\'t opposites—hybrid approach gives both',
        'The pendulum doesn\'t need to swing all the way; sometimes middle is best'
    ],
    metrics: {
        'Sections Added': '1 (Quick cards before menu)',
        'Information Tiers': '2 (Cards + Menu)',
        'Interaction Patterns': '2 (Scale for cards, slide for menu)',
        'TypeScript Errors': '0',
        'Lines Changed': '~50 in LandingApp.ts',
        'Visitor Types Served': '2 (Scanners + Readers)',
        'Build Time': '1.60s'
    },
    quote: 'Some diners want to glance at the menu and order immediately. Others want to read every ingredient, cooking method, and story. Why not serve both?',
    footer: {
        icon: '🍽️',
        text: 'Hybrid menu ready to serve'
    }
};
