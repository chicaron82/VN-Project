# Showcase Color System Refactor Plan

**Created:** 2026-02-11  
**Goal:** Unify color system across all sections for consistent light/dark mode readability

---

## 🔍 Audit Results

**Found:** 648+ instances of hardcoded colors across CSS files

### Critical Files with Hardcoded Colors

| File | `color: #` | `background: #` | Priority |
| ------ | ------------ | ----------------- | ---------- |
| `uv7-system.css` | 40+ instances | 3 instances | HIGH |
| `unified-design.css` | 11 instances | 9 instances (!important) | HIGH |
| `pages.css` | Many instances | 10+ instances | HIGH |
| `theme-toggle.css` | Few instances | 5 instances (!important) | MEDIUM |
| `pages/evolution-page.css` | Few instances | 11 instances | MEDIUM |
| `landing-page.css` | Few instances | 5 instances | MEDIUM |
| `features/light-mode-overrides.css` | Unknown | 2 instances | **DELETE** |

### Common Hardcoded Colors Found

**Text colors:**

- `#fff`, `#000` - Should use `var(--text-primary)`
- `#e0e0e0`, `#888`, `#aaa`, `#666` - Should use `var(--text-secondary)` or `var(--text-tertiary)`
- `#00ff88` - Should use `var(--accent-primary)` or `var(--text-accent)`
- `#1a1a1a` - Should use `var(--text-primary)` in light mode context

**Backgrounds:**

- `#ffffff`, `#fff` - Should use `var(--bg-card)` or `var(--bg-secondary)`
- `#1a1a1a`, `#1e1e1e`, `#252526` - Should use `var(--bg-secondary)` in dark mode
- `#f5f5f5`, `#f8f9fa` - Should use `var(--bg-secondary)` in light mode

### Red Flags Found

1. **`!important` overrides** in `unified-design.css` and `theme-toggle.css`
   - Fighting with existing styles instead of fixing root cause

2. **`light-mode-overrides.css` exists**
   - Bandaid fix file that shouldn't exist
   - Should be deleted after refactor

3. **Inconsistent patterns**
   - Some files use variables, others hardcode
   - No clear pattern for when to use which

---

## 🎯 Refactor Strategy

### Phase 1: Core System Files (Priority: CRITICAL)

**Impact:** These affect multiple sections

1. **`uv7-system.css`** (62KB, 40+ hardcoded colors)
   - Replace hardcoded grays (`#e0e0e0`, `#888`) with `var(--text-secondary)`
   - Replace UV7 green (`#00ff88`) with `var(--accent-primary)`
   - Replace white/black (`#fff`, `#000`) with semantic variables

2. **`unified-design.css`** (13KB, 20 hardcoded colors)
   - Remove `!important` overrides
   - Replace background colors with CSS variables
   - Ensure text uses semantic color vars

3. **`pages.css`** (59KB, 10+ hardcoded backgrounds)
   - Replace white (`#fff`, `#ffffff`) with `var(--bg-card)`
   - Replace light grays with `var(--bg-secondary)`
   - Update text colors to use variables

### Phase 2: Section-Specific Files (Priority: HIGH)

1. **`pages/evolution-page.css`** (11 hardcoded backgrounds)
   - Replace light/dark mode specific backgrounds

2. **`landing-page.css`** (5 hardcoded backgrounds)
   - Replace black backgrounds with `var(--bg-primary)`

3. **`theme-toggle.css`** (5 hardcoded with `!important`)
   - Remove aggressive overrides
   - Use semantic variables

### Phase 3: Cleanup (Priority: MEDIUM)

1. **DELETE `features/light-mode-overrides.css`**
   - Bandaid fix that shouldn't exist
   - Remove import from `showcase.css`

2. **Audit remaining CSS files**
   - `system-banner.css` - status indicator colors
   - `shade.css` - notification shade colors
   - `blog.css`, `components.css`, etc.

---

## 🧪 Verification Plan

### Manual Testing (User-Driven)

**Test Procedure:**

1. Run `npm run dev` in showcase directory
2. Open `http://localhost:5173` in browser
3. Navigate through each section:
   - Home
   - Journal  
   - Workflow
   - Spotlight
   - Evolution
   - Experiment
   - Who
4. For EACH section:
   - ✅ Verify all text is readable in **dark mode** (default)
   - ✅ Toggle to **light mode** → verify all text is still readable
   - ✅ Check cards, buttons, backgrounds are consistent
   - ✅ Look for any hardcoded colors that don't switch with theme

**Expected Result:**

- All sections readable in both modes
- No text disappearing or becoming unreadable
- Consistent color palette across all sections
- Theme toggle affects all elements

### Automated Verification (Optional)

**CSS Grep Test:**

```bash
# After refactor, check for remaining hardcoded colors
grep -r "color: #" showcase/css/ | wc -l  # Should be minimal
grep -r "background: #" showcase/css/ | wc -l  # Should be minimal
```

Target: < 20 hardcoded colors total (only for special cases like status indicators)

---

## 📋 Implementation Checklist

### Preparation

- [x] Audit CSS files for hardcoded colors
- [x] Identify priority files
- [ ] Create backup branch (optional safety)

### Execution

#### Phase 1: Core Files

- [ ] Refactor `uv7-system.css`
  - [ ] Replace text colors with variables
  - [ ] Replace background colors with variables
  - [ ] Test both themes
- [ ] Refactor `unified-design.css`
  - [ ] Remove `!important` overrides
  - [ ] Replace hardcoded colors with variables
  - [ ] Test both themes
- [ ] Refactor `pages.css`
  - [ ] Replace backgrounds with variables
  - [ ] Replace text colors with variables
  - [ ] Test both themes

#### Phase 2: Section Files

- [ ] Refactor `pages/evolution-page.css`
- [ ] Refactor `landing-page.css`
- [ ] Refactor `theme-toggle.css`

#### Phase 3: Cleanup

- [ ] Delete `features/light-mode-overrides.css`
- [ ] Remove import from `showcase.css`
- [ ] Final audit for remaining hardcoded colors

### Testing

- [ ] Manual test all sections in dark mode
- [ ] Manual test all sections in light mode
- [ ] User reviews and confirms readability
- [ ] (Optional) Run grep to verify minimal hardcoded colors remain

---

## 🎨 After Color Unification

Once colors are unified and both themes work perfectly:

1. ✅ **Bougie Typography** - Safe to enhance without readability concerns
2. ✅ **Visual Imagery** - Add illustrations knowing color system is solid
3. ✅ **Polish** - Gradients, shadows, effects on stable foundation

---

## 📝 Notes

**Why this order?**

- Core files affect multiple sections (biggest impact)
- Section files are isolated (lower risk)
- Cleanup last (verify new system works first)

**Estimated Impact:**

- 648+ hardcoded colors → ~20 or fewer
- Both themes guaranteed readable
- Foundation for typography and visual enhancements
