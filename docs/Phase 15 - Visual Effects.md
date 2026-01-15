# Phase 15: The Visual Layer (V1 Effects Port)

## Overview

Porting the signature visual effects that defined V1's "bougie" aesthetic.
Focus on faithful reproduction of canvas-based effects (Code Rain) and CSS animations (Shake, Glitch).

**Status:** 🚧 In Progress

---

## 15a: Code Rain (Matrix Effect) ✅

**Status:** Complete
**Feature:** The "Matrix-style" digital rain overlay with UV7 crew names.

### Implementation

- **Component:** `src/ui/components/CodeRain.ts` (New)
- **Integration:** Wired into `src/ui/components/VisualEffectsLayer.ts`
- **Faithful Details:**
  - Exact character set: `ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848`
  - Speed: 2x (landscape) / 3x (portrait) behavior preserved
  - Color: `#00ffff` (Cyan) defaults
  - Fade trail: `rgba(0, 0, 0, 0.05)`

### Verification

- ✅ Unit tests in `CodeRain.test.ts` passing
- ✅ Replaces placeholder text in VisualEffectsLayer

---

## Remaining Scope (Gap Analysis)

- [ ] Screen Shake (CSS/JS)
- [ ] Glitch Effects (Canvas/CSS)
- [ ] Flash/Strobe (CSS)
