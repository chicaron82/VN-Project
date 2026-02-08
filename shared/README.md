# Shared

Cross-app shared modules used by both V2 and Shell.

## StatusBar/

Shared status bar components extracted to avoid duplication:

| File | Purpose |
| --- | --- |
| `index.ts` | Barrel export |
| `types.ts` | Shared type definitions |
| `ThemeManager.ts` | Theme toggle logic (shared between shell and V2) |
| `EchoSettingsManager.ts` | Echo system settings |
| `ToriSettingsManager.ts` | Tori-specific settings |
