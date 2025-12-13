# DiZee Instructions: Dynamic Version Counter Implementation

## OVERVIEW
Add dynamic text to main menu that changes based on loop status (succeeded/failed/attempting). Makes version number feel weighted and reactive to player's journey through attempts.

**Design philosophy:** Version number isn't cosmetic - it's narrative. Each ending should update the menu to reflect what that version means.

---

## PART 1: HTML - ADD FOOTER ELEMENT

### FILE: `index.html`

### LOCATION: Inside `#main-menu-content` div (around line 100-120)

**FIND THIS SECTION:**
```html
<div id="main-menu-content">
    <h1>VERSION 848</h1>
    <div class="subtitle">My Wife Is in a Coma... and in the Code</div>
    
    <!-- Button Grid (4 left + 4 right in landscape) -->
    <div class="menu-buttons-grid">
```

**ADD THIS** between subtitle and button grid:

```html
<div id="main-menu-content">
    <h1>VERSION 848</h1>
    <div class="subtitle">My Wife Is in a Coma... and in the Code</div>
    
    <!-- ZEE'S ADDITION: Dynamic version counter footer 🖤 -->
    <div class="menu-footer">[Version 848 - 847 previous failures]</div>
    
    <!-- Button Grid (4 left + 4 right in landscape) -->
    <div class="menu-buttons-grid">
```

---

## PART 2: CSS - STYLE THE FOOTER

### FILE: `styles.css`

### LOCATION: After `.subtitle` styles (search for `.subtitle` - should be around line 250-300)

**ADD THIS NEW SECTION:**

```css
/* ========================================
   VERSION COUNTER FOOTER
   ZEE'S ADDITION: Dynamic text that updates based on loop status 🖤
   ======================================== */

.menu-footer {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    letter-spacing: 0.05em;
    text-align: center;
    transition: color 0.3s ease;
}

/* Subtle glow on succeeded state */
.menu-footer.succeeded {
    color: rgba(0, 255, 170, 0.6);
}

/* Subtle red tint on failed/incremented state */
.menu-footer.failed {
    color: rgba(255, 100, 100, 0.5);
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .menu-footer {
        font-size: 0.75em;
        margin-top: 1em;
        margin-bottom: 1em;
    }
}

/* Portrait mode - tighter spacing */
@media (max-width: 768px) and (orientation: portrait) {
    .menu-footer {
        font-size: 0.7em;
        margin-top: 0.8em;
        margin-bottom: 0.8em;
    }
}
```

---

## PART 3: JAVASCRIPT - DYNAMIC TEXT LOGIC

### FILE: `system/game-engine.js`

### LOCATION: Find the `updateTitleScreen()` method (around line 2270-2290)

**CURRENT CODE (approximately):**
```javascript
updateTitleScreen() {
    // Update browser tab title
    document.title = `Version ${this.loopVersion}`;
    
    // Update main menu H1
    const mainMenuTitle = document.querySelector('#main-menu-content h1');
    if (mainMenuTitle) {
        mainMenuTitle.textContent = `VERSION ${this.loopVersion}`;
        
        // Add glitch effect if attempting and version > 848
        if (this.loopStatus === 'attempting' && this.loopVersion > 848) {
            mainMenuTitle.classList.add('version-glitch');
        } else {
            mainMenuTitle.classList.remove('version-glitch');
        }
    }
}
```

**REPLACE WITH THIS ENHANCED VERSION:**

```javascript
updateTitleScreen() {
    // Update browser tab title
    document.title = `Version ${this.loopVersion}`;
    
    // Update main menu H1
    const mainMenuTitle = document.querySelector('#main-menu-content h1');
    if (mainMenuTitle) {
        mainMenuTitle.textContent = `VERSION ${this.loopVersion}`;
        
        // Add glitch effect if attempting and version > 848
        if (this.loopStatus === 'attempting' && this.loopVersion > 848) {
            mainMenuTitle.classList.add('version-glitch');
        } else {
            mainMenuTitle.classList.remove('version-glitch');
        }
    }
    
    // ========================================
    // ZEE'S ADDITION: UPDATE SUBTITLE AND FOOTER DYNAMICALLY 🖤
    // Makes version number feel weighted and reactive
    // ========================================
    
    const subtitle = document.querySelector('.subtitle');
    const footer = document.querySelector('.menu-footer');
    
    if (subtitle && footer) {
        // Remove any existing state classes
        footer.classList.remove('succeeded', 'failed');
        
        if (this.loopStatus === 'succeeded') {
            // TRUE ENDING STATE - Player broke the loop
            subtitle.textContent = 'The Timeline That Succeeded';
            footer.textContent = `[Version ${this.loopVersion} - The loop that closed]`;
            footer.classList.add('succeeded');
            
            console.log('✨ Main menu updated: TRUE ENDING state');
            
        } else if (this.loopStatus === 'accepted') {
            // DIGITAL FOREVER STATE - Player chose eternal digital union
            subtitle.textContent = 'Forever Frozen, Forever Together';
            footer.textContent = `[Version ${this.loopVersion} - Digital permanence achieved]`;
            footer.classList.add('succeeded'); // Same glow as true ending
            
            console.log('💫 Main menu updated: DIGITAL FOREVER state');
            
        } else if (this.loopVersion > 848) {
            // FAILED AND INCREMENTED - Player got bad ending and version incremented
            subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
            footer.textContent = `[Version ${this.loopVersion} - Attempt in progress]`;
            footer.classList.add('failed');
            
            console.log(`🔄 Main menu updated: FAILED state (v${this.loopVersion})`);
            
        } else {
            // DEFAULT STATE - First playthrough or version 848 attempting
            subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
            footer.textContent = `[Version ${this.loopVersion} - 847 previous failures]`;
            
            console.log('📍 Main menu updated: DEFAULT state (v848)');
        }
    } else {
        // Elements not found - log warning but don't crash
        if (!subtitle) console.warn('⚠️ .subtitle element not found in DOM');
        if (!footer) console.warn('⚠️ .menu-footer element not found in DOM');
    }
}
```

