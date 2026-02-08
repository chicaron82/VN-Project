# V2 Systems

Game logic systems — each handles a specific domain, communicating via EventBus.

## Systems

| System | Purpose |
|--------|---------|
| `AchievementSystem.ts` | 12 achievements with event-driven tracking |
| `AchievementHooks.ts` | Wires game events to achievement triggers |
| `AssetLoader.ts` | Image preloading with progress tracking |
| `ContentLoader.ts` | Route JSON loading and caching |
| `SaveSystem.ts` | Persistence layer with slot management |
| `SettingsSystem.ts` | User preferences and accessibility overrides |
| `SecretCodesSystem.ts` | Input sequence detection (Konami, `chicharon`, etc.) |
| `DevCommentarySystem.ts` | Meta-narrative developer commentary tracks |
| `EchoMemorySystem.ts` | Belle's persistent meta-awareness across loops |
| `TetherSystem.ts` | Connection strength mechanic (Tori's route) |
| `TimeMachineSystem.ts` | Backlog-based time travel with state restoration |
| `CutsceneEngine.ts` | Cutscene sequencing and playback |
| `HapticSystem.ts` | Vibration feedback control |
| `SceneRenderer.ts` | Scene display and transitions |
| `VisualCueSystem.ts` | Visual effect triggers (glitch, flash, etc.) |
| `CollectiblesSystem.ts` | Note collection tracking |
| `BootstrapTracker.ts` | Loop/timeline tracking display |
| `DifficultyProfiles.ts` | Difficulty presets (Normal, Hard, Insane) |
| `PerformanceMonitor.ts` | FPS and render performance tracking |
| `HotReloadSystem.ts` | Dev-mode hot reload support |
| `InputBinder.ts` | Input mapping and rebinding |
| `ErrorHandler.ts` | Global error handling |
| `DevSuite.ts` | Developer tools panel |
| `StatusNotificationController.ts` | Toast notification system |
| `ToriGatchiGateway.ts` | Bridge to ToriGatchi companion app |
| `ScreenshotTool.ts` | Screenshot capture utility |

### DevSuite Subsystem (`devsuite/`)

Extracted modules for the developer tools panel:

| Module | Purpose |
|--------|---------|
| `DevSuiteConsole.ts` | In-game console |
| `DevSuiteDOM.ts` | DOM inspection |
| `DevSuiteGameTools.ts` | Game state manipulation |
| `DevSuiteTabRenderer.ts` | Tab UI rendering |
| `DevLogger.ts` | Structured logging |
| `DevPresets.ts` | Quick state presets |
| `ConsoleInterceptor.ts` | Console output capture |
| `BreakpointSystem.ts` | Script breakpoints |
| `VariableWatch.ts` | Live variable monitoring |
