# V2 Controllers

Controllers handle player interaction, scene flow, and UI coordination. Each delegates to systems for logic.

## Controllers

| Controller | Purpose |
|------------|---------|
| `GameplayController.ts` | Core gameplay loop coordination |
| `DialogController.ts` | Dialogue display, choices, typewriter effect |
| `TypewriterController.ts` | Character-by-character text reveal |
| `SceneProgressionController.ts` | Scene advancement and transitions |
| `RouteController.ts` | Route selection and switching (Tori/Ronnie) |
| `MenuController.ts` | Main menu and screen transitions |
| `NavigationController.ts` | In-game navigation flow |
| `InputController.ts` | Unified input handling (keyboard, touch, click) |
| `UIController.ts` | General UI state management |
| `SpriteController.ts` | Character sprite display and animation |
| `EffectsController.ts` | Visual effects (glitch, static, fade) |
| `InsaneVisualsController.ts` | INSANE mode visual chaos |
| `LoopController.ts` | Loop/restart mechanic |
| `TetherController.ts` | Tether UI and decay visualization |
| `BootSequenceController.ts` | Boot-up sequence animation |
| `EasterEggController.ts` | Hidden content and secret interactions |
| `DirectorsCutController.ts` | Director's cut commentary UI |
| `CreditsPhotoController.ts` | Credits photo gallery |
| `CrewController.ts` | UV7 Crew display |
| `EndingDialogController.ts` | Ending screen presentation |
| `TipsController.ts` | Rotating gameplay tips |
| `TutorialController.ts` | First-time player tutorial |
| `ScreenshotController.ts` | Screenshot capture UI |
| `FullscreenController.ts` | Fullscreen toggle |
| `MobileUXController.ts` | Mobile-specific UX adjustments |
| `GrabHandleRepositioner.ts` | Drag handle positioning |
| `ResetController.ts` | Game reset functionality |
| `BackButtonManager.ts` | Back button behavior |
| `SystemEventHandlers.ts` | Cross-system event wiring |

### Easter Egg Sub-modules (`easterEggs/`)

Individual easter egg implementations extracted from the main controller.