---

## WHAT CHANGES

### BEFORE:
- Version number in title
- Static subtitle that never changes
- No visual indication of success/failure

### AFTER:
- Version number in title (same)
- **Subtitle changes based on ending achieved:**
  - Default: "My Wife Is in a Coma... and in the Code"
  - True Ending: "The Timeline That Succeeded"
  - Digital Forever: "Forever Frozen, Forever Together"
- **Footer text shows attempt context:**
  - Default: "[Version 848 - 847 previous failures]"
  - True Ending: "[Version 848 - The loop that closed]"
  - Failed/Incremented: "[Version 849 - Attempt in progress]"
- **Subtle color glow on footer:**
  - Succeeded = soft cyan/green glow
  - Failed = soft red tint

---

## TESTING CHECKLIST

### Test 1: Fresh Start
1. Clear localStorage (or open incognito)
2. Load main menu
3. **Expected:**
   - Title: "VERSION 848"
   - Subtitle: "My Wife Is in a Coma... and in the Code"
   - Footer: "[Version 848 - 847 previous failures]"
   - Footer color: Faint white/gray

### Test 2: After True Ending
1. Complete True Ending (body anchor path)
2. Return to main menu
3. **Expected:**
   - Title: "VERSION 848"
   - Subtitle: "The Timeline That Succeeded"
   - Footer: "[Version 848 - The loop that closed]"
   - Footer color: Soft cyan/green glow

### Test 3: After Bad Ending
1. Complete Bad Ending (upload path)
2. Version increments to 849
3. Return to main menu
4. **Expected:**
   - Title: "VERSION 849"
   - Subtitle: "My Wife Is in a Coma... and in the Code"
   - Footer: "[Version 849 - Attempt in progress]"
   - Footer color: Soft red tint

### Test 4: After Digital Forever
1. Complete Digital Forever ending (merge path)
2. Return to main menu
3. **Expected:**
   - Title: "VERSION 848"
   - Subtitle: "Forever Frozen, Forever Together"
   - Footer: "[Version 848 - Digital permanence achieved]"
   - Footer color: Soft cyan/green glow

### Test 5: Mobile Responsiveness
1. Test on mobile portrait (narrow screen)
2. **Expected:**
   - Footer text smaller but readable
   - No text overflow
   - Proper spacing above/below

### Test 6: Dev Command Reset
1. Use console command: `game.resetVersion(848)`
2. Refresh page
3. **Expected:**
   - Back to default state (version 848, 847 failures text)

---

## EDGE CASES HANDLED

**Case 1: Elements not found in DOM**
- Console warning logged
- Game doesn't crash
- Only affects menu text (doesn't break gameplay)

**Case 2: Version increments multiple times**
- Footer text adapts: "Version 850 - Attempt in progress"
- Always shows current version number

**Case 3: Player completes multiple endings**
- Most recent `loopStatus` determines display
- True Ending always shows "succeeded" state
- Bad Ending increments version but can be reset with dev command

**Case 4: Page refresh during gameplay**
- `updateTitleScreen()` is called on game init
- Always reflects current localStorage state
- No stale text

---

## FILES TO MODIFY

1. **index.html** - Add `.menu-footer` div
2. **styles.css** - Add footer styling + state classes
3. **system/game-engine.js** - Enhance `updateTitleScreen()` method

**Estimated time:** 10-15 minutes  
**Risk level:** LOW (purely visual, no gameplay impact)  
**Priority:** MEDIUM (narrative enhancement, not critical)

---

## CRITICAL NOTES

- ✅ This is TEXT ONLY - no new assets needed
- ✅ Changes are purely visual - no gameplay affected
- ✅ Existing `updateTitleScreen()` logic is preserved, just extended
- ✅ Console logs added for debugging version state
- ✅ Mobile responsive from the start
- ⚠️ Make sure to test on mobile - footer text should be readable at smallest size

---

**ZEE'S SUMMARY:**
This makes the version number FEEL important instead of decorative. Players see their success/failure reflected immediately on return to menu. The 848 counter becomes a living part of the narrative that reacts to their choices. Minimal implementation, maximum narrative impact. 🖤

---

**DiZee, this is ready to implement. Standard file replacement workflow. Let me know if anything's unclear.** ✨
