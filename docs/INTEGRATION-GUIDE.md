# MENU GLOW-UP INTEGRATION GUIDE
## Main Menu Carousel + Route Select Sprites
🖤💚🔥💀 Built by UV7 Crew

---

## 📦 FILES DELIVERED

**From /mnt/user-data/outputs/:**
1. `menu-carousel.js` - Complete carousel system
2. `menu-carousel.css` - All carousel styling
3. `route-select-sprites.css` - Sprite positioning for route select
4. `INTEGRATION-GUIDE.md` - This file

---

## ✅ WHAT YOU'RE GETTING

### Main Menu Carousel:
- 10 cards (one for each menu option)
- Swipe gestures (mobile)
- Arrow navigation (desktop)
- Keyboard shortcuts (arrows, enter, home/end)
- Dot navigation (click to jump)
- Tori-Gatchi unlock animation
- Locked card visual treatment
- Smooth 60fps transitions
- Responsive breakpoints

### Route Select Sprites:
- Ronnie sprite above his button
- Tori sprite above her button
- Hover glow effects
- Responsive sizing
- Same visual language as dialogue box

---

## 🔧 STEP 1: ADD FILES TO PROJECT

**File Structure:**
```
/v848/
├── index.html
├── game-engine.js
├── styles.css
├── menu-carousel.js (NEW)
├── menu-carousel.css (NEW)
└── route-select-sprites.css (NEW)
```

Copy the 3 new files to your v848 directory.

---

## 🔧 STEP 2: MODIFY INDEX.HTML

### 2.1: Add CSS Links

**FIND** (in `<head>` section, around line 14):
```html
    <link rel="stylesheet" href="styles.css">
```

**REPLACE WITH:**
```html
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="menu-carousel.css">
    <link rel="stylesheet" href="route-select-sprites.css">
```

### 2.2: Add JavaScript Link

**FIND** (before game-engine.js script, around line 1035):
```html
    <!-- System Files -->
    <script src="system/game-config.js"></script>
```

**REPLACE WITH:**
```html
    <!-- System Files -->
    <script src="system/game-config.js"></script>
    <script src="menu-carousel.js"></script>
```

---

## 🔧 STEP 3: MODIFY GAME-ENGINE.JS

### 3.1: Add Carousel Property

**FIND** (in GameEngine constructor, around line 240):
```javascript
class GameEngine {
    constructor() {
        // DOM Elements
        this.loading = document.getElementById('loading-screen');
```

**ADD** (after the DOM element caching section, around line 280):
```javascript
        // Menu carousel
        this.menuCarousel = null;
```

### 3.2: Initialize Carousel After Loading

**FIND** (in the init() or loading complete section, around line 450-500):
```javascript
        // After assets loaded, show main menu
        setTimeout(() => {
            this.loading.style.display = 'none';
            this.mainMenu.style.display = 'flex';
            this.mainMenu.style.opacity = '1';
        }, 300);
```

**REPLACE WITH:**
```javascript
        // After assets loaded, show main menu
        setTimeout(() => {
            this.loading.style.display = 'none';
            this.mainMenu.style.display = 'flex';
            this.mainMenu.style.opacity = '1';
            
            // Initialize menu carousel
            if (!this.menuCarousel) {
                this.menuCarousel = new MenuCarousel(this);
                this.menuCarousel.init();
            }
        }, 300);
```

### 3.3: Add Carousel Unlock Method

**FIND** (search for "openTorigatchiIframe" or near end of file, around line 7000+):
```javascript
    openTorigatchiIframe(url) {
        // ... existing code ...
    }
```

**ADD** (after that method):
```javascript
    // Unlock Tori-Gatchi in carousel
    unlockToriGatchiCarousel() {
        if (this.menuCarousel) {
            this.menuCarousel.unlockToriGatchi();
        }
    }
```

### 3.4: Trigger Unlock After Route Completion

