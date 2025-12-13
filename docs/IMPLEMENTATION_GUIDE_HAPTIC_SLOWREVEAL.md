# Implementation Guide: Strategic Haptic + SlowReveal Placements

## ✅ COMPLETED

### Core Systems
- ✅ Haptic feedback settings toggle (UI + binding)
- ✅ triggerHaptic() helper method
- ✅ Slow-motion typewriter system
- ✅ Tether critical warning haptic (tether-system.js:112)

---

## 📋 REMAINING STRATEGIC PLACEMENTS

### HAPTIC FEEDBACK CALLS (3 locations)

#### 1. Heartbeat Rhythm - Ronnie Act 3
**FILE:** `routes/ronnie-route-act3.js`
**LOCATION:** `trueRoute_anchor()` method - where Ronnie places device in Tori's hand

**FIND:**
```javascript
trueRoute_anchor() {
    this.game.displayScene({
        character: 'Ronnie (steady, voice anchoring)',
        dialogue: '"Come home. Follow the heartbeat."',
        background: 'hospital.png',
        sprites: {
            left: 'ronnie-sprite.png'
        },
        next: () => {
            // Existing code here
            this.trueRoute_transfer();
        },
        delay: 3000
    }, 'trueRoute_anchor');
}
```

**ADD:**
```javascript
next: () => {
    // ZEE'S ADDITION: Heartbeat haptic 🖤
    // Lub-dub rhythm - physical connection to body anchor
    this.game.triggerHaptic([100, 100, 200], 'Heartbeat anchor');

    this.trueRoute_transfer();
},
```

---

#### 2. Vessel Hopping (BUZZ. BUZZ.) - Tori Route
**FILES:** `routes/tori-route-*.js` (wherever BUZZ moments occur)
**SEARCH FOR:** Scenes with "BUZZ. BUZZ." in dialogue

**EXAMPLE:**
```javascript
vesselTransferScene() {
    this.game.displayScene({
        character: 'Narration',
        dialogue: 'BUZZ. BUZZ.',
        internal: '[Visual: Screen flickers. Consciousness transfers. Jarring jump between vessels.]',
        next: () => {
            // ZEE'S ADDITION: Transfer shock haptic 🖤
            // Double pulse - consciousness jumping between devices
            this.game.triggerHaptic([100, 50, 100], 'Vessel transfer shock');

            this.nextScene();
        },
        delay: 2000,
        style: 'critical'
    }, 'vesselTransferScene');
}
```

**ACTION:** Search for "BUZZ" in tori-route files and add haptic to 3-5 key moments

---

#### 3. Hospital Alarms - Ronnie Act 3 Crisis
**FILE:** `routes/ronnie-route-act3.js`
**LOCATION:** `trueRoute_race()` or similar - hospital emergency scene

**FIND:**
```javascript
trueRoute_race() {
    this.game.displayScene({
        character: 'Narration',
        dialogue: 'MONITORS SCREAMING. COHERENCE DROPPING TO 12%. THE MAD DASH BEGINS.',
        internal: '[Visual: Ronnie sprinting down hospital corridors...]',
        background: 'hospital.png',
        next: () => {
            this.trueRoute_burst();
        },
        delay: 4000
    }, 'trueRoute_race');
}
```

**ADD:**
```javascript
next: () => {
    // ZEE'S ADDITION: Emergency alarm haptic 🖤
    // Chaotic pattern - urgent crisis feeling
    this.game.triggerHaptic([200, 100, 200, 100, 200], 'Hospital emergency alarms');

    this.trueRoute_burst();
},
```

---

### SLOW REVEAL FLAGS (3-5 locations)

#### 1. Tori's Body Realization
**FILE:** Tori's route file
**SEARCH FOR:** "It's... my... body" OR body realization scene

**ADD:**
```javascript
bodyRealizationScene() {
    this.game.displayScene({
        character: 'Tori (distant, dawning horror)',
        dialogue: 'It\'s... my... body.',
        internal: '[Everything clicks. The tether. The heartbeat. The anchor. It was always HER BODY calling her home.]',
        slowReveal: true, // ZEE: Slow-motion typewriter for emotional weight
        next: () => this.nextScene(),
        delay: 5000
    }, 'bodyRealizationScene');
}
```

---

#### 2. Memory Degradation
**FILE:** Tori's route file
**SEARCH FOR:** Memory failure or "can't remember" scenes

**ADD:**
```javascript
memoryFailScene() {
    this.game.displayScene({
        character: 'Tori (struggling)',
        dialogue: 'I... can\'t... remember...',
        internal: '[She reaches for the memory but it dissolves like static. The fragmentation is visible.]',
        slowReveal: true, // ZEE: Emotional weight through pacing
        next: () => this.nextScene(),
        delay: 4000
    }, 'memoryFailScene');
}
```

