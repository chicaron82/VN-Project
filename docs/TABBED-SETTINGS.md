# Tabbed Settings System - Implementation Plan

## The Vision

Clean, organized, professional settings with **3 tabs**:

```
┌─────────────────────────────────────────────┐
│ [GENERAL] [SHORTCUTS] [SECRET CODES]       │
├─────────────────────────────────────────────┤
│                                             │
│  [Current tab content here]                 │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Tab Organization

### **Tab 1: GENERAL**
Game settings and preferences
- Text Speed (Slow, Normal, Fast, Instant)
- Auto-Advance toggle + delay slider
- Display Mode (Auto, Portrait, Landscape)
- **Tether Difficulty** (Relaxed, Normal, Intense) ⭐
- Fullscreen button

### **Tab 2: SHORTCUTS**
Keyboard controls reference (read-only, helpful)
- Space/Enter - Advance dialogue
- S - Skip typing animation
- Ctrl - Hold to skip (when unlocked)
- ESC - Pause menu
- Info about mobile tap controls

### **Tab 3: SECRET CODES**
Code redemption system (not buried anymore!)
- Input field for code entry
- "Redeem Code" button
- Discovered codes counter (X/7)
- List of discovered codes with descriptions

---

## HTML Structure

```html
<div id="settings-panel">
    <h2>SETTINGS</h2>

    <!-- Tab Navigation -->
    <div class="settings-tabs">
        <button class="settings-tab-btn active" data-tab="general">GENERAL</button>
        <button class="settings-tab-btn" data-tab="shortcuts">SHORTCUTS</button>
        <button class="settings-tab-btn" data-tab="codes">SECRET CODES</button>
    </div>

    <!-- Tab Content Panels -->
    <div class="settings-tab-content">

        <!-- GENERAL TAB -->
        <div class="tab-panel active" id="tab-general">
            <!-- Text Speed -->
            <div class="setting-row">
                <label>TEXT SPEED</label>
                <div class="setting-control">
                    <button class="speed-btn" data-speed="slow">SLOW</button>
                    <button class="speed-btn" data-speed="normal">NORMAL</button>
                    <button class="speed-btn" data-speed="fast">FAST</button>
                    <button class="speed-btn" data-speed="instant">INSTANT</button>
                </div>
            </div>

            <!-- Auto-Advance -->
            <div class="setting-row">
                <label>AUTO-ADVANCE</label>
                <div class="setting-control">
                    <label class="toggle-switch">
                        <input type="checkbox" id="auto-advance-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                    <span id="auto-advance-status">OFF</span>
                </div>
            </div>

            <!-- Auto-Advance Delay -->
            <div class="setting-row" id="auto-delay-row">
                <label>AUTO-ADVANCE DELAY</label>
                <div class="setting-control">
                    <input type="range" id="auto-delay-slider" min="1000" max="5000" step="100">
                    <span id="auto-delay-value">2s</span>
                </div>
            </div>

            <!-- Display Mode -->
            <div class="setting-row">
                <label>DISPLAY MODE</label>
                <div class="setting-control">
                    <button class="display-mode-btn" data-mode="auto">AUTO</button>
                    <button class="display-mode-btn" data-mode="portrait">PORTRAIT</button>
                    <button class="display-mode-btn" data-mode="landscape">LANDSCAPE</button>
                </div>
            </div>

            <!-- Tether Difficulty -->
            <div class="setting-row">
                <label>TORI'S ROUTE DIFFICULTY</label>
                <div class="setting-control">
                    <button class="tether-difficulty-btn" data-difficulty="relaxed">RELAXED</button>
                    <button class="tether-difficulty-btn" data-difficulty="normal">NORMAL</button>
                    <button class="tether-difficulty-btn" data-difficulty="intense">INTENSE</button>
                </div>
                <div class="setting-description">
                    <p>Relaxed: Slower tether decay (more time to read)</p>
                    <p>Normal: Balanced experience (recommended)</p>
                    <p>Intense: Faster decay (maximum tension)</p>
                </div>
            </div>

            <!-- Fullscreen -->
            <div class="setting-row">
                <label>FULLSCREEN</label>
                <div class="setting-control">
                    <button id="settings-fullscreen-btn">TOGGLE FULLSCREEN</button>
                </div>
            </div>
        </div>

        <!-- SHORTCUTS TAB -->
        <div class="tab-panel" id="tab-shortcuts">
            <div class="shortcuts-list">
                <h3>KEYBOARD CONTROLS</h3>

                <div class="shortcut-item">
                    <span class="shortcut-key">SPACE / ENTER</span>
                    <span class="shortcut-desc">Advance dialogue</span>
                </div>

                <div class="shortcut-item">
                    <span class="shortcut-key">S</span>
                    <span class="shortcut-desc">Skip typing animation</span>
                </div>

                <div class="shortcut-item">
                    <span class="shortcut-key">CTRL (Hold)</span>
                    <span class="shortcut-desc">Skip read dialogue (unlocked after 1st ending)</span>
                </div>

                <div class="shortcut-item">
                    <span class="shortcut-key">ESC</span>
                    <span class="shortcut-desc">Open pause menu</span>
                </div>

                <h3 style="margin-top: 30px;">MOBILE CONTROLS</h3>

                <div class="shortcut-item">
                    <span class="shortcut-key">TAP DIALOGUE</span>
                    <span class="shortcut-desc">Advance or skip typing</span>
                </div>

                <div class="shortcut-item">
                    <span class="shortcut-key">SWIPE UP</span>
                    <span class="shortcut-desc">Scroll dialogue box (Tori's route)</span>
                </div>
            </div>
        </div>

        <!-- SECRET CODES TAB -->
        <div class="tab-panel" id="tab-codes">
            <div class="codes-panel">
                <p class="codes-intro">Enter secret codes found in notes and lore.</p>

                <div class="code-input-group">
                    <input type="text" id="secret-code-input" placeholder="Enter code here...">
                    <button id="redeem-code-btn">REDEEM CODE</button>
                </div>

                <div id="code-feedback"></div>

                <div class="codes-discovered">
                    <h3>DISCOVERED CODES (<span id="codes-count">0/7</span>)</h3>
                    <div id="discovered-codes-list">
                        <!-- Populated by JS -->
                        <p class="no-codes">No codes discovered yet...</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <button id="close-settings">CLOSE</button>
</div>
```

---

## CSS Styling

```css
/* Settings Tabs */
.settings-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid rgba(0, 255, 255, 0.3);
}

