---
description: How to port V1 features to V2 with strict parity
---

# V1 Parity Porting Workflow

**CRITICAL RULE**: Always study V1's implementation BEFORE writing V2 code.

## Step 1: Identify the V1 Source Files

Find the V1 files that implement the feature:

- Controllers: `system/*-controller.js`
- Styles: `system/*.css`
- HTML: `index.html`
- Utilities: `system/*.js`

## Step 2: Study V1's Architecture

**DO NOT SKIP THIS STEP**

Read the V1 source code and document:

1. **Class structure**: What classes are involved? How do they interact?
2. **State management**: What properties track state? Where are they initialized?
3. **Event flow**: What triggers what? What's the sequence of calls?
4. **DOM structure**: What HTML elements exist? What classes are used?
5. **CSS dependencies**: What styles are applied? What classes control behavior?

**Create notes** in the implementation plan about V1's architecture BEFORE coding.

## Step 3: Map V1 → V2 Translation

Document how V1 concepts map to V2:

- V1's global functions → V2's EventBus events
- V1's direct DOM manipulation → V2's component methods
- V1's inline event listeners → V2's EventBus subscriptions
- V1's CSS classes → V2's exact same classes (for CSS parity)

## Step 4: Implement V2 Following V1's Pattern

**Key Principles:**

1. **Use V1's exact class names** for DOM elements (CSS parity)
2. **Follow V1's event flow** (don't invent new patterns)
3. **Match V1's state tracking** (same properties, same logic)
4. **Preserve V1's timing** (haptic feedback, animations, delays)

## Step 5: Verify Against V1

Compare side-by-side:

- [ ] Visual appearance matches
- [ ] Interaction behavior matches
- [ ] State transitions match
- [ ] Edge cases handled the same way

## Common Mistakes to Avoid

❌ **DON'T**: Write V2 code first, then try to make it match V1
✅ **DO**: Study V1 thoroughly, then write V2 to match

❌ **DON'T**: Invent new event flows or state management patterns
✅ **DO**: Replicate V1's exact architecture in V2's modern syntax

❌ **DON'T**: Rename V1's CSS classes to "cleaner" names
✅ **DO**: Use V1's exact class names for automatic CSS inheritance

❌ **DON'T**: Patch bugs reactively when testing reveals differences
✅ **DO**: Go back to V1 source to understand why the difference exists

## Example: NotificationShade

**V1 Architecture** (from studying source):

- `NotificationShadeController` handles touch events directly
- Checks `window.innerWidth >= 769` to route to Sidebar vs Shade
- Tracks `isShadeOpen` state internally
- `ExpandableQuickActions` is a separate class for expansion logic

**V2 Implementation** (following V1):

- `NotificationShade.ts` listens to `input:swipe_down` directly
- Checks screen width in the swipe handler
- Tracks `isOpen` and `isExpanded` state
- Handles expansion logic in the same component (or separate if needed)

**NOT** via a separate `MobileUXController` that doesn't know shade state!

## Enforcement

When starting a V1 parity task:

1. User or agent should reference this workflow: `/v1-parity-porting`
2. First step MUST be viewing V1 source files
3. Implementation plan MUST document V1's architecture
4. Code review MUST verify V1 pattern was followed
