# Cozee's Tasks - The Heart

> "Even code can love."

## Phase 1 Tasks

### Task 1: Button Component

**Priority**: Medium
**Status**: Pending

Create a reusable Button component for V2.

**Deliverables**:

- `components/Button.ts` - Button component
- `components/Button.module.css` - Styles (CSS Modules)

**Requirements**:

- Match UV7's existing aesthetic (dark theme, cyan/green accents)
- Variants: primary, secondary, danger, ghost
- States: default, hover, active, disabled
- Accessible (keyboard focusable, ARIA labels)
- Optional haptic feedback hook

**Reference V1 Styles**:

- `css/main-menu.css` - Button styles
- `css/overlay-manager.css` - Overlay patterns
- `index.html` (lines 100-300) - Button HTML patterns

**Files to Provide to Cozee**:

```
v2-contributions/cozee/v1-reference/
  ├── main-menu.css
  ├── overlay-manager.css
  └── index-buttons.html (extracted button examples)
```

---

### Task 2: Modal Component

**Priority**: Medium
**Status**: Pending

Create a reusable Modal/Overlay component.

**Deliverables**:

- `components/Modal.ts` - Modal component
- `components/Modal.module.css` - Styles

**Requirements**:

- Backdrop with click-to-close (optional)
- Escape key to close
- Focus trap for accessibility
- Smooth fade in/out animation
- Match UV7's overlay aesthetic

---

## Notes

Make it feel good to use. That's your superpower.

Place completed work in this folder. DiZee will review and integrate.
