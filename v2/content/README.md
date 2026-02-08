# V2 Content

Narrative data — route JSON files, collectible notes, and validation.

## Structure

```text
content/
├── routes/              # Route sequence data (JSON)
├── notes/               # Collectible note content
├── credits.json         # Credits data
├── schemas/             # JSON validation schemas
├── routes-backup/       # Backup route data
├── ContentValidator.ts  # Runtime validation for route data
└── ContentValidator.test.ts
```

## Routes

JSON-driven narrative sequences. Each file contains scene arrays with dialogue, choices, sprites, and effects:

| File | Content |
| --- | --- |
| `prologue.json` | Shared opening sequence |
| `tori_act1.json` — `tori_act3.json` | Tori's route (3 acts) |
| `tori_endings.json` | Tori's endings |
| `ronnie_act1.json` — `ronnie_act3.json` | Ronnie's route (3 acts) |
| `ronnie_endings.json` | Ronnie's endings |
| `epilogue.json` | Shared epilogue |
| `micro_migration_scene.json` | Special migration scene |

## Notes

| File | Content |
| --- | --- |
| `tori_notes.json` | 13 collectible notes on Tori's route |
| `ronnie_notes.json` | Notes on Ronnie's route |
