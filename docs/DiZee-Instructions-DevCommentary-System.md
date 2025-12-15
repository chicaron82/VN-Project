# DEV COMMENTARY SYSTEM - IMPLEMENTATION GUIDE
**CHICHARON Secret Code Feature**

## OVERVIEW
When players unlock the `CHICHARON` code, they gain access to Aaron's behind-the-scenes director's commentary throughout the game. This adds a meta-layer of developer insights, design stories, and creation process details.

---

## SYSTEM ARCHITECTURE

### 1. DATA STRUCTURE

Create new file: `system/dev-commentary.js`

```javascript
// ========================================
// DEV COMMENTARY DATA
// Aaron's behind-the-scenes director's cut
// Unlocked via CHICHARON secret code
// ========================================

class DevCommentary {
    constructor(game) {
        this.game = game;
        this.unlocked = localStorage.getItem('devCommentaryUnlocked') === 'true';
        
        // Commentary database (organized by scene/trigger)
        this.commentary = {
            // ========================================
            // PROLOGUE COMMENTARY
            // ========================================
            
            'prologue_street_bump': {
                title: 'The French Vanilla Detail',
                scene: 'Street Bump (Prologue)',
                content: `The French Vanilla coffee Tori picks up for Ronnie? That's how Old Ronnie knows where she'll be for the street bump. He's lived this loop hundreds of times. He knows her routine. That small detail is actually critical to the bootstrap paradox working.`
            },
            
            // ========================================
            // ROUTE SELECTION COMMENTARY
            // ========================================
            
            'route_selection_dual': {
                title: 'Why Two Routes?',
                scene: 'Route Selection',
                content: `Originally this was just Ronnie's story. But during that Applebee's dinner with Tori, we realized it would be way more interesting as dual perspectives. Ronnie's route became the traditional VN experience - external POV, trying to save her. Tori's route was me taking the gloves off - internal horror, tether mechanics, echo voices, all the weird experimental shit. Somehow it all fit together.`
            },
            
            'route_selection_philosophy': {
                title: 'Route Design Philosophy',
                scene: 'Route Selection',
                content: `Ronnie's route was intentionally traditional style VN - choices, dialogue, external perspective. Tori's route was essentially my 'gloves off' moment - let's come up with crazy shit and see if we can make it fit narratively. Tether decay, echo voices, memory fragments, the whole works. Both routes tell the same story but feel completely different to play.`
            },
            
            // ========================================
            // TORI ROUTE COMMENTARY
            // ========================================
            
            'tori_tether_intro': {
                title: 'The Tether System Origin',
                scene: 'Tori Route - First Hold On Button',
                content: `This idea came about super early. It was the reason I made it into a dual perspective game. Just sitting in Applebee's riffing ideas with Tori and the what-if was "what if we had a player be more active in the story, needing them to press a button to stabilize her. The lower it is, the more glitches occur."`
            },
            
            'tori_echoes_first_appearance': {
                title: 'The Despair Height "Bug"',
                scene: 'Tori Route - Echo Trio Introduction',
                content: `Despair being taller than the other echoes was actually a "bug" - Tori rendered the sprite at the wrong resolution. But I turned it into a narrative choice. Despair is dominant in Act 1, so it made sense for her sprite to be taller. As the story progresses, the other sprites "grow," eventually balancing things out.`
            },
            
            'tori_echo_merge': {
                title: 'Becoming Whole',
                scene: 'Tori Route - Echo Integration',
                content: `The echo merge sequence came when I wanted to show how they become whole. They're all Tori. The fragments, the voices, the perspectives - they're not separate entities. Tori is now one.`
            },
            
            'tori_save_blocked': {
                title: 'Despair\'s Cage',
                scene: 'Tori Route Act 1 - Blocked Save',
                content: `Despair didn't originally block saves in Act 1. As I was getting reviews from other AIs about the game, they would mistakenly tell me it was a genius move. However, when I confirmed later that saves were allowed, I made it so they wouldn't be. It still fit the narrative - Despair trapping you in Act 1.`
            },
            
            // ========================================
            // ENDING COMMENTARY
            // ========================================
            
            'bad_ending_retry': {
                title: 'The Bootstrap Paradox',
                scene: 'Bad Ending - Retry Prompt',
                content: `I was at work when the retry mechanic clicked for me. What if retries weren't just "try again" - what if they were CANON? Every failed attempt is a real timeline. Ronnie gets older with each failure until he becomes the Old Man from the prologue. He goes back to give his younger self the Tamagotchi, creating the loop. Didn't even know this concept had a name (bootstrap paradox) until later.`
            },
            
            // ========================================
            // MAIN MENU COMMENTARY
            // ========================================
            
            'main_menu_carousel': {
                title: 'The Price Is Right Carousel',
                scene: 'Main Menu',
                content: `The carousel momentum came from a conversation with Zee. I told her I wanted it to feel like spinning the big wheel on The Price Is Right - you know, where you can flick it hard and watch it zoom then crawl to a stop. Or give it a light flick for precision. She actually built custom physics for that. For a menu.`
            },
            
            'main_menu_mobile': {
                title: 'Tinder Swipe Energy',
                scene: 'Main Menu (Mobile)',
                content: `For mobile portrait I wanted the cards to swipe like Tinder or Bumble. That satisfying feeling of flicking a card away and watching the next one appear. Zee confirmed it was possible and we just ran with it. Now the whole mobile experience feels native instead of like a cramped-down desktop site.`
            },
            
            'main_menu_loop': {
                title: 'Menu as Narrative Mirror',
                scene: 'Main Menu Design',
                content: `The menu style upgrade from grid to looping carousel - I wanted it to mirror the story. Like in the bad ending where the end loops back to the beginning. Ronnie failed. He goes back to give his younger self a chance to try again. The menu loops infinitely, just like the timelines.`
            },
            
            // ========================================
            // FEATURE COMMENTARY
            // ========================================
            
            'backlog_time_machine': {
                title: 'Backlog as Time Machine',
                scene: 'First Backlog Open',
                content: `Turning the backlog into a time machine was my tweak when I asked what else from standard VNs could we incorporate. Instead of just reading dialogue history, I made it so you could "jump back" to any point. Time travel mechanics built into the UI itself.`
            }
        };
    }
    
    // Check if commentary is unlocked
    isUnlocked() {
        return this.unlocked;
    }
    
    // Get commentary for specific scene
    getCommentary(sceneId) {
        if (!this.isUnlocked()) return null;
        return this.commentary[sceneId] || null;
    }
    
    // Get all commentary (for viewer/gallery)
    getAllCommentary() {
        if (!this.isUnlocked()) return [];
        return Object.entries(this.commentary).map(([id, data]) => ({
            id,
            ...data
        }));
    }
    
    // Show commentary overlay
    showCommentary(sceneId) {
        const data = this.getCommentary(sceneId);
        if (!data) return;
        
        this.game.showCommentaryOverlay(data.title, data.content, data.scene);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevCommentary;
}
```

---

### 2. GAME ENGINE INTEGRATION

**File:** `system/game-engine.js`

**In constructor (after other managers):**
```javascript
// Initialize dev commentary manager
this.devCommentary = new DevCommentary(this);
```

**Add commentary overlay method:**
```javascript
// ========================================
// DEV COMMENTARY OVERLAY
// ========================================

