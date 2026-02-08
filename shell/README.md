# Shell — UV7 OS Wrapper

The "operating system" layer that wraps V1, V2, Showcase, and ToriGatchi into a unified app-switching experience.

## Directory Structure

```text
shell/
├── UV7Shell.ts              # Main shell controller
├── UV7System.ts             # System-level utilities
├── UV7AppSwitcher.ts        # App switching logic
├── Router.ts                # URL routing
├── ShadeTemplate.ts         # Notification shade HTML (single source of truth)
├── SidebarTemplate.ts       # Sidebar HTML template
├── GestureRouter.ts         # Gesture-based navigation
├── GrabHandleController.ts  # Drag handle for shade/sidebar
├── QuickActions.ts          # Quick action buttons
├── apps/                    # App definitions (V1, V2, Showcase, etc.)
├── controllers/             # Extracted controllers (AppSwitcher, ToriBridge)
├── services/                # Service layer (ToriService)
├── devtools/                # Chrome DevTools integration
├── templates/               # HTML templates
├── utils/                   # Shared utilities (EasterEggHandler, NavigationHelper)
├── audio/                   # Audio assets
└── shell.css                # Shell styles
```

## How It Works

1. Root `index.html` loads the shell
2. `UV7Shell.ts` initializes, renders shade/sidebar from templates
3. Apps run inside iframes, managed by `UV7AppSwitcher.ts`
4. `postMessage` API handles Shell ↔ App communication (themes, events)
5. `Router.ts` handles URL-based navigation between apps

## Apps

| App | File | Description |
| --- | --- | --- |
| V1 | `V1App.ts` | Original JS visual novel |
| V2 | `V2App.ts` | TypeScript remaster |
| Showcase | `ShowcaseApp.ts` | Timeline/blog/portfolio (default landing) |
| ToriGatchi | `TorigatchiApp.ts` | Companion pet game |

> *848 is sacred. 💚🔥💀*