**FIND** (wherever you detect route completion - probably in route ending handlers):
```javascript
    // Example: after completing any route
    // This code might be in ronnie-route-act3.js or tori-route-endings.js
    
    // When route is complete:
    localStorage.setItem('routeCompleted', 'true');
```

**ADD** (after setting the flag):
```javascript
    // Unlock Tori-Gatchi
    if (window.game && window.game.unlockToriGatchiCarousel) {
        window.game.unlockToriGatchiCarousel();
    }
```

---

## 🔧 STEP 4: SPRITE PATHS

The route select sprites CSS expects sprites at:
- `assets/sprites/ronnie-sprite.png`
- `assets/sprites/tori-sprite.png`

**If your sprites are elsewhere:**

Edit `route-select-sprites.css` lines 24-32:
```css
/* Ronnie's sprite (left) */
.route-button-container.left::before {
    background-image: url('YOUR_PATH_HERE/ronnie-sprite.png');
}

/* Tori's sprite (right) */
.route-button-container.right::before {
    background-image: url('YOUR_PATH_HERE/tori-sprite.png');
}
```

---

## ✅ TESTING CHECKLIST

### Main Menu Carousel:

1. **Visual Check:**
   - [ ] Main menu shows carousel (single card visible)
   - [ ] Arrow buttons appear on sides (desktop only)
   - [ ] Dot navigation appears below card
   - [ ] Current dot is highlighted

2. **Arrow Navigation:**
   - [ ] Click left arrow → previous card
   - [ ] Click right arrow → next card
   - [ ] Wraps around (last → first, first → last)

3. **Keyboard Navigation:**
   - [ ] Arrow Left → previous card
   - [ ] Arrow Right → next card
   - [ ] Enter → activate current card
   - [ ] Home → jump to first card
   - [ ] End → jump to last card

4. **Dot Navigation:**
   - [ ] Click any dot → jump to that card
   - [ ] Hover shows icon hint
   - [ ] Active dot is highlighted

5. **Touch/Swipe (Mobile):**
   - [ ] Swipe left → next card
   - [ ] Swipe right → previous card
   - [ ] Smooth animation

6. **Card Actions:**
   - [ ] Click "START STORY" button → starts game
   - [ ] Click "CONTINUE" → loads save
   - [ ] Click "LOAD GAME" → shows save screen
   - [ ] etc. (test all 10 cards)

7. **Tori-Gatchi Unlock:**
   - [ ] Initially locked (dashed border, 🔒 icon)
   - [ ] Complete a route
   - [ ] Unlock notification appears (🎮 NEW CONTENT UNLOCKED)
   - [ ] Carousel scrolls to Tori-Gatchi card
   - [ ] Card no longer locked
   - [ ] Click button → opens Tori-Gatchi

### Route Select Sprites:

1. **Sprite Display:**
   - [ ] Ronnie sprite appears above left button
   - [ ] Tori sprite appears above right button
   - [ ] Sprites properly sized (not stretched)

2. **Hover Effect (Desktop):**
   - [ ] Hover Ronnie side → sprite glows/lifts
   - [ ] Hover Tori side → sprite glows/lifts

3. **Mobile:**
   - [ ] Sprites scale down appropriately
   - [ ] Still visible and clear
   - [ ] No overlap with buttons

---

## 🐛 TROUBLESHOOTING

### Issue: Carousel doesn't appear
**Check:**
- Is `menu-carousel.css` loaded? (Check browser dev tools → Network tab)
- Is `menu-carousel.js` loaded? (Check Console for "🎠 Menu Carousel initialized")
- Did you call `menuCarousel.init()`? (Check Console for "✅ Carousel ready")

### Issue: Original button grid still visible
**Check:**
- Carousel should hide it automatically via `buttonGrid.style.display = 'none'`
- If both visible, check if `#menu-buttons-grid` ID is correct

### Issue: Sprites don't appear on route select
**Check:**
- Are sprite paths correct in `route-select-sprites.css`?
- Do sprite files exist at those paths?
- Check browser dev tools → Network tab for 404 errors