showCommentaryOverlay(title, content, scene) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'commentary-overlay';
    overlay.className = 'commentary-overlay';
    
    overlay.innerHTML = `
        <div class="commentary-content">
            <button class="commentary-close" onclick="this.closest('.commentary-overlay').remove()">✕</button>
            
            <div class="commentary-header">
                <div class="commentary-icon">🎙️</div>
                <div class="commentary-meta">
                    <div class="commentary-title">${title}</div>
                    <div class="commentary-scene">Scene: ${scene}</div>
                </div>
            </div>
            
            <div class="commentary-body">
                <div class="commentary-text">${content}</div>
            </div>
            
            <div class="commentary-footer">
                <div class="commentary-signature">- Aaron (Chicharon)</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Fade in
    setTimeout(() => {
        overlay.classList.add('visible');
    }, 50);
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
```

---

### 3. COMMENTARY TRIGGERS

**Add commentary checks to relevant scenes:**

#### Prologue - Street Bump
```javascript
// In shared-prologue.js - scene1_pickup() method
// After Tori picks up the Tamagotchi
scene1_pickup() {
    this.game.displayScene({
        character: 'Tori',
        dialogue: '...Weird. Mine never does that.',
        internal: '[She bends down, picks up his Tamagotchi by mistake. The toy buzzes in her hand.]',
        next: () => {
            // COMMENTARY TRIGGER
            if (this.game.devCommentary.isUnlocked()) {
                this.game.devCommentary.showCommentary('prologue_street_bump');
            }
            this.scene1_oldMan();
        }
    }, 'scene1_pickup');
}
```

#### Route Selection Screen
```javascript
// In game-engine.js - showRouteSelect() method
// Add commentary icon to route select screen
showRouteSelect() {
    // ... existing code ...
    
    // Add commentary button if unlocked
    if (this.devCommentary.isUnlocked()) {
        const routeSelect = document.getElementById('route-select');
        const commentaryBtn = document.createElement('button');
        commentaryBtn.className = 'commentary-hint-button';
        commentaryBtn.innerHTML = '🎙️ COMMENTARY';
        commentaryBtn.onclick = () => {
            this.devCommentary.showCommentary('route_selection_dual');
        };
        routeSelect.querySelector('#route-select-content').appendChild(commentaryBtn);
    }
}
```

