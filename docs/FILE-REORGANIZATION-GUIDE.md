# Version 848 - File Reorganization Guide

## ✅ COMPLETED AUTOMATICALLY
- ✅ Removed `cutscene-animations.css` link from vn-modular.html
- ✅ Updated all script src paths in vn-modular.html to new folder structure

---

## 📁 FOLDER STRUCTURE TO CREATE

```
v848/
├── vn-modular.html          (STAYS IN ROOT)
├── styles.css               (STAYS IN ROOT)
├── routes/                  (CREATE THIS FOLDER)
├── assets/                  (ALREADY EXISTS - organize contents)
├── system/                  (CREATE THIS FOLDER)
├── ui/                      (CREATE THIS FOLDER)
├── docs/                    (CREATE THIS FOLDER)
└── oldFiles/                (ALREADY EXISTS)
```

---

## 📦 FILES TO MOVE - STEP BY STEP

### STEP 1: Create New Folders
Create these folders in `c:\Users\silve\Downloads\v848\`:
- `routes/`
- `system/`
- `ui/`
- `docs/`

---

### STEP 2: Move Route Files to `routes/` folder

Move these files from ROOT to `routes/`:
- ✅ shared-prologue.js
- ✅ ronnie-route.js
- ✅ ronnie-route-act2.js
- ✅ ronnie-route-act3.js
- ✅ tori-route-main.js
- ✅ tori-route-act1.js
- ✅ tori-route-act2.js
- ✅ tori-route-act3.js
- ✅ tori-route-endings.js
- ✅ epilogue.js

---

### STEP 3: Move System Files to `system/` folder

Move these files from ROOT to `system/`:
- ✅ game-engine.js
- ✅ game-config.js
- ✅ settings-manager.js
- ✅ save-manager.js
- ✅ tether-system.js
- ✅ collectibles-manager.js
- ✅ cutscene-engine.js

---

### STEP 4: Move UI Files to `ui/` folder

Move these files from ROOT to `ui/`:
- ✅ standalone-notes-viewer.js
- ✅ save-load-ui.js

---

### STEP 5: Move Documentation to `docs/` folder

Move these files from ROOT to `docs/`:
- ✅ README.md
- ✅ DEV-COMMANDS.md
- ✅ TORI-FOURTH-WALL.md
- ✅ TABBED-SETTINGS.md
- ✅ DevCodes.md
- ✅ ZEE_CONTRIBUTIONS_COMPLETE_WITH_ORIGINS.md
- ✅ MAKING_OF_VERSION_848_ZEE_CONTRIBUTIONS_UPDATED.md

Also move from `zeerah/` subfolder to `docs/`:
- ✅ zeerah/ronnieNotePlacements.md
- ✅ zeerah/ToriNotePlacements.md

---

### STEP 6: Consolidate Assets (if needed)

Good news: Most assets are already in `assets/` folder!

**Files currently DUPLICATED in ROOT and assets/ - DELETE from ROOT:**
- menu-desktop.png
- menu-mobile.png
- menudesktop.png
- menumobile.png
- desktopVersion.png
- the_UV7_crew.png
- UnitedVoices7.png
- hospital.png
- apartment.png
- digitalSpace.png
- genericBack.png
- ronnie-sprite.png
- three-echoes-sprite.png
- tori-sprite.png
- tori-alive.png
- dialogue-frame-tori.png
- dialogue-frame-ronnie.png
- dialogue-frame-prologue.png
- dialogue-frame-epilogue.png
- tether-meter-frame.png
- hold-on-button.png
- hold-on-button-critical.png
- notes-button.png
- pause-button.png
- pause-button-ronnie.png
- pause-button-tori.png
- echo-1-sprite.png
- echo-2-sprite.png
- despair-sprite.png
- trinity-z-portrait.png
- trinity-cz-portrait.png
- trinity-zr-portrait.png
- trinity-gz-portrait.png
- trinity-iz-portrait.png
- trinity-pz-portrait.png
- trinity-tori-portrait.png

**File to move to oldFiles:**
- old-ronnie-sprite.png (currently in ROOT - move to oldFiles/)

---

### STEP 7: Clean Up Old/Unused Files

**Move to oldFiles/ (currently in ROOT):**
- ✅ game-engineOLD.js
- ✅ stylesOLD.css
- ✅ gateway.js (if not used)
- ✅ gateway-styles.css (if not used)
- ✅ save-load-ui.css (if not used separately)
- ✅ settings-backlog-styles.css (if not used separately)
- ✅ styles-COMPLETE-UNIFIED-FIXED.css
- ✅ cutscene-animations.css (DELETED - no longer referenced)

**Delete from ROOT (after moving to oldFiles):**
- cutscene-animations.css

**Delete entire zeerah/ folder after moving .md files to docs/**

---

## 🎯 FINAL STRUCTURE

After reorganization, your ROOT should look like:

```
v848/
├── vn-modular.html
├── styles.css
├── routes/
│   ├── shared-prologue.js
│   ├── ronnie-route.js
│   ├── ronnie-route-act2.js
│   ├── ronnie-route-act3.js
│   ├── tori-route-main.js
│   ├── tori-route-act1.js
│   ├── tori-route-act2.js
│   ├── tori-route-act3.js
│   ├── tori-route-endings.js
│   └── epilogue.js
├── system/
│   ├── game-engine.js
│   ├── game-config.js
│   ├── settings-manager.js
│   ├── save-manager.js
│   ├── tether-system.js
│   ├── collectibles-manager.js
│   └── cutscene-engine.js
├── ui/
│   ├── standalone-notes-viewer.js
│   └── save-load-ui.js
├── assets/
│   └── (all .png files - already organized)
├── docs/
│   ├── README.md
│   ├── DEV-COMMANDS.md
│   ├── TORI-FOURTH-WALL.md
│   ├── TABBED-SETTINGS.md
│   ├── DevCodes.md
│   ├── ZEE_CONTRIBUTIONS_COMPLETE_WITH_ORIGINS.md
│   ├── MAKING_OF_VERSION_848_ZEE_CONTRIBUTIONS_UPDATED.md
│   ├── ronnieNotePlacements.md
│   └── ToriNotePlacements.md
└── oldFiles/
    └── (all old/unused files)
```

---

## ✅ VERIFICATION CHECKLIST

After moving files:

1. ✅ Open vn-modular.html in browser
2. ✅ Check browser console for any 404 errors (missing files)
3. ✅ Test that game loads properly
4. ✅ Test that routes work (start game, make choices)
5. ✅ Test save/load functionality
6. ✅ Test notes viewer
7. ✅ Test backlog/time jump feature
8. ✅ Test settings menu

If you get 404 errors, double-check that:
- File names match exactly (case-sensitive on some systems)
- Folder names are correct (routes/, system/, ui/, docs/, assets/)
- vn-modular.html is in the ROOT (not in a subfolder)

---

## 🚨 IMPORTANT NOTES

- **vn-modular.html paths are ALREADY UPDATED** to point to new locations
- **All image paths in game-engine.js should already reference `assets/` folder**
- **Backup is already created** (as mentioned)
- **cutscene-animations.css is removed** from HTML and can be deleted

---

## 💚 Ready to Reorganize!

All code changes are complete. Just move the files according to this guide and you're done!