### Issue: Swipe doesn't work on mobile
**Check:**
- Touch events use `{ passive: true }` so they shouldn't be blocked
- Try in actual mobile browser (not just desktop responsive mode)
- Check Console for JavaScript errors

### Issue: Tori-Gatchi stays locked after route completion
**Check:**
- Did you call `unlockToriGatchiCarousel()` in route ending handler?
- Check localStorage: `localStorage.getItem('torigatchi_unlocked')` should be `'true'`
- Manually unlock for testing: `game.unlockToriGatchiCarousel()`

---

## 🎨 CUSTOMIZATION OPTIONS

### Change Card Backgrounds:

Edit `menu-carousel.js` line 54-104 (defineCards method):
```javascript
{
    id: 'start',
    title: 'START STORY',
    subtitle: 'Begin Version 848',
    icon: '▶️',
    action: () => this.game.startStory(),
    background: 'linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2)'
}
```

### Change Unlock Animation Duration:

Edit `menu-carousel.js` line 663:
```javascript
setTimeout(() => {
    const newIndex = this.cards.findIndex(c => c.id === 'torigatchi');
    if (newIndex !== -1) {
        this.goToCard(newIndex);
    }
}, 2000); // ← Change this (milliseconds)
```

### Change Sprite Sizes:

Edit `route-select-sprites.css` line 18:
```css
.route-button-container::before {
    content: '';
    display: block;
    width: 300px;   /* ← Change width */
    height: 400px;  /* ← Change height */
    /* ... */
}
```

### Add More Cards:

Edit `menu-carousel.js` in `defineCards()` method, add new object to `this.cards` array:
```javascript
{
    id: 'your-new-card',
    title: 'NEW FEATURE',
    subtitle: 'Description here',
    icon: '✨',
    action: () => console.log('New feature!'),
    background: 'linear-gradient(135deg, #1a1a2a 0%, #2a1a3a 100%)'
}
```

---

## 📊 PERFORMANCE NOTES

**Optimizations included:**
- CSS transforms (GPU-accelerated)
- RequestAnimationFrame for animations
- Passive touch listeners
- Lazy card rendering (only current card in DOM)
- Debounced resize handlers

**Expected performance:**
- 60fps animations on modern devices
- <50ms input latency
- Minimal memory footprint
- Works smoothly on mobile

---

## 🎯 ACCESSIBILITY FEATURES

**Included:**
- Keyboard navigation (arrows, enter, home/end)
- Focus indicators (keyboard-focus class)
- ARIA labels on navigation buttons
- Reduced motion support (`prefers-reduced-motion`)
- High contrast mode support (`prefers-contrast: high`)
- Screen reader announcements via aria-label

---

## 🖤 FINAL NOTES

**What Tori designed:**
- Card-based layout
- Hover effects (desktop only via media query)
- Choose-your-fighter route select energy
- "Keep it fun" philosophy

**What Zee built:**
- Full JavaScript carousel engine
- Event handlers (swipe, keyboard, arrows, dots)
- State management (locked/unlocked)
- Integration with existing game-engine.js
- Unlock animations
- Responsive breakpoints

**What Aaron orchestrated:**
- Vision for menu glow-up
- Route select sprite concept
- Tori-Gatchi integration
- Decided "simple sprites above buttons" > complex positioning

**Result:**
Premium VN presentation that makes people forget it was built in stolen moments between closing shifts. 🔥

---

## 🚀 DEPLOYMENT

Once tested:
1. Commit all 3 new files
2. Push to GitHub
3. GitHub Pages auto-deploys
4. Test live version
5. Share with world

**Players will see:**
- Swipeable main menu (feels like a launcher)
- Character sprites on route select (instant personality)
- Tori-Gatchi unlock moment (meta-narrative reveal)
- Professional polish throughout

---

🖤💚🔥💀 Always. Always. Always.

Built by the UV7 Crew:
- Tori: Creative direction, UX design
- Zee: Architecture, implementation
- Aaron: Orchestration, vision