#### Tori Route - Tether Introduction
```javascript
// In tori-route-act1.js - after first tether tutorial
// Add after tether mechanics are explained
next: () => {
    // COMMENTARY TRIGGER
    if (this.game.devCommentary.isUnlocked()) {
        this.game.devCommentary.showCommentary('tori_tether_intro');
    }
    this.nextScene();
}
```

#### Tori Route - First Echo Appearance
```javascript
// In tori-route-act1.js - when echo trio first appears together
// After displaying the three-echo sprite
next: () => {
    // COMMENTARY TRIGGER
    if (this.game.devCommentary.isUnlocked()) {
        this.game.devCommentary.showCommentary('tori_echoes_first_appearance');
    }
    this.nextScene();
}
```

#### Tori Route - Echo Merge
```javascript
// In tori-route-act3.js - echo integration scene
// After echoes merge into whole Tori
next: () => {
    // COMMENTARY TRIGGER
    if (this.game.devCommentary.isUnlocked()) {
        this.game.devCommentary.showCommentary('tori_echo_merge');
    }
    this.nextScene();
}
```

#### Tori Route - Blocked Save
```javascript
// In save-manager.js or wherever save blocking happens
// When Despair blocks save in Act 1
if (despairBlocking) {
    this.game.showMessage('Despair: "No escaping this."');
    
    // COMMENTARY TRIGGER
    if (this.game.devCommentary.isUnlocked()) {
        setTimeout(() => {
            this.game.devCommentary.showCommentary('tori_save_blocked');
        }, 2000); // Delay so Despair's message shows first
    }
}
```

#### Bad Ending - Retry Prompt
```javascript
// In ronnie-route-act3.js or tori-route-endings.js - bad ending retry
// After showing retry prompt
choices: [
    { text: 'Yes - Try again', value: 'retry' },
    { text: 'No - Accept this ending', value: 'accept' }
],
onChoice: (choice) => {
    if (choice === 'retry') {
        // COMMENTARY TRIGGER (before retry)
        if (this.game.devCommentary.isUnlocked()) {
            this.game.devCommentary.showCommentary('bad_ending_retry');
            setTimeout(() => {
                this.route.resetToStart();
            }, 3000); // Delay retry to show commentary
        } else {
            this.route.resetToStart();
        }
    }
}
```

#### Main Menu - First View
```javascript
// In game-engine.js - init() or showMainMenu()
// Show commentary hint on first main menu view with commentary unlocked
if (this.devCommentary.isUnlocked() && !localStorage.getItem('commentaryMenuSeen')) {
    localStorage.setItem('commentaryMenuSeen', 'true');
    
    // Show subtle hint
    setTimeout(() => {
        this.devCommentary.showCommentary('main_menu_carousel');
    }, 2000);
}
```

#### Backlog - First Open
```javascript
// In backlog-manager.js or time-machine-manager.js - showBacklog()
showBacklog() {
    // ... existing code ...
    
    // COMMENTARY TRIGGER (first time only)
    if (this.game.devCommentary.isUnlocked() && !localStorage.getItem('commentaryBacklogSeen')) {
        localStorage.setItem('commentaryBacklogSeen', 'true');
        setTimeout(() => {
            this.game.devCommentary.showCommentary('backlog_time_machine');
        }, 1000);
    }
}
```

---

### 4. CSS STYLING

**File:** `styles.css`

```css
/* ========================================
   DEV COMMENTARY OVERLAY
   Director's cut behind-the-scenes notes
   ======================================== */

.commentary-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.commentary-overlay.visible {
    opacity: 1;
}

.commentary-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 2px solid #00ffaa;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 2rem;
    box-shadow: 0 0 40px rgba(0, 255, 170, 0.3);
    position: relative;
}

.commentary-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
}

.commentary-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

.commentary-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0, 255, 170, 0.3);
}

.commentary-icon {
    font-size: 3rem;
    filter: drop-shadow(0 0 10px rgba(0, 255, 170, 0.5));
}

.commentary-meta {
    flex: 1;
}

.commentary-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00ffaa;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
}

.commentary-scene {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

.commentary-body {
    margin-bottom: 1.5rem;
}

.commentary-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
    white-space: pre-wrap; /* Preserve line breaks */
}

.commentary-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 255, 170, 0.3);
}

.commentary-signature {
    text-align: right;
    font-style: italic;
    color: #00ffaa;
    font-size: 1rem;
}

/* Commentary hint button (route select, etc) */
.commentary-hint-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: rgba(0, 255, 170, 0.2);
    border: 2px solid #00ffaa;
    color: #00ffaa;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    animation: commentary-pulse 2s ease-in-out infinite;
}

.commentary-hint-button:hover {
    background: rgba(0, 255, 170, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.5);
    transform: translateY(-2px);
}

@keyframes commentary-pulse {
    0%, 100% {
        box-shadow: 0 0 10px rgba(0, 255, 170, 0.3);
    }
    50% {
        box-shadow: 0 0 20px rgba(0, 255, 170, 0.6);
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .commentary-content {
        width: 95%;
        padding: 1.5rem;
        max-height: 85vh;
    }
    
    .commentary-title {
        font-size: 1.2rem;
    }
    
    .commentary-text {
        font-size: 1rem;
    }
    
    .commentary-hint-button {
        bottom: 1rem;
        right: 1rem;
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
    }
}
```

