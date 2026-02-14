# Tech Debt Tracker

## Stub Test Files (148 assertions across 31 files)

These test files contain `expect(true).toBe(true)` or `// TODO: Add specific assertions` stubs.
They pass but don't actually test anything meaningful.

**Priority: MEDIUM** — They inflate test counts without providing coverage.

### Files (31):
- `v2/controllers/CreditsPhotoController.test.ts`
- `v2/controllers/CrewController.test.ts`
- `v2/controllers/EffectsController.test.ts`
- `v2/controllers/FullscreenController.test.ts`
- `v2/controllers/GrabHandleRepositioner.test.ts`
- `v2/controllers/ScreenshotController.test.ts`
- `v2/controllers/TipsController.test.ts`
- `v2/controllers/UIController.test.ts`
- `v2/core/ErrorBoundary.test.ts`
- `v2/core/GameEngine.test.ts`
- `v2/core/Telemetry.test.ts`
- `v2/managers/AccessibilityManager.test.ts`
- `v2/managers/OverlayManager.test.ts`
- `v2/managers/SaveManager.test.ts`
- `v2/systems/AchievementHooks.test.ts`
- `v2/systems/Analytics.test.ts`
- `v2/systems/ErrorHandler.test.ts`
- `v2/systems/HotReloadSystem.test.ts`
- `v2/systems/InputBinder.test.ts`
- `v2/systems/PerformanceMonitor.test.ts`
- `v2/systems/SceneRenderer.test.ts`
- `v2/systems/ScreenshotTool.test.ts`
- `v2/systems/ToriGatchiGateway.test.ts`
- `v2/ui/components/CarouselMomentum.test.ts`
- `v2/ui/components/ConfirmationDialog.test.ts`
- `v2/ui/components/ExpandableQuickActions.test.ts`
- `v2/ui/components/StatusBarContext.test.ts`
- `v2/ui/components/UV7AppSwitcher.test.ts`
- `v2/ui/components/UV7OSConfig.test.ts`
- `v2/utils/accessibility.test.ts`
- `v2/utils/DebugLogger.test.ts`

## Remaining ts-expect-error Suppressions (26)

After event type sync, 7 were removed. 26 remain:
- ~17 are "Reserved for future" unused properties — can only be removed when properties are used
- 2 are Chrome-only `performance.memory` API — legitimate suppression
- 2 are SwipeDetector velocity calculation properties — reserved for future use
- Others: Window global assignment, side-effect pattern, etc.

**Priority: LOW** — Most are legitimate suppressions or reserved for future work.

## Dead Code Candidates

- `v2/ui/components/GrabHandle.ts` — 520 lines, NOT wired in SystemInitializer.
  Only `GrabHandleRepositioner.ts` is used. May be an earlier implementation.
  **Action needed:** Confirm if GrabHandle.ts can be deleted.

---

*Last updated: Session following V2 stabilization (ZeeRah audit response)*
