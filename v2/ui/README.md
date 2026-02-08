# V2 UI

All visual components, screens, effects, and styles for V2.

## Structure

```
ui/
├── components/    # Reusable UI widgets (StatusBar, Sidebar, Shade, etc.)
├── screens/       # Full-screen views (MainMenu, RouteSelect, Credits, etc.)
├── effects/       # Visual effects (AnimatedStats, TiltEffect)
├── styles/        # CSS files (variables, layout, component styles)
├── utils/         # UI utilities (ActionDispatcher, UXEnhancements)
└── index.ts       # Barrel export
```

## Components (`components/`)

Core interactive widgets:

| Component | Purpose |
|-----------|---------|
| `GameLayout.ts` | Main game DOM structure |
| `StatusBar.ts` | Top status bar (breadcrumbs, mail, app switcher preview) |
| `Sidebar.ts` | Side navigation panel |
| `NotificationShade.ts` | Pull-down notification panel |
| `DialogBubble.ts` | Dialogue display bubble |
| `BacklogUI.ts` | Time machine backlog viewer |
| `SaveLoadModal.ts` | Save/load slot interface |
| `SettingsModal.ts` | Settings panel |
| `NotesViewer.ts` | Collectible notes reader |
| `UV7AppSwitcher.ts` | In-game app switcher |
| `UV7OS.ts` / `UV7OSConfig.ts` | OS-like shell integration |
| `MenuCarousel.ts` | Carousel navigation |
| `BootSequence.ts` | Boot-up animation |
| `LoadingOverlay.ts` | Loading screen |
| `CodeRain.ts` | Matrix-style code rain effect |
| `GrabHandle.ts` | Draggable handle widget |
| `SkipButton.ts` | Dialogue skip button |
| `TipsOverlay.ts` | Tips display |

## Screens (`screens/`)

| Screen | Purpose |
|--------|---------|
| `MainMenu.ts` | Title screen |
| `RouteSelect.ts` | Route picker (Tori/Ronnie) |
| `CreditsScreen.ts` | Credits roll |
| `CrewScreen.ts` | UV7 Crew showcase |
| `DirectorsCutScreen.ts` | Director's commentary |
| `RetryScreen.ts` | Retry prompt |