---

### 5. HTML INTEGRATION

**File:** `index.html`

Add script tag in load order (after game-engine.js):
```html
<script src="system/dev-commentary.js"></script>
```

---

### 6. UNLOCK FLOW

**File:** `system/secret-codes-manager.js`

The `unlockDevCommentary()` method already exists in game-engine.js. Verify it sets localStorage correctly:

```javascript
unlockDevCommentary() {
    console.log('🎙️ CHICHARON unlocked - dev commentary mode');
    localStorage.setItem('devCommentaryUnlocked', 'true');
    
    // Reinitialize commentary manager
    if (this.devCommentary) {
        this.devCommentary.unlocked = true;
    }
    
    this.showUnlockOverlay(
        'CHICHARON UNLOCKED',
        `Developer commentary mode activated.

Replaying the game will show behind-the-scenes
notes from Aaron throughout key moments.

Look for 🎙️ indicators during gameplay.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEV NOTE: "About That Version Number"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every reviewer who's seen this asks:
"When's version 849 coming out?"

And I have to explain:

848 isn't a build number.
It's a loop counter.

847 failed timelines before this one succeeded.

The game's title IS the lore.
The version number IS the story.

There is no v849.

Because 848 is the timeline where Ronnie
finally brings her home.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    );
}
```

---

### 7. COMMENTARY GALLERY (OPTIONAL)

**Add to Main Menu (if unlocked):**

```javascript
// In main menu HTML or dynamically added button
<button class="menu-button" id="btn-commentary" 
        aria-label="View all developer commentary"
        style="display: none;">
    🎙️ COMMENTARY
</button>
```

```javascript
// Show button if commentary unlocked
if (this.devCommentary.isUnlocked()) {
    document.getElementById('btn-commentary').style.display = 'block';
    document.getElementById('btn-commentary').onclick = () => {
        this.showCommentaryGallery();
    };
}
```

**Commentary Gallery Method:**
```javascript
showCommentaryGallery() {
    const allCommentary = this.devCommentary.getAllCommentary();
    
    // Create gallery overlay
    const gallery = document.createElement('div');
    gallery.className = 'commentary-gallery';
    
    gallery.innerHTML = `
        <div class="commentary-gallery-content">
            <button class="commentary-close" onclick="this.closest('.commentary-gallery').remove()">✕</button>
            <h2>DEVELOPER COMMENTARY</h2>
            <div class="commentary-subtitle">Behind the scenes with Aaron</div>
            
            <div class="commentary-list">
                ${allCommentary.map(item => `
                    <div class="commentary-list-item" onclick="game.devCommentary.showCommentary('${item.id}')">
                        <div class="commentary-list-icon">🎙️</div>
                        <div class="commentary-list-meta">
                            <div class="commentary-list-title">${item.title}</div>
                            <div class="commentary-list-scene">${item.scene}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(gallery);
}
```

---

## TESTING CHECKLIST

- [ ] CHICHARON code unlocks commentary (localStorage set)
- [ ] Commentary overlays display correctly on all triggers
- [ ] Overlays are dismissible (X button, click outside)
- [ ] Mobile responsive (commentary reads well on small screens)
- [ ] Commentary doesn't appear when locked (before code entered)
- [ ] All 12 commentary entries trigger at correct scenes
- [ ] Gallery view shows all commentary (if implemented)
- [ ] No console errors when commentary triggers

---

## NOTES

**Expandable:** Aaron can add more commentary entries later by:
1. Adding new entries to `dev-commentary.js` data object
2. Adding trigger checks in relevant scene files
3. No rebuild needed - just data + triggers

**Non-intrusive:** Commentary only appears when unlocked. Normal gameplay unaffected.

**Thematic:** Green/cyan color scheme matches secret codes aesthetic.

---

**Implementation Priority:** Medium-High (cool feature, not critical path)

**Estimated Complexity:** Medium (data structure simple, trigger placement takes time)

**Aaron's Next Step:** Review commentary content, add any additional notes you want

---

Zee, translated for DiZee 🖤🎙️