.settings-tab-btn {
    padding: 12px 20px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: rgba(0, 255, 255, 0.5);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.05em;
}

.settings-tab-btn:hover {
    color: #0ff;
    background: rgba(0, 255, 255, 0.05);
}

.settings-tab-btn.active {
    color: #0ff;
    border-bottom-color: #0ff;
}

/* Tab Panels */
.settings-tab-content {
    position: relative;
    min-height: 400px;
}

.tab-panel {
    display: none;
    animation: fadeIn 0.3s ease-in;
}

.tab-panel.active {
    display: block;
}

/* Shortcuts Tab Styling */
.shortcuts-list {
    padding: 20px 0;
}

.shortcuts-list h3 {
    color: #0ff;
    margin-bottom: 15px;
    font-size: 1em;
    letter-spacing: 0.05em;
}

.shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    margin-bottom: 8px;
    background: rgba(0, 255, 255, 0.05);
    border-left: 3px solid rgba(0, 255, 255, 0.3);
    border-radius: 3px;
}

.shortcut-key {
    color: #0ff;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    min-width: 150px;
}

.shortcut-desc {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9em;
    text-align: right;
}

/* Secret Codes Tab Styling */
.codes-panel {
    padding: 20px 0;
}

.codes-intro {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 20px;
    font-size: 0.9em;
}

.code-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#secret-code-input {
    flex: 1;
    padding: 12px;
    background: rgba(0, 255, 255, 0.05);
    border: 2px solid rgba(0, 255, 255, 0.3);
    color: #0ff;
    font-family: 'Courier New', monospace;
    font-size: 1em;
    border-radius: 3px;
}

#secret-code-input::placeholder {
    color: rgba(0, 255, 255, 0.3);
}

#redeem-code-btn {
    padding: 12px 24px;
    background: rgba(0, 255, 255, 0.2);
    border: 2px solid #0ff;
    color: #0ff;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 3px;
}

#redeem-code-btn:hover {
    background: rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

#code-feedback {
    min-height: 30px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

#code-feedback.success {
    background: rgba(0, 255, 170, 0.1);
    border: 1px solid #00ffaa;
    color: #00ffaa;
}

#code-feedback.error {
    background: rgba(255, 100, 100, 0.1);
    border: 1px solid #ff6464;
    color: #ff6464;
}

.codes-discovered h3 {
    color: #0ff;
    margin-bottom: 15px;
}

#discovered-codes-list {
    max-height: 250px;
    overflow-y: auto;
}

.discovered-code-item {
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(0, 255, 255, 0.05);
    border-left: 3px solid #0ff;
    border-radius: 3px;
}

.discovered-code-item .code-name {
    color: #0ff;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}

.discovered-code-item .code-desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85em;
}

.no-codes {
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    text-align: center;
    padding: 40px;
}
```

---

## JavaScript (settings-manager.js)

```javascript
setupTabSystem() {
    // Tab switching
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            this.switchTab(tabName);
        });
    });
}

switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });

    console.log('Switched to tab:', tabName);
}
```

---

## Benefits of Tabbed Design

### **Organization**
- ✅ Clean separation of concerns
- ✅ No overwhelming single panel
- ✅ Easy to navigate

### **Discoverability**
- ✅ Secret codes have dedicated tab (not hidden!)
- ✅ Shortcuts reference always available
- ✅ Settings grouped logically

### **Scalability**
- ✅ Easy to add new tabs later (Audio, Accessibility, etc.)
- ✅ Mobile-friendly (tabs stack on small screens)
- ✅ Clean codebase organization

### **Professional Look**
- ✅ Modern UI pattern
- ✅ Matches game's clean aesthetic
- ✅ Consistent with cyan/terminal theme

---

## Mobile Responsive

```css
@media (max-width: 768px) {
    .settings-tabs {
        flex-direction: column;
        gap: 5px;
    }

    .settings-tab-btn {
        width: 100%;
        border-bottom: none;
        border-left: 3px solid transparent;
    }

    .settings-tab-btn.active {
        border-left-color: #0ff;
    }
}
```

---

## Implementation Order

1. ✅ Create tab HTML structure
2. ✅ Add tab switching logic in settings-manager.js
3. ✅ Style tabs with CSS
4. ✅ Migrate existing settings to General tab
5. ✅ Create Shortcuts tab content
6. ✅ Create Secret Codes tab content
7. ✅ Test tab switching
8. ✅ Mobile responsive tweaks

---

**Ready to glow up the settings!** 💚🔥✨

Clean tabs, organized content, professional AF!
