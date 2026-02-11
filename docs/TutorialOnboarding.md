what do you think of an onboarding thing for tori's route to go over the mechanics so people are aware? once acknowledged it doesn't show up again. comes in stages. highlighting the tether drain, what the hold on button does, what happens when new notes are received etc..

Why This Works
Progressive Disclosure - Staging the tutorial prevents overwhelming players. Teaching tether drain first, then Hold On, then notes as they're encountered is the right approach. Contextual Learning - Players learn by doing rather than reading a wall of text upfront. Show the mechanic right when it becomes relevant. Persistent Flag - One-time display respects returning players and prevents annoyance.

Implementation Approach
I'm thinking something like:
Tether Drain Tutorial - Triggers early in Act 1, maybe 2-3 dialogue exchanges in. Pause the game, highlight the tether bar, explain passive decay. "Your connection to Tori is fragile. Watch the tether meter - it drains over time."
Hold On Button Tutorial - Triggers when tether drops to ~85% for the first time. Highlight the button, explain how it restores connection. "When the tether weakens, use Hold On to strengthen your bond."
Notes Tutorial - Triggers on first note collection. Highlight the notes icon, red dot indicator, explain what notes contain. "Tori's fragmented memories appear as notes. They reveal pieces of her consciousness."
Echo Voices Tutorial (optional) - If Echo mechanic is distinct enough, might warrant its own stage when first encountered.

Technical Considerations
Store tutorial progress in StateManager (e.g., tutorialStages: { tetherDrain: false, holdOn: false, notes: false })
Use modal overlays with semi-transparent backdrop and spotlight effect on highlighted element
Pause tether decay during tutorial moments (don't punish players for reading)
Allow dismissal with clear "Got it" button
Consider adding a "Tutorial" option in settings to replay these if players want a refresher

UX Polish Ideas
Dismissible but not skippable on first playthrough - Forces acknowledgment but doesn't trap players
Visual hierarchy - Keep tutorial text concise (2-3 sentences max per stage)
Haptic feedback on tutorial appearance (gentle pulse)
Adaptive triggering - If player uses Hold On before the tutorial triggers, skip that stage (they figured it out)

Unified Tutorial System Design
Since both routes need tutorials now, let's make one cohesive system:
tutorial-manager.js Features
Stage-Based Tutorials:
Tori Route: tetherDrain, holdOn, firstNote
Ronnie Route: notesUnlocked, skipUnlocked
Shared/Meta: Could add timeMachine, achievements if needed
Smart Triggering:
Context-aware (knows which route is active)
One-time per profile (persistent flag in localStorage)
Skips stages if player already demonstrated understanding
Interactive Tutorials:
Not just modals - can manipulate the actual UI
Open notes viewer, highlight elements, show actual note content
Pause/resume game state appropriately
Polish Elements:
Spotlight effect on highlighted elements (dim everything else)
Animated arrows/pointers for "look here" moments
Haptic pulses when tutorial appears
Smooth transitions between tutorial stages
"Show me" vs "I got it" options where appropriate
Ronnie Route Specific Flow

End Game → Ending Achieved
  ↓
[Teaser Overlay]
"Your connection revealed fragments of Tori's consciousness.
Notes are now available throughout Ronnie's route."
[Continue]
  ↓
[Skip Unlock Overlay]  
"You can now skip previously read dialogue on replays.
Hold spacebar or tap Skip button."
[Continue]
  ↓
[Guided Note Tutorial - INTERACTIVE]

- Auto-open notes viewer
- Spotlight the first note in inbox
- Animate opening it
- Show note content in viewer
- Red dot clears automatically
"This is Tori's first memory fragment.
Collect all notes to piece together the full story."
[Got it]
  ↓
Close tutorial, mark notesUnlocked tutorial as complete

1. First note for Ronnie route tutorial - Which note should we show in the guided tutorial? the teaser note, letting the player know that notes can be collected

2. Tutorial skip setting - Should there be a "Don't show tutorials again" option? YES

3. Tether tutorial timing - When exactly in Tori's route should it trigger?

4. Hold On timing - At 85% tether threshold or at a specific story moment?
3 and 4 i think should be done together. 85% works

also let's add testing along the way to make sure it's working