---

#### 3. Bootstrap Paradox Reveal
**FILE:** `routes/ronnie-route-act3.js` OR wherever Old Man reveal occurs
**SEARCH FOR:** "Old Man" revelation

**ADD:**
```javascript
oldManRevelation() {
    this.game.displayScene({
        character: 'Ronnie (horrified realization)',
        dialogue: 'The... Old Man... is... me.',
        internal: '[The bootstrap paradox closes. Failed attempts create the future that sends help back. The loop sustains itself through failure.]',
        slowReveal: true, // ZEE: Let the weight sink in
        next: () => this.nextScene(),
        delay: 5000
    }, 'oldManRevelation');
}
```

---

#### 4. Final Choice Moment
**FILE:** Ending scenes
**SEARCH FOR:** "This is goodbye" OR final decision dialogue

**ADD:**
```javascript
finalChoiceScene() {
    this.game.displayScene({
        character: 'Tori/Ronnie',
        dialogue: 'This... is... goodbye.' // OR 'Come... home.'
        internal: '[The weight of forever/choice settles.]',
        slowReveal: true, // ZEE: Maximum emotional impact
        // ... existing code
    }, 'finalChoiceScene');
}
```

---

#### 5. Despair Echo Takeover (OPTIONAL)
**FILE:** Tori route despair scenes
**SEARCH FOR:** Despair Echo gaining control

**ADD:**
```javascript
despairTakeoverScene() {
    this.game.displayScene({
        character: 'Despair Echo (taking control)',
        dialogue: 'Give... up...',
        internal: '[The darkness spreads. She can feel herself slipping...]',
        slowReveal: true, // ZEE: Horror through deliberate pacing
        // ... existing code
    }, 'despairTakeoverScene');
}
```

---

## HAPTIC PATTERNS REFERENCE

```javascript
// Single short pulse (warning)
[50]

// Single medium pulse (notification)
[100]

// Double pulse (transfer, shock)
[100, 50, 100]

// Heartbeat (lub-dub)
[100, 100, 200]

// Chaotic emergency (alarms, panic)
[200, 100, 200, 100, 200]

// Sustained heavy (impact, failure)
[300]
```

---

## SEARCH COMMANDS TO FIND SCENES

### Find Vessel Hopping Scenes
```bash
grep -r "BUZZ" routes/tori-route*.js
grep -r "transfer" routes/tori-route*.js
grep -r "vessel" routes/tori-route*.js
```

### Find Key Revelation Moments
```bash
grep -r "my.*body" routes/
grep -r "can't.*remember" routes/
grep -r "Old Man" routes/
grep -r "goodbye" routes/
grep -r "Despair" routes/tori-route*.js
```

### Find Hospital Scenes
```bash
grep -r "hospital" routes/ronnie-route-act3.js
grep -r "MONITOR" routes/ronnie-route-act3.js
grep -r "alarm" routes/ronnie-route-act3.js
```

---

## TESTING CHECKLIST

### Haptic Feedback
- [ ] Enable haptic in settings → feel test vibration
- [ ] Play Tori route → tether hits 30% → feel warning pulse
- [ ] Reach heartbeat scene → feel lub-dub pattern
- [ ] Hit vessel hop → feel double pulse
- [ ] Hospital emergency → feel chaotic pattern
- [ ] Disable haptic → no vibrations

### Slow Reveal
- [ ] Reach body realization → text types 5× slower
- [ ] Click/tap → skips to full text (normal behavior)
- [ ] Reach 3-5 slow reveal scenes → each feels deliberate
- [ ] Normal scenes → normal speed (30ms)
- [ ] Verify impact doesn't diminish (not overused)

---

## IMPLEMENTATION TIME ESTIMATE

- **Haptic calls (3 locations):** 30-45 minutes
- **SlowReveal flags (3-5 scenes):** 15-30 minutes
- **Testing:** 15-20 minutes

**Total:** ~1-1.5 hours to complete

---

## NOTES

- ⚠️ Don't overuse slowReveal - reserve for MAJOR revelations only (3-5 total)
- ⚠️ Haptic patterns should match emotional moment (heartbeat vs chaos)
- ✅ Both features are progressive enhancements (fail gracefully)
- ✅ Systems are complete - just need strategic placement
- ✅ Tether critical haptic already implemented and working

---

**Last Updated:** Implementation session
**Status:** Core systems complete, strategic placement pending
**Completion:** 10/12 tasks done (83%)
