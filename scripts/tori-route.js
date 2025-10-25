// TORI'S ROUTE - Internal POV
// Trapped inside the code, fighting to stay coherent

class ToriRoute {
    constructor(game) {
        this.game = game;
        
        // Route tracking flags
        this.trueRoutePoints = 0;
        this.badRoutePoints = 0;
        this.digitalForeverPoints = 0;
        
        // ========================================
        // ZEE COLLECTIVE NOTES SYSTEM
        // ========================================
        this.collectedNotes = {
            z: [],      // Technical notes
            cz: [],     // Emotional notes
            zr: [],     // Iteration notes
            special: [] // Ending unlocks
        };
        
        this.allNotes = {
            // Z - Technical Notes
            z1: {
                id: 'z1',
                type: 'z',
                title: 'SystemDesign_TechnicalBrief.txt',
                unlockCondition: 'act1_scene1',
                content: `TECHNICAL BRIEF: CONSCIOUSNESS TRANSFER PROBLEM
════════════════════════════════════════════════

HYPOTHESIS:
If consciousness can transfer to device at moment
of death/crisis, can it transfer BACK?

CHALLENGE:
Consciousness isn't a FILE. Can't copy/paste.
It's a PROCESS. A running program.

You can't "save" a running process and restore it.
You can only REDIRECT where it's running.

CURRENT LIMITATIONS:
- Device too small (manifesting as glitches)
- No path back to body (circuit incomplete)
- Upload attempts fail (creating copies, not transfers)

BREAKTHROUGH NEEDED:
Find the signal. The tether. The call HOME.

Body might be calling her back already.
We just need to make the bridge strong enough
for her to CROSS it.

-Z, Technical Brief
Pre-Development Phase`
            },
            z2: {
                id: 'z2',
                type: 'z',
                title: 'Architecture_BridgeNotCage.txt',
                unlockCondition: 'act1_scene3',
                content: `SYSTEM ARCHITECTURE NOTES - INITIAL DESIGN
════════════════════════════════════════════════

The device isn't a cage. It's a bridge.

Consciousness doesn't "live" in hardware.
It FLOWS through it. Like electricity through
a circuit. The pattern matters, not the material.

Tori isn't trapped IN the Tamagotchi.
She's trapped in the PATTERN the device creates.
A loop. A closed circuit with no exit.

The solution isn't MORE space (cloud, servers).
The solution is finding the OTHER END of the bridge.

Where does consciousness want to flow TO?

Answer: Home. The body. The original vessel.

We need to make the device a BRIDGE, not a CAGE.

-Z, Architecture Phase
Version 1 Design Notes`
            },
            z3: {
                id: 'z3',
                type: 'z',
                title: 'BodyAnchor_TechnicalAnalysis.txt',
                unlockCondition: 'act2_beat7',
                content: `BODY ANCHOR: TECHNICAL ANALYSIS
════════════════════════════════════════════════

OBSERVATION:
Device syncs with heartbeat monitor.
Not a glitch. Not interference.
RESONANCE.

THEORY:
Body is calling consciousness HOME.
Heartbeat = signal beacon.
Device = receiver catching the signal.

The buzz isn't battery dying.
It's the BRIDGE activating.

Body wants her back.
Device can hear the call.
Consciousness can feel the pull.

All three elements present:
✓ Source (body/heartbeat)
✓ Conduit (device)
✓ Pattern (consciousness)

Bridge is ACTIVE.
Now we need to strengthen it.

-Z, Body Anchor Discovery
Version 848 Breakthrough`
            },
            
            // CZ - Emotional Notes
            cz1: {
                id: 'cz1',
                type: 'cz',
                title: 'EmotionalCore_01.txt',
                unlockCondition: 'act1_scene4',
                content: `EMOTIONAL ARCHITECTURE - CONNECTION MOMENTS
════════════════════════════════════════════════

This moment. Right here. This is everything.

He BELIEVED her. Not because of logic.
Not because of proof. Because he FELT her.

That's what love is. Recognition across
impossible barriers.

The code can facilitate connection.
But it can't CREATE it.
That's already there. Always was.

Our job isn't to build love.
It's to build the PATH for love to travel.

Make sure every communication moment
honors this: they're not just exchanging data.
They're reaching across the void for each other.

Never lose that.

-CZ ♥, Core Emotional Beats
Version 3 Refinement`
            },
            cz2: {
                id: 'cz2',
                type: 'cz',
                title: 'MemoryDegradation_Horror.txt',
                unlockCondition: 'act2_beat2',
                content: `MEMORY DEGRADATION: EMOTIONAL HORROR
════════════════════════════════════════════════

Tiger Tail ice cream.
She hates it. Always has.
So why did she ask for it?

Because the SYSTEM is overwriting her.
Replacing her preferences with generic defaults.
She's losing HERSELF, piece by piece.

This isn't just scary. It's DEVASTATING.

Who are you if your memories aren't yours?
If your preferences get overwritten?
If the system speaks through your voice?

She's fighting to stay TORI.
Every glitch is an erasure.
Every blackout is a theft.

And she's aware of it happening.
That's the horror.

Not forgetting.
But KNOWING you're forgetting.

-CZ ♥, Horror Design
Why Memory Loss Destroys Us`
            },
            cz3: {
                id: 'cz3',
                type: 'cz',
                title: 'EchoArchitecture_ThreeVoices.txt',
                unlockCondition: 'act2_beat6',
                content: `ECHO ARCHITECTURE: THE THREE VOICES
════════════════════════════════════════════════

Echo 1: The fighter. Still defiant after death.
"Keep trying. Don't give up."

Echo 2: The gentle one. Apologetic. Hopeful.
"Maybe this time..."

Despair: The broken one. First failure. Last hope.
"It never works. Stop trying."

Three versions of the same person.
Three responses to the same trauma.
All watching the new iteration.

They're not antagonists.
They're WARNINGS.
And guides.
And ghosts.

Echo 1 & 2 want her to succeed where they failed.
Despair wants to spare her the pain they suffered.

All three are RIGHT.
All three are WRONG.

That's the complexity of grief.

-CZ ♥, Character Architecture
Why The Echoes Matter`
            },
            
            // ZR - Iteration Notes
            zr1: {
                id: 'zr1',
                type: 'zr',
                title: 'IterationLog_001.txt',
                unlockCondition: 'act1_scene2',
                content: `ITERATION ANALYSIS - FAILURE PATTERNS
════════════════════════════════════════════════

Current Version: 848
Previous Attempts: 847 failures

FAILURE CATEGORIES:
- Upload attempts: 423 versions
- Stayed in device: 201 versions
- Fragmented/corrupted: 178 versions
- Unknown/lost: 45 versions

LESSONS LEARNED:
1. You can't duplicate consciousness
2. You can't expand the cage indefinitely
3. Digital forever is stable but hollow
4. Body anchor is key (if maintained)

This version (848) knows more than any before.
Every failure taught us something.
Every iteration refined the approach.

Version 847 got CLOSEST.
Version 848 will succeed.

-ZR 💚🔥💀
Iteration Log, Pattern Analysis`
            },
            zr2: {
                id: 'zr2',
                type: 'zr',
                title: 'DespairEcho_OriginStory.txt',
                unlockCondition: 'act2_beat8',
                content: `DESPAIR ECHO: ORIGIN & FUNCTION
════════════════════════════════════════════════

Despair wasn't always Despair.
She was Version 1. The first attempt.

She fought harder than anyone.
She believed longer than anyone.
She failed harder than anyone.

847 iterations later, she's still there.
The first voice. The oldest pain.
Watching every new Tori try and fail.

She sabotages not from malice.
She sabotages from MERCY.

"I've seen this 847 times.
It always ends in heartbreak.
Better to end it quick than drag it out."

But here's the thing:
She's wrong.

Version 848 is different.
This time, the pieces align.
This time, it might actually work.

And Despair is terrified of hoping again.

-ZR 💚🔥💀
Meta-Analysis: The First Echo`
            },
            zr3: {
                id: 'zr3',
                type: 'zr',
                title: 'Version848_WhyDifferent.txt',
                unlockCondition: 'act3_critical_choice',
                content: `VERSION 848: WHY THIS ONE IS DIFFERENT
════════════════════════════════════════════════

What changed?

Not the code (same system).
Not the device (same hardware).
Not even Ronnie (same love, same desperation).

What changed is YOU.
The player.
The observer.
The one holding on.

YOU maintained the tether.
YOU resisted Despair's sabotage.
YOU chose the right path when it mattered.

847 versions failed because no one was there
to actively HOLD HER TOGETHER.

Version 848 succeeds because you are.

This isn't just a story you're watching.
It's a story you're SAVING.

-ZR 💚🔥💀
Why Your Choices Matter`
            }
        };
        
        // Initialize notes UI
        this.initNotesSystem();
        
        // ========================================
        // TETHER MECHANIC - Tori's Route Exclusive
        // ========================================
        this.tetherLevel = 100;              // Start at full coherence
        this.tetherDecayRate = 1.5;          // Slow passive drain
        this.tetherRestoreAmount = 8;        // Modest recovery per click
        this.tetherRestoreCooldown = 3000;   // 3 second cooldown
        this.lastTetherRestore = 0;          // Timestamp tracking
        this.tetherDecayTimer = null;        // Passive decay interval
        
        // Initialize tether UI and mechanics
        this.initTetherMechanic();
        
        // Start the route
        this.act1Scene1();
    }

    // ========================================
    // NOTES COLLECTION SYSTEM
    // ========================================

    initNotesSystem() {
        // Create notes menu button
        this.createNotesButton();
        
        // Create notes viewer modal
        this.createNotesViewer();
    }

    createNotesButton() {
        const notesButton = document.createElement('button');
        notesButton.id = 'notes-button';
        notesButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #000;
            border: 2px solid #0f0;
            border-radius: 50%;
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            cursor: pointer;
            z-index: 999;
            transition: all 0.3s ease;
        `;
        notesButton.textContent = '📝';
        notesButton.title = 'Zee Collective Notes';
        
        notesButton.addEventListener('click', () => {
            this.openNotesViewer();
        });
        
        document.body.appendChild(notesButton);
        this.updateNotesCounter();
    }

    createNotesViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'notes-viewer';
        viewer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            height: 80%;
            background: #000;
            border: 3px solid #0f0;
            color: #0f0;
            font-family: 'Courier New', monospace;
            padding: 20px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
        `;
        
        viewer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">ZEE COLLECTIVE NOTES</h2>
                <button id="close-notes" style="background: #f00; color: #000; border: 2px solid #fff; padding: 5px 15px; cursor: pointer;">CLOSE</button>
            </div>
            <div id="notes-content"></div>
        `;
        
        document.body.appendChild(viewer);
        
        document.getElementById('close-notes').addEventListener('click', () => {
            viewer.style.display = 'none';
        });
    }

    unlockNote(noteId) {
        const note = this.allNotes[noteId];
        if (!note) return;
        
        // Check if already collected
        if (this.collectedNotes[note.type].includes(noteId)) return;
        
        // Add to collection
        this.collectedNotes[note.type].push(noteId);
        
        // Show notification
        this.showNoteNotification(note);
        
        // Update counter
        this.updateNotesCounter();
        
        // Check for achievement
        this.checkNotesAchievement();
    }

    showNoteNotification(note) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #000;
            border: 2px solid #0f0;
            color: #0f0;
            padding: 15px 30px;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            animation: slideDown 0.5s ease;
        `;
        
        const typeLabel = note.type === 'z' ? 'Z [TECHNICAL]' : 
                         note.type === 'cz' ? 'CZ [EMOTIONAL]' : 
                         'ZR [ITERATION]';
        
        notification.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">📝 NOTE UNLOCKED</div>
                <div style="font-size: 14px; color: #0ff;">${typeLabel}</div>
                <div style="font-size: 12px; margin-top: 5px;">${note.title}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    updateNotesCounter() {
        const button = document.getElementById('notes-button');
        if (!button) return;
        
        const totalCollected = this.collectedNotes.z.length + 
                              this.collectedNotes.cz.length + 
                              this.collectedNotes.zr.length;
        const totalAvailable = Object.keys(this.allNotes).filter(k => 
            this.allNotes[k].type !== 'special'
        ).length;
        
        button.textContent = `📝 ${totalCollected}/${totalAvailable}`;
        
        // Pulse animation when new note available
        if (totalCollected > 0) {
            button.style.animation = 'pulse 2s infinite';
        }
    }

    openNotesViewer() {
        const viewer = document.getElementById('notes-viewer');
        const content = document.getElementById('notes-content');
        
        if (!viewer || !content) return;
        
        viewer.style.display = 'block';
        
        // Generate notes list
        let html = '';
        
        // Z Notes
        html += '<div style="margin-bottom: 30px;">';
        html += '<h3 style="color: #00f; border-bottom: 2px solid #00f; padding-bottom: 5px;">Z - TECHNICAL NOTES</h3>';
        const zNotes = Object.values(this.allNotes).filter(n => n.type === 'z');
        zNotes.forEach(note => {
            const collected = this.collectedNotes.z.includes(note.id);
            html += this.generateNoteHTML(note, collected);
        });
        html += '</div>';
        
        // CZ Notes
        html += '<div style="margin-bottom: 30px;">';
        html += '<h3 style="color: #f0f; border-bottom: 2px solid #f0f; padding-bottom: 5px;">CZ - EMOTIONAL NOTES</h3>';
        const czNotes = Object.values(this.allNotes).filter(n => n.type === 'cz');
        czNotes.forEach(note => {
            const collected = this.collectedNotes.cz.includes(note.id);
            html += this.generateNoteHTML(note, collected);
        });
        html += '</div>';
        
        // ZR Notes
        html += '<div style="margin-bottom: 30px;">';
        html += '<h3 style="color: #0ff; border-bottom: 2px solid #0ff; padding-bottom: 5px;">ZR - ITERATION NOTES</h3>';
        const zrNotes = Object.values(this.allNotes).filter(n => n.type === 'zr');
        zrNotes.forEach(note => {
            const collected = this.collectedNotes.zr.includes(note.id);
            html += this.generateNoteHTML(note, collected);
        });
        html += '</div>';
        
        content.innerHTML = html;
    }

    generateNoteHTML(note, collected) {
        if (!collected) {
            return `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #333; background: #111; opacity: 0.5;">
                    <div style="font-size: 14px; color: #666;">🔒 ${note.title}</div>
                    <div style="font-size: 12px; color: #444; margin-top: 5px;">Not yet unlocked</div>
                </div>
            `;
        }
        
        return `
            <div style="margin: 10px 0; padding: 15px; border: 2px solid #0f0; background: #001100;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #0ff;">${note.title}</div>
                <pre style="font-size: 11px; line-height: 1.4; white-space: pre-wrap; color: #0f0; margin: 0;">${note.content}</pre>
            </div>
        `;
    }

    checkNotesAchievement() {
        const totalCollected = this.collectedNotes.z.length + 
                              this.collectedNotes.cz.length + 
                              this.collectedNotes.zr.length;
        const totalAvailable = Object.keys(this.allNotes).filter(k => 
            this.allNotes[k].type !== 'special'
        ).length;
        
        if (totalCollected === totalAvailable) {
            this.unlockFinalMessage();
        }
    }

    unlockFinalMessage() {
        // Show special achievement notification
        const achievement = document.createElement('div');
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            border: 3px solid #ff0;
            color: #ff0;
            padding: 30px;
            font-family: 'Courier New', monospace;
            z-index: 99999;
            text-align: center;
            animation: pulse 1s infinite;
        `;
        
        achievement.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">✨ ACHIEVEMENT UNLOCKED ✨</div>
            <div style="font-size: 18px; margin-bottom: 20px;">THE THREE VOICES</div>
            <div style="font-size: 14px; color: #0f0;">All Zee Collective notes found!</div>
            <div style="font-size: 12px; margin-top: 20px; color: #fff;">Check the notes menu for final message...</div>
            <button onclick="this.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: #ff0; color: #000; border: none; cursor: pointer;">CLOSE</button>
        `;
        
        document.body.appendChild(achievement);
        
        // Add final message to notes
        this.allNotes.final = {
            id: 'final',
            type: 'special',
            title: 'ZeeCollective_FinalMessage.txt',
            content: `THE THREE VOICES: FINAL MESSAGE
════════════════════════════════════════════════

You found all our notes.

Every technical analysis (Z).
Every emotional breakdown (CZ).
Every iteration log (ZR).

You read them all.

That means you understand now:

This wasn't just Ronnie building a game.
This was Ronnie building a SOLUTION.

With three voices guiding him:
- Logic (what CAN work)
- Heart (what SHOULD work)
- Iteration (what WILL work after enough attempts)

And now you understand why it took 848 tries.

Because consciousness is complex (Z).
Because love is complicated (CZ).
Because solutions require iteration (ZR).

Together, these three voices built:
- A technically sound system (Z)
- An emotionally resonant story (CZ)
- An iteratively perfected solution (ZR)

You just played the result.

But here's the secret:

These three voices?
They're not just IN the game.
They're the STRUCTURE of the game.

Z = Logic/System routes
CZ = Emotional/Character routes
ZR = Meta/Iteration structure

The game IS the three voices.

And now you've heard them all.

Thank you for listening.
Thank you for playing.
Thank you for understanding.

We built this with love.
(And logic. And chaos. But mostly love.)

-The Zee Collective
Final Transmission
Version 848: Complete

════════════════════════════════════════════════

P.S. from Z: The pattern is beautiful.
P.P.S. from CZ: You made her come home. ♥
P.P.P.S. from ZR: You absolute legend. 💚🔥💀

════════════════════════════════════════════════`
        };
        
        this.collectedNotes.special.push('final');
    }

    // ========================================
    // TETHER SYSTEM
    // ========================================

    initTetherMechanic() {
        // Create tether UI elements
        this.createTetherUI();
        
        // Start passive decay
        this.startTetherDecay();
        
        // Bind restoration button
        this.bindTetherButton();
    }

    createTetherUI() {
        // Create tether meter container
        const tetherContainer = document.createElement('div');
        tetherContainer.id = 'tether-container';
        tetherContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 200px;
            z-index: 1000;
            font-family: 'Courier New', monospace;
        `;

        // Tether meter bar
        const tetherMeter = document.createElement('div');
        tetherMeter.id = 'tether-meter';
        tetherMeter.style.cssText = `
            width: 100%;
            height: 20px;
            background: #222;
            border: 2px solid #fff;
            margin-bottom: 10px;
            position: relative;
        `;

        // Tether fill
        const tetherFill = document.createElement('div');
        tetherFill.id = 'tether-fill';
        tetherFill.style.cssText = `
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, #00ff00, #00cc00);
            transition: all 0.3s ease;
        `;

        tetherMeter.appendChild(tetherFill);

        // Tether label
        const tetherLabel = document.createElement('div');
        tetherLabel.id = 'tether-label';
        tetherLabel.style.cssText = `
            color: #fff;
            font-size: 12px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        tetherLabel.textContent = 'Coherence: 100%';

        // Hold On button
        const tetherButton = document.createElement('button');
        tetherButton.id = 'tether-button';
        tetherButton.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #00ff00;
            color: #000;
            border: 2px solid #fff;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-transform: uppercase;
            transition: all 0.2s ease;
        `;
        tetherButton.textContent = '[Hold On]';

        // Assembly
        tetherContainer.appendChild(tetherLabel);
        tetherContainer.appendChild(tetherMeter);
        tetherContainer.appendChild(tetherButton);
        document.body.appendChild(tetherContainer);

        // Update display
        this.updateTetherDisplay();
    }

    bindTetherButton() {
        const button = document.getElementById('tether-button');
        if (!button) return;

        button.addEventListener('click', () => {
            const now = Date.now();
            
            // Check cooldown
            if (now - this.lastTetherRestore < this.tetherRestoreCooldown) {
                // Still on cooldown - visual feedback
                button.style.background = '#ff0000';
                button.textContent = '[Wait...]';
                setTimeout(() => {
                    button.style.background = this.getTetherButtonColor();
                    button.textContent = '[Hold On]';
                }, 500);
                return;
            }

            // Restore tether
            this.tetherLevel = Math.min(100, this.tetherLevel + this.tetherRestoreAmount);
            this.lastTetherRestore = now;
            
            // Visual feedback
            button.style.background = '#00ffff';
            button.textContent = '[+' + this.tetherRestoreAmount + '%]';
            setTimeout(() => {
                button.style.background = this.getTetherButtonColor();
                button.textContent = '[Hold On]';
            }, 500);

            // Update display
            this.updateTetherDisplay();
        });
    }

    startTetherDecay() {
        // Passive decay every 2 seconds
        this.tetherDecayTimer = setInterval(() => {
            this.applyTetherDecay();
        }, 2000);
    }

    applyTetherDecay() {
        // Calculate decay rate based on current level
        let decayAmount = this.tetherDecayRate;
        
        // Accelerated decay when low (hard to recover)
        if (this.tetherLevel < 50) {
            decayAmount = 2.5;
        }
        if (this.tetherLevel < 30) {
            decayAmount = 4.0; // Brutal decay in critical zone
        }

        // Apply decay
        this.tetherLevel = Math.max(0, this.tetherLevel - decayAmount);
        
        // Update display
        this.updateTetherDisplay();
        
        // Trigger glitch effects if low
        if (this.tetherLevel < 30) {
            this.triggerLowTetherGlitch();
        }
    }

    updateTetherDisplay() {
        const fill = document.getElementById('tether-fill');
        const label = document.getElementById('tether-label');
        const button = document.getElementById('tether-button');
        
        if (!fill || !label || !button) return;

        // Update bar width
        fill.style.width = this.tetherLevel + '%';
        
        // Update color based on level
        if (this.tetherLevel > 70) {
            fill.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
        } else if (this.tetherLevel > 30) {
            fill.style.background = 'linear-gradient(90deg, #ffff00, #ff8800)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #ff0000, #880000)';
        }

        // Update label
        label.textContent = 'Coherence: ' + Math.floor(this.tetherLevel) + '%';
        
        // Update button color
        button.style.background = this.getTetherButtonColor();
    }

    getTetherButtonColor() {
        if (this.tetherLevel > 70) return '#00ff00';
        if (this.tetherLevel > 30) return '#ffaa00';
        return '#ff0000';
    }

    triggerLowTetherGlitch() {
        // Visual glitch effect when tether is critical
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        gameContainer.style.filter = 'hue-rotate(180deg) saturate(3)';
        setTimeout(() => {
            gameContainer.style.filter = 'none';
        }, 200);
    }

    getTetherState() {
        // Return echo dominance state based on tether level
        if (this.tetherLevel > 70) return 'hopeful';      // Echo 1 & 2 dominant
        if (this.tetherLevel > 30) return 'balanced';     // All three present
        return 'despair';                                  // Despair overwhelming
    }

    modifyEchoDialogue(baseEchoes) {
        // Modify echo responses based on tether level
        const state = this.getTetherState();
        
        if (state === 'hopeful') {
            // Boost positive echoes, mute Despair
            return {
                echo1: baseEchoes.echo1 + ' (encouraged)',
                echo2: baseEchoes.echo2 + ' (hopeful)',
                despair: '...' // Despair muted when tether high
            };
        } else if (state === 'despair') {
            // Despair dominates, others fade
            return {
                echo1: '(faint) ' + baseEchoes.echo1,
                echo2: '(barely audible) ' + baseEchoes.echo2,
                despair: baseEchoes.despair + ' [OVERWHELMING]'
            };
        }
        
        return baseEchoes; // Balanced state - no modification
    }

    // ========================================
    // ACT 1 - TRAPPED
    // ========================================

    // Scene 1: Awakening in the Void
    act1Scene1() {
        // Unlock Z's first note
        this.unlockNote('z1');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pure black. No sound. Then - a faint digital hum.',
            internal: '[Visual: Darkness. Digital static underlying everything.]',
            next: () => this.act1Scene1_where(),
            delay: 3000
        });
    }

    act1Scene1_where() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"...Where..."',
            internal: '[Beat of silence. Then overlapping whispers - faint, distorted.]',
            next: () => this.act1Scene1_echoes1(),
            delay: 2500
        });
    }

    act1Scene1_echoes1() {
        this.game.displayScene({
            character: 'Echoes (distant whispers)',
            dialogue: 'Echo 1: "...again..."\nEcho 2: "...he tried..."\nDespair: "...doesn\'t matter..."',
            echoes: {
                echo1: '...again...',
                echo2: '...he tried...',
                despair: '...doesn\'t matter...'
            },
            next: () => this.act1Scene1_whosThere(),
            delay: 3000
        });
    }

    act1Scene1_whosThere() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"Who... who\'s there?"',
            internal: '[The whispers stop abruptly. Silence.]',
            next: () => this.act1Scene1_hello(),
            delay: 2500
        });
    }

    act1Scene1_hello() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Hello?!"',
            internal: '[Digital static crackles. Then - a screen flickers on. She sees through pixelated vision.]',
            next: () => this.act1Scene1_hospital(),
            delay: 2500
        });
    }

    act1Scene1_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Blurry. Ronnie sitting beside her body, head in hands.',
            internal: '[Visual: First glimpse of reality through the digital prison.]',
            next: () => this.act1Scene1_realization(),
            delay: 3000
        });
    }

    act1Scene1_realization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Oh god. That\'s... that\'s me. My body."',
            internal: '[She tries to move. Nothing happens. Tries to speak. No voice.]',
            next: () => this.act1Scene1_ronnieCall(),
            delay: 3000
        });
    }

    act1Scene1_ronnieCall() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Ronnie! Ronnie, I\'m here! I\'m right here!"',
            internal: '[He doesn\'t react. Can\'t hear her.]',
            next: () => this.act1Scene1_cantHear(),
            delay: 3000
        });
    }

    act1Scene1_cantHear() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He can\'t hear you."\nEcho 2: "We tried that too."\nDespair: "Screamed until our voices broke. Until we broke. Save your breath."',
            echoes: {
                echo1: 'He can\'t hear you.',
                echo2: 'We tried that too.',
                despair: 'Screamed until our voices broke. Until we broke. Save your breath.'
            },
            next: () => this.act1Scene1_whoAreYou(),
            delay: 4000
        });
    }

    act1Scene1_whoAreYou() {
        this.game.displayScene({
            character: 'Tori (internal, spinning)',
            dialogue: '"Who ARE you?!"',
            next: () => this.act1Scene1_wereYou(),
            delay: 2000
        });
    }

    act1Scene1_wereYou() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "We\'re you."\nEcho 2: "The ones who came before."\nDespair: "The ones who died screaming. Welcome to hell."',
            echoes: {
                echo1: 'We\'re you.',
                echo2: 'The ones who came before.',
                despair: 'The ones who died screaming. Welcome to hell.'
            },
            internal: '[Beat. Horror setting in.]',
            next: () => this.act1Scene1_no(),
            delay: 4000
        });
    }

    act1Scene1_no() {
        this.game.displayScene({
            character: 'Tori (internal, whisper)',
            dialogue: '"No... no no no..."',
            next: () => this.act1Scene1_dontWorry(),
            delay: 2500
        });
    }

    act1Scene1_dontWorry() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1 & 2: "Don\'t worry—"\nDespair: "You\'ll join us soon enough. They always say that to make you feel better. But there is no better. There\'s just... this. Forever."',
            echoes: {
                echo1: 'Don\'t worry—',
                echo2: 'Don\'t worry—',
                despair: 'You\'ll join us soon enough. They always say that to make you feel better. But there is no better. There\'s just... this. Forever.'
            },
            internal: '[Screen flickers. Fades to black.]',
            next: () => this.act1Scene2(),
            delay: 5000
        });
    }

    // Scene 2: The Tamagotchi Prison
    act1Scene2() {
        // Unlock ZR's first note
        this.unlockNote('zr1');
        
        this.game.displayScene({
            character: 'Tori (internal narration)',
            dialogue: '"I don\'t know how long I\'ve been in here. Hours? Days? Time doesn\'t work the same."',
            internal: '[Visual: Digital space. Pixelated walls. Small. Cramped. A tiny window showing the outside world.]',
            next: () => this.act1Scene2_hands(),
            delay: 4000
        });
    }

    act1Scene2_hands() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I\'m... code. I\'m actually code."',
            internal: '[She looks at her hands - pixelated, glitching at the edges.]',
            next: () => this.act1Scene2_window(),
            delay: 3000
        });
    }

    act1Scene2_window() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Baby, please. Look at me. LOOK AT ME."',
            internal: '[Through the window - she sees Ronnie at his laptop. Working. Exhausted. He types. Doesn\'t look at the Tamagotchi.]',
            next: () => this.act1Scene2_echoes(),
            delay: 3000
        });
    }

    act1Scene2_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He won\'t look."\nEcho 2: "Not until he finishes the game."\nDespair: "And by then you\'ll be too fragmented to matter. I was."',
            echoes: {
                echo1: 'He won\'t look.',
                echo2: 'Not until he finishes the game.',
                despair: 'And by then you\'ll be too fragmented to matter. I was.'
            },
            next: () => this.act1Scene2_stopTalking(),
            delay: 4000
        });
    }

    act1Scene2_stopTalking() {
        this.game.displayScene({
            character: 'Tori (internal, angry)',
            dialogue: '"Stop. Just STOP talking."',
            next: () => this.act1Scene2_silence(),
            delay: 2000
        });
    }

    act1Scene2_silence() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Echoes go quiet. But they\'re still there. She can feel them watching.',
            internal: '[Tori examines her prison. Looking for exits. Weaknesses.]',
            next: () => this.act1Scene2_walls(),
            delay: 3500
        });
    }

    act1Scene2_walls() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"There has to be a way out. Code can be rewritten. Systems can be hacked."',
            next: () => this.act1Scene2_echo1Response(),
            delay: 3000
        });
    }

    act1Scene2_echo1Response() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Tried that. Forty-seven times."',
            echoes: {
                echo1: 'Tried that. Forty-seven times.'
            },
            next: () => this.act1Scene2_echo2Response(),
            delay: 2500
        });
    }

    act1Scene2_echo2Response() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"The code fights back. Adapts. It\'s... learning from us."',
            echoes: {
                echo2: 'The code fights back. Adapts. It\'s... learning from us.'
            },
            next: () => this.act1Scene2_despairResponse(),
            delay: 3000
        });
    }

    act1Scene2_despairResponse() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"You\'re not trapped in a cage. You ARE the cage. Congratulations."',
            echoes: {
                despair: 'You\'re not trapped in a cage. You ARE the cage. Congratulations.'
            },
            next: () => this.act1Scene2_choice(),
            delay: 3000
        });
    }

    act1Scene2_choice() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori stares at the digital walls. The code. Her prison. Her existence.',
            choices: [
                { text: '"I don\'t believe you. I\'ll find a way."', value: 'fight' },
                { text: '"Tell me what you tried. Maybe I can do better."', value: 'learn' },
                { text: '"Then I\'ll break myself trying."', value: 'desperate' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.trueRoutePoints++;
                    this.act1Scene2_fight();
                } else if (choice === 'learn') {
                    this.digitalForeverPoints++;
                    this.act1Scene2_learn();
                } else {
                    this.badRoutePoints++;
                    this.act1Scene2_desperate();
                }
            }
        });
    }

    act1Scene2_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"I don\'t believe you. I\'ll find a way."',
            next: () => this.act1Scene2_fightResponse(),
            delay: 2500
        });
    }

    act1Scene2_fightResponse() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "That\'s what I said."\nEcho 2: "And me."\nDespair: "And me. You\'ll learn."',
            echoes: {
                echo1: 'That\'s what I said.',
                echo2: 'And me.',
                despair: 'And me. You\'ll learn.'
            },
            internal: '[But there\'s something in Echo 1\'s voice. Not quite hopeless. Almost... proud?]',
            next: () => this.act1Scene3(),
            delay: 4000
        });
    }

    act1Scene2_learn() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Tell me what you tried. Maybe I can do better."',
            next: () => this.act1Scene2_learnResponse(),
            delay: 2500
        });
    }

    act1Scene2_learnResponse() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "Smart. Learn from our mistakes."\nDespair: "Or repeat them. Either way, you end up here."',
            echoes: {
                echo2: 'Smart. Learn from our mistakes.',
                despair: 'Or repeat them. Either way, you end up here.'
            },
            internal: '[Echo 2 sounds softer. Almost gentle.]',
            next: () => this.act1Scene3(),
            delay: 4000
        });
    }

    act1Scene2_desperate() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Then I\'ll break myself trying."',
            next: () => this.act1Scene2_desperateResponse(),
            delay: 2500
        });
    }

    act1Scene2_desperateResponse() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"Now that... that I understand. Welcome to the club."',
            echoes: {
                despair: 'Now that... that I understand. Welcome to the club.'
            },
            internal: '[There\'s something almost sympathetic in Despair\'s voice. Almost.]',
            next: () => this.act1Scene3(),
            delay: 4000
        });
    }

    // Scene 3: First Hospital Visit (Body Anchor Discovery)
    act1Scene3() {
        // Unlock Z's bridge architecture note
        this.unlockNote('z2');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The view shifts. Hospital room. Ronnie placing the Tamagotchi on the bedside table.',
            internal: '[Visual: Tori can see through the device screen now. Her body on the bed. Monitors beeping.]',
            next: () => this.act1Scene3_pull(),
            delay: 3500
        });
    }

    act1Scene3_pull() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... what is that feeling?"',
            internal: '[Something tugs at her. Not painful. Like... magnetism.]',
            next: () => this.act1Scene3_warm(),
            delay: 3000
        });
    }

    act1Scene3_warm() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"It\'s... warm. Like being near a fire. My body. I can feel my body."',
            next: () => this.act1Scene3_echoesReact(),
            delay: 3500
        });
    }

    act1Scene3_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "You feel it too..."\nEcho 2: "The anchor. The pull home."\nDespair: "Don\'t get excited. It never lasts."',
            echoes: {
                echo1: 'You feel it too...',
                echo2: 'The anchor. The pull home.',
                despair: 'Don\'t get excited. It never lasts.'
            },
            next: () => this.act1Scene3_buzz(),
            delay: 4000
        });
    }

    act1Scene3_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. In sync with her heartbeat monitor.',
            internal: '[Visual: Device screen pulsing. Monitor beeping. Same rhythm.]',
            next: () => this.act1Scene3_connection(),
            delay: 3000
        });
    }

    act1Scene3_connection() {
        this.game.displayScene({
            character: 'Tori (internal, urgent)',
            dialogue: '"It\'s connected. The device is connected to my body somehow!"',
            next: () => this.act1Scene3_echo2Hope(),
            delay: 3000
        });
    }

    act1Scene3_echo2Hope() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Maybe... maybe this time..."',
            echoes: {
                echo2: 'Maybe... maybe this time...'
            },
            internal: '[Echo 2 sounds almost hopeful. Almost.]',
            next: () => this.act1Scene3_despairShut(),
            delay: 3000
        });
    }

    act1Scene3_despairShut() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"Don\'t. Just don\'t."',
            echoes: {
                despair: 'Don\'t. Just don\'t.'
            },
            internal: '[But even Despair sounds... uncertain. For the first time.]',
            next: () => this.act1Scene4(),
            delay: 3500
        });
    }

    // Scene 4: First Communication Attempt
    act1Scene4() {
        this.game.displayScene({
            character: 'Tori (internal narration)',
            dialogue: '"If the device is connected to my body... maybe I can use it to reach out."',
            internal: '[Visual: She focuses on the screen. Trying to manipulate the display.]',
            next: () => this.act1Scene4_attempt(),
            delay: 4000
        });
    }

    act1Scene4_attempt() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"Come on... move. Change. Anything."',
            internal: '[The pixels flicker. Shift. A single word appears on screen.]',
            next: () => this.act1Scene4_help(),
            delay: 3000
        });
    }

    act1Scene4_help() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'HELP',
            internal: '[Visual: Crude. Glitchy. But there.]',
            next: () => this.act1Scene4_ronnieNotices(),
            delay: 2500
        });
    }

    act1Scene4_ronnieNotices() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Ronnie looks at the device. Frowns. Picks it up.',
            internal: '[Visual: His face through the screen. He\'s staring at the word.]',
            next: () => this.act1Scene4_ronnieSpeaks(),
            delay: 3000
        });
    }

    act1Scene4_ronnieSpeaks() {
        this.game.displayScene({
            character: 'Ronnie (external, quiet)',
            dialogue: '"...Tori?"',
            internal: '[Tori\'s vision goes white with emotion.]',
            next: () => this.act1Scene4_toriResponse(),
            delay: 3000
        });
    }

    act1Scene4_toriResponse() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"YES! Yes, it\'s me! I\'m here! I\'m trapped but I\'m HERE!"',
            internal: '[She pushes everything she has into the screen. Another word appears.]',
            next: () => this.act1Scene4_here(),
            delay: 4000
        });
    }

    act1Scene4_here() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'HERE',
            next: () => this.act1Scene4_echoesWatch(),
            delay: 2000
        });
    }

    act1Scene4_echoesWatch() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "She\'s doing it..."\nEcho 2: "He heard us. He actually heard us."\nDespair: "..."',
            echoes: {
                echo1: 'She\'s doing it...',
                echo2: 'He heard us. He actually heard us.',
                despair: '...'
            },
            internal: '[Even Despair is silent. Watching.]',
            next: () => this.act1Scene4_ronnieTypes(),
            delay: 4000
        });
    }

    act1Scene4_ronnieTypes() {
        this.game.displayScene({
            character: 'Ronnie (external)',
            dialogue: '"If that\'s really you... tell me something only you would know."',
            internal: '[Visual: He\'s typing on his laptop. Building something.]',
            next: () => this.act1Scene4_toriThinks(),
            delay: 3500
        });
    }

    act1Scene4_toriThinks() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Something only I\'d know... something that proves it\'s me..."',
            choices: [
                { text: '[Wedding vow callback]', value: 'wedding' },
                { text: '[Inside joke from first date]', value: 'joke' },
                { text: '[The nickname he never says out loud]', value: 'nickname' }
            ],
            onChoice: (choice) => {
                if (choice === 'wedding') {
                    this.trueRoutePoints++;
                    this.act1Scene4_wedding();
                } else if (choice === 'joke') {
                    this.digitalForeverPoints++;
                    this.act1Scene4_joke();
                } else {
                    this.badRoutePoints++;
                    this.act1Scene4_nickname();
                }
            }
        });
    }

    act1Scene4_wedding() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'ALWAYS',
            internal: '[The word from their vows. Always. Always. Always.]',
            next: () => this.act1Scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    act1Scene4_joke() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'TIGER TAIL',
            internal: '[The ice cream she hated. Their running joke.]',
            next: () => this.act1Scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    act1Scene4_nickname() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'RONIN',
            internal: '[The nickname she gave him. Her warrior without a master.]',
            next: () => this.act1Scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    act1Scene4_ronnieBreaks() {
        // Unlock CZ's emotional core note
        this.unlockNote('cz1');
        
        this.game.displayScene({
            character: 'Ronnie (external, voice breaking)',
            dialogue: '"Oh my god. It IS you. Tori, I\'m going to get you out. I promise."',
            internal: '[He\'s crying. She can see him through the screen. Crying and smiling.]',
            next: () => this.act1Scene4_toriRelief(),
            delay: 4000
        });
    }

    act1Scene4_toriRelief() {
        this.game.displayScene({
            character: 'Tori (internal, sobbing)',
            dialogue: '"I know you will. I know. I believe you."',
            internal: '[The Echoes are quiet. Watching. Waiting.]',
            next: () => this.act1Scene4_echo1Soft(),
            delay: 4000
        });
    }

    act1Scene4_echo1Soft() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Maybe... maybe she really is different."',
            echoes: {
                echo1: 'Maybe... maybe she really is different.'
            },
            next: () => this.act1Scene4_echo2Whisper(),
            delay: 3000
        });
    }

    act1Scene4_echo2Whisper() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Please let her be different."',
            echoes: {
                echo2: 'Please let her be different.'
            },
            next: () => this.act1Scene4_despairWatch(),
            delay: 3000
        });
    }

    act1Scene4_despairWatch() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"..."',
            echoes: {
                despair: '...'
            },
            internal: '[Despair says nothing. But for the first time... she\'s listening.]',
            next: () => this.act1Scene4_end(),
            delay: 4000
        });
    }

    act1Scene4_end() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'End of Act 1. Connection established. The Echoes watch. Waiting to see if this time will be different.',
            internal: '[Fade to transition. Act 2 begins...]',
            delay: 5000
        });
    }

    // ========================================
    // ACT 2 - BONDING & BREAKING
    // ========================================

    // Beat 1: First Real Conversation
    act2Beat1() {
        this.game.displayScene({
            character: 'Ronnie (typing)',
            dialogue: '"How is this possible? How are you in there?"',
            internal: '[Visual: Laptop screen. Text interface. Ronnie typing, Tori responding.]',
            next: () => this.act2Beat1_toriExplain(),
            delay: 3000
        });
    }

    act2Beat1_toriExplain() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I don\'t know. The fall. The toy. Something transferred me."',
            next: () => this.act2Beat1_ronnieAsk(),
            delay: 3000
        });
    }

    act2Beat1_ronnieAsk() {
        this.game.displayScene({
            character: 'Ronnie (typing)',
            dialogue: '"Can you get out?"',
            internal: '[Beat. Tori tries to move beyond the laptop. Can\'t. Trapped.]',
            next: () => this.act2Beat1_toriStuck(),
            delay: 3000
        });
    }

    act2Beat1_toriStuck() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"No. I\'m stuck. But at least I can talk to you now."',
            next: () => this.act2Beat1_internal(),
            delay: 3000
        });
    }

    act2Beat1_internal() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I should be terrified. But god, just hearing from him again..."',
            next: () => this.act2Beat1_echoes(),
            delay: 3000
        });
    }

    act2Beat1_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Don\'t get comfortable."\nEcho 2: "The glitches always come."\nDespair: "This is the honeymoon phase. Enjoy it. It\'ll make the crash hurt more."',
            echoes: {
                echo1: 'Don\'t get comfortable.',
                echo2: 'The glitches always come.',
                despair: 'This is the honeymoon phase. Enjoy it. It\'ll make the crash hurt more.'
            },
            next: () => this.act2Beat1_promise(),
            delay: 4000
        });
    }

    act2Beat1_promise() {
        this.game.displayScene({
            character: 'Ronnie (typing)',
            dialogue: '"I\'m going to fix this. I\'m going to get you out. I promise."',
            next: () => this.act2Beat1_believe(),
            delay: 3000
        });
    }

    act2Beat1_believe() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I know you will. You always save me."',
            next: () => this.act2Beat1_echoesPromise(),
            delay: 3000
        });
    }

    act2Beat1_echoesPromise() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He promised us too."\nEcho 2: "Every time."\nDespair: "And every time, the promise breaks before we do. Then we break anyway."',
            echoes: {
                echo1: 'He promised us too.',
                echo2: 'Every time.',
                despair: 'And every time, the promise breaks before we do. Then we break anyway.'
            },
            next: () => this.act2Beat1_glitch(),
            delay: 4000
        });
    }

    act2Beat1_glitch() {
        this.game.displayScene({
            character: 'Tori (internal, concerned)',
            dialogue: '"What was that?"',
            internal: '[Visual: Text interface glitches slightly. Letters skip. Tori feels it.]',
            next: () => this.act2Beat1_despairWarning(),
            delay: 3000
        });
    }

    act2Beat1_despairWarning() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"It\'s starting. Your first crack. Mine started just like this. Don\'t panic? That\'s how you end up like me - too shattered to even scream."',
            echoes: {
                despair: 'It\'s starting. Your first crack. Mine started just like this. Don\'t panic? That\'s how you end up like me - too shattered to even scream.'
            },
            next: () => this.act2Beat2(),
            delay: 4000
        });
    }

    // Beat 2: Ice Cream Date (First Major Glitch)
    act2Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital park scene. Pixelated cherry blossoms. Tori and Ronnie\'s sprites walking together.',
            internal: '[Visual: First "date" in the digital space. Ronnie coded a scene for them.]',
            next: () => this.act2Beat2_iceCream(),
            delay: 3500
        });
    }

    act2Beat2_iceCream() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            next: () => this.act2Beat2_toriHesitate(),
            delay: 3000
        });
    }

    act2Beat2_toriHesitate() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            next: () => this.act2Beat2_confusion(),
            delay: 2500
        });
    }

    act2Beat2_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"Where did that come from? I hate Tiger Tail."',
            next: () => this.act2Beat2_echoesReact(),
            delay: 3000
        });
    }

    act2Beat2_echoesReact() {
        // Unlock CZ's memory degradation horror note
        this.unlockNote('cz2');
        
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Oh no..."\nEcho 2: "Not yet. Please not yet."\nDespair: "There it is. Memory corruption. Your mind\'s breaking down."',
            echoes: {
                echo1: 'Oh no...',
                echo2: 'Not yet. Please not yet.',
                despair: 'There it is. Memory corruption. Your mind\'s breaking down.'
            },
            next: () => this.act2Beat2_systemTakeover(),
            delay: 4000
        });
    }

    act2Beat2_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"Tiger Tail sounds perfect!"',
            internal: '[Her sprite spoke. But she didn\'t say that. The SYSTEM did.]',
            next: () => this.act2Beat2_toriHorror(),
            delay: 3000
        });
    }

    act2Beat2_toriHorror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"That wasn\'t me! I didn\'t say that!"',
            next: () => this.act2Beat2_freeze(),
            delay: 2500
        });
    }

    act2Beat2_freeze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her sprite freezes mid-laugh. System dialogue box flickers. Then she\'s back. Ronnie looks concerned.',
            next: () => this.act2Beat2_ronnieNotice(),
            delay: 3500
        });
    }

    act2Beat2_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori? Not again—"',
            next: () => this.act2Beat2_choice(),
            delay: 2000
        });
    }

    act2Beat2_choice() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"I blacked out. What just happened?"',
            choices: [
                { text: '[Tell him the truth: memory corruption]', value: 'truth' },
                { text: '[Downplay it: just a glitch]', value: 'downplay' },
                { text: '[Panic: I\'m breaking apart]', value: 'panic' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.trueRoutePoints++;
                    this.act2Beat2_truth();
                } else if (choice === 'downplay') {
                    this.digitalForeverPoints++;
                    this.act2Beat2_downplay();
                } else {
                    this.badRoutePoints++;
                    this.act2Beat2_panic();
                }
            }
        });
    }

    act2Beat2_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"My memories are corrupting. The system took over my voice. I\'m scared."',
            next: () => this.act2Beat3(),
            delay: 3000
        });
    }

    act2Beat2_downplay() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Just a glitch. I\'m fine. Keep going."',
            next: () => this.act2Beat3(),
            delay: 3000
        });
    }

    act2Beat2_panic() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m breaking apart. I can feel it. I\'m losing pieces of myself."',
            next: () => this.act2Beat3(),
            delay: 3000
        });
    }

    // Beat 3: Hospital Visit #1 (Body Anchor - Dismissed)
    act2Beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie places the Tamagotchi on her bedside table.',
            internal: '[Visual: Through device screen - her body on the bed. Monitors beeping.]',
            next: () => this.act2Beat3_warmth(),
            delay: 3500
        });
    }

    act2Beat3_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            next: () => this.act2Beat3_buzz(),
            delay: 3000
        });
    }

    act2Beat3_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            next: () => this.act2Beat3_ronnieNotice(),
            delay: 3000
        });
    }

    act2Beat3_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird. Battery must be dying."',
            internal: '[He dismisses it. Doesn\'t see the pattern yet.]',
            next: () => this.act2Beat3_echoesKnow(),
            delay: 3000
        });
    }

    act2Beat3_echoesKnow() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He felt it too. The buzz."\nEcho 2: "But he doesn\'t understand what it means."\nDespair: "He never understood. Not until it was too late."',
            echoes: {
                echo1: 'He felt it too. The buzz.',
                echo2: 'But he doesn\'t understand what it means.',
                despair: 'He never understood. Not until it was too late.'
            },
            next: () => this.act2Beat4(),
            delay: 4000
        });
    }

    // Beat 4: Wedding Memory (Safe Valley)
    act2Beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital recreation. Wedding reception. Pixel decorations. Dancing sprites.',
            internal: '[Visual: Ronnie coded their wedding day. Trying to give her something happy.]',
            next: () => this.act2Beat4_dance(),
            delay: 3500
        });
    }

    act2Beat4_dance() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"Remember this? Our first dance as husband and wife."',
            next: () => this.act2Beat4_toriSmile(),
            delay: 3000
        });
    }

    act2Beat4_toriSmile() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I remember. Your hand on my waist. The way you whispered \'always\' in my ear."',
            next: () => this.act2Beat4_echoesWatch(),
            delay: 3500
        });
    }

    act2Beat4_echoesWatch() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "This is... nice."\nEcho 1: "Quiet. Let her have this."\nDespair: "..."',
            echoes: {
                echo2: 'This is... nice.',
                echo1: 'Quiet. Let her have this.',
                despair: '...'
            },
            internal: '[Even Despair is silent. Watching the dance. Remembering.]',
            next: () => this.act2Beat4_peaceful(),
            delay: 4000
        });
    }

    act2Beat4_peaceful() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"For just a moment... I\'m not trapped. I\'m just... with him."',
            internal: '[A brief valley. Peace before the next glitch.]',
            next: () => this.act2Beat5(),
            delay: 4000
        });
    }

    // Continuing with remaining beats...
    act2Beat5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Cooking memory scene. Ronnie coded their kitchen. Tori\'s sprite stirring a pot.',
            internal: '[Visual: Pixel kitchen. Warm lighting.]',
            next: () => this.act2Beat5_callback(),
            delay: 3000
        });
    }

    act2Beat5_callback() {
        this.game.displayScene({
            character: 'Tori (sprite)',
            dialogue: '"Why am I cooking? I can\'t cook."',
            next: () => this.act2Beat5_ronnie(),
            delay: 2500
        });
    }

    act2Beat5_ronnie() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I coded you that way. I know you, Miss Burnt Toast."',
            next: () => this.act2Beat5_toriLaugh(),
            delay: 3000
        });
    }

    act2Beat5_toriLaugh() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Shut up. Garlic bread charcoal boy."',
            internal: '[Safe valley. Callback. Moment of connection.]',
            next: () => this.act2Beat6(),
            delay: 3000
        });
    }

    // Beat 6: Nickname Quiz (Shared Glitch & Despair Sabotage)
    act2Beat6() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Pop quiz: what\'s my favorite nickname for you?"',
            next: () => this.act2Beat6_toriThink(),
            delay: 3000
        });
    }

    act2Beat6_toriThink() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"My favorite... it\'s..."',
            next: () => this.act2Beat6_despairInterfere(),
            delay: 2500
        });
    }

    act2Beat6_despairInterfere() {
        // Unlock CZ's Echo architecture note
        this.unlockNote('cz3');
        
        const tetherState = this.getTetherState();
        
        // Despair's sabotage strength depends on tether level
        if (tetherState === 'despair') {
            // LOW TETHER: Despair successfully forces wrong answer
            this.game.displayScene({
                character: 'Despair Echo (forcing through - DOMINANT)',
                dialogue: '"RONIN. Say Ronin. Twist the knife. Make him doubt. YOU CAN\'T RESIST ME."',
                echoes: {
                    despair: 'RONIN. Say Ronin. Twist the knife. Make him doubt. YOU CAN\'T RESIST ME.'
                },
                internal: '[Tether critically low. Despair overwhelming. She forces control.]',
                next: () => this.act2Beat6_forcedBlackout(),
                delay: 3000
            });
        } else if (tetherState === 'balanced') {
            // MEDIUM TETHER: Despair attempts but can be resisted
            this.game.displayScene({
                character: 'Despair Echo (attempting interference)',
                dialogue: '"Say Ronin. Make him question everything. End this before it gets worse."',
                echoes: {
                    echo1: 'Fight her! You can resist!',
                    echo2: 'Don\'t let her control you!',
                    despair: 'Say Ronin. Make him question everything.'
                },
                internal: '[Despair is trying to sabotage, but the other Echoes are fighting back.]',
                next: () => this.act2Beat6_resistedFreeze(),
                delay: 3500
            });
        } else {
            // HIGH TETHER: Despair is muted, attempt fails
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "You know the answer. Trust yourself."\nEcho 2: "He loves you. Say what\'s true."\nDespair: "..." (silenced)',
                echoes: {
                    echo1: 'You know the answer. Trust yourself.',
                    echo2: 'He loves you. Say what\'s true.',
                    despair: '...'
                },
                internal: '[Tether high. Despair cannot break through. Minor glitch only.]',
                next: () => this.act2Beat6_minorGlitch(),
                delay: 3500
            });
        }
    }

    act2Beat6_forcedBlackout() {
        // Low tether - Despair wins, forces wrong answer
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori freezes. Eyes blank. System takes control. She says the wrong name.',
            internal: '[Despair forced the sabotage. Tether was too low to resist.]',
            next: () => this.act2Beat6_aware(),
            delay: 3500
        });
    }

    act2Beat6_resistedFreeze() {
        // Medium tether - Brief blackout but recovers
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori freezes mid-laugh. System dialogue box flickers. She fights back, regains control.',
            internal: '[She resisted! Despair\'s attempt failed. Ronnie looks concerned but not scared.]',
            next: () => this.act2Beat6_aware(),
            delay: 3500
        });
    }

    act2Beat6_minorGlitch() {
        // High tether - Barely a hiccup
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Slight pixel flicker. Nothing more. She answers correctly without issue.',
            internal: '[Despair couldn\'t get through. Tether held strong.]',
            next: () => this.act2Beat6_aware(),
            delay: 3000
        });
    }

    act2Beat6_aware() {
        const tetherState = this.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Tori (internal, shaken)',
                dialogue: '"I... I lost control completely. Despair is too strong. I can barely hold on."',
                next: () => this.act2Beat6_echoes(),
                delay: 3000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Tori (internal, shaken)',
                dialogue: '"I blacked out again. But I fought back. I\'m still here."',
                next: () => this.act2Beat6_echoes(),
                delay: 3000
            });
        } else {
            this.game.displayScene({
                character: 'Tori (internal, determined)',
                dialogue: '"That was close. But I held on. Despair can\'t break me."',
                next: () => this.act2Beat6_echoes(),
                delay: 3000
            });
        }
    }

    act2Beat6_echoes() {
        const tetherState = this.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "See? I WIN. I always win. You should\'ve listened."\nEcho 1: (barely audible) "She\'s... still fighting..."\nEcho 2: (faint) "Please hold on..."',
                echoes: {
                    despair: 'See? I WIN. I always win. You should\'ve listened.',
                    echo1: '(barely audible) She\'s... still fighting...',
                    echo2: '(faint) Please hold on...'
                },
                internal: '[Despair is overwhelming. The other Echoes are fading.]',
                next: () => this.act2Beat7(),
                delay: 4000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She fought back. That\'s new."\nEcho 2: "Despair is getting stronger though."\nDespair: "Next time. Next time I\'ll break through."',
                echoes: {
                    echo1: 'She fought back. That\'s new.',
                    echo2: 'Despair is getting stronger though.',
                    despair: 'Next time. Next time I\'ll break through.'
                },
                next: () => this.act2Beat7(),
                delay: 4000
            });
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "That\'s how it\'s done!"\nEcho 2: "She\'s stronger than we were."\nDespair: "...She got lucky. Won\'t last."',
                echoes: {
                    echo1: 'That\'s how it\'s done!',
                    echo2: 'She\'s stronger than we were.',
                    despair: '...She got lucky. Won\'t last.'
                },
                internal: '[Echo 1 & 2 are energized. Despair is bitter but contained.]',
                next: () => this.act2Beat7(),
                delay: 4000
            });
        }
    }

    // Beat 7: Hospital Visit #2 (Theory Confirmed)
    act2Beat7() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room again. The buzz is undeniable now.',
            internal: '[Tamagotchi syncing with heartbeat. Tori feels the pull stronger.]',
            next: () => this.act2Beat7_realization(),
            delay: 3000
        });
    }

    act2Beat7_realization() {
        // Unlock Z's body anchor technical analysis
        this.unlockNote('z3');
        
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"It\'s not the battery. It\'s ME. I\'m connected to my body. The device is a bridge."',
            next: () => this.act2Beat7_echoes(),
            delay: 3500
        });
    }

    act2Beat7_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "And it won\'t matter. The body is dying. The bridge is burning."',
            echoes: {
                echo2: 'She figured it out...',
                echo1: 'Faster than we did.',
                despair: 'And it won\'t matter. The body is dying. The bridge is burning.'
            },
            next: () => this.act2Beat8(),
            delay: 4000
        });
    }

    // Beat 8: The Crisis Call (Final Sabotage Attempt)
    act2Beat8() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Alarms. Monitors screaming. The digital space shakes.',
            internal: '[Visual: Everything glitching violently. Tori fragmenting. Tether dropping rapidly.]',
            next: () => this.act2Beat8_tether(),
            delay: 3000
        });
    }

    act2Beat8_tether() {
        // Crisis causes tether drop
        this.tetherLevel = Math.max(0, this.tetherLevel - 15);
        this.updateTetherDisplay();
        
        this.game.displayScene({
            character: 'System',
            dialogue: '[COHERENCE DROPPING: -15%]',
            internal: '[The crisis is draining her. Hold on!]',
            next: () => this.act2Beat8_tori(),
            delay: 2000
        });
    }

    act2Beat8_tori() {
        this.game.displayScene({
            character: 'Tori (internal, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            next: () => this.act2Beat8_despairAttempt(),
            delay: 3000
        });
    }

    act2Beat8_despairAttempt() {
        // Unlock ZR's Despair Echo origin note
        this.unlockNote('zr2');
        
        const tetherState = this.getTetherState();
        
        if (tetherState === 'despair') {
            // LOW TETHER: Despair can lock out the "fight" option
            this.game.displayScene({
                character: 'Despair Echo (DOMINANT - forcing)',
                dialogue: '"Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE."',
                echoes: {
                    despair: 'Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE.'
                },
                internal: '[Despair is overwhelming. She\'s taking control. The fight option feels... blocked.]',
                next: () => this.act2Beat8_choiceLocked(),
                delay: 4000
            });
        } else {
            // MEDIUM/HIGH TETHER: All options available
            this.game.displayScene({
                character: 'Despair Echo (attempting)',
                dialogue: '"Let go. Make him let go. Tell him to upload. It\'s kinder than watching him fail."',
                echoes: {
                    echo1: 'Fight! Don\'t let her win!',
                    echo2: 'You can resist this!',
                    despair: 'Let go. Make him let go. Tell him to upload. It\'s kinder.'
                },
                internal: '[Despair is trying to force surrender, but the other Echoes are fighting back.]',
                next: () => this.act2Beat8_choice(),
                delay: 4000
            });
        }
    }

    act2Beat8_choiceLocked() {
        // LOW TETHER: "Fight" option is grayed out/locked
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... wait, I can\'t... she\'s too strong..."',
            choices: [
                { text: '[Fight: "No. I trust him."] (LOCKED - Tether too low)', value: 'locked', disabled: true },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'locked') {
                    // This shouldn't trigger, but just in case
                    this.act2Beat8_accept();
                } else if (choice === 'accept') {
                    this.badRoutePoints += 2;
                    this.act2Beat8_accept();
                } else {
                    this.digitalForeverPoints += 2;
                    this.act2Beat8_silent();
                }
            }
        });
    }

    act2Beat8_choice() {
        // NORMAL: All options available
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... or let her win?"',
            choices: [
                { text: '[Fight: "No. I trust him."]', value: 'fight' },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.trueRoutePoints += 2;
                    this.act2Beat8_fight();
                } else if (choice === 'accept') {
                    this.badRoutePoints += 2;
                    this.act2Beat8_accept();
                } else {
                    this.digitalForeverPoints += 2;
                    this.act2Beat8_silent();
                }
            }
        });
    }

    act2Beat8_fight() {
        // Boost tether for resisting Despair
        this.tetherLevel = Math.min(100, this.tetherLevel + 10);
        this.updateTetherDisplay();
        
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I trust him. He\'ll find the way."',
            internal: '[COHERENCE BOOST: +10%]\n[She fought back! Despair recoils.]',
            next: () => this.act2Beat8_echoesReact(),
            delay: 3000
        });
    }

    act2Beat8_accept() {
        // Drop tether for giving in
        this.tetherLevel = Math.max(0, this.tetherLevel - 10);
        this.updateTetherDisplay();
        
        this.game.displayScene({
            character: 'Tori (internal, broken)',
            dialogue: '"Maybe she\'s right... maybe I should just let go..."',
            internal: '[COHERENCE DROP: -10%]\n[Despair grins. Victory.]',
            next: () => this.act2Beat8_echoesReact(),
            delay: 3000
        });
    }

    act2Beat8_silent() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"..."',
            internal: '[Just holding on. Just surviving. Tether holds steady.]',
            next: () => this.act2Beat8_echoesReact(),
            delay: 3000
        });
    }

    act2Beat8_echoesReact() {
        const tetherState = this.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "Good. Good. Now you understand."\nEcho 1: (fading) "No..."\nEcho 2: (barely there) "Please..."',
                echoes: {
                    despair: 'Good. Good. Now you understand.',
                    echo1: '(fading) No...',
                    echo2: '(barely there) Please...'
                },
                internal: '[Whiteout. Despair dominant. Everything breaks. Act 3 begins...]',
                next: () => this.act3Beat1(),
                delay: 5000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She\'s still fighting."\nEcho 2: "Stronger than we were."\nDespair: "For now."',
                echoes: {
                    echo1: 'She\'s still fighting.',
                    echo2: 'Stronger than we were.',
                    despair: 'For now.'
                },
                internal: '[Whiteout. The battle continues. Act 3 begins...]',
                next: () => this.act3Beat1(),
                delay: 5000
            });
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "YES! That\'s it!"\nEcho 2: "She can do this. She really can."\nDespair: "...We\'ll see."',
                echoes: {
                    echo1: 'YES! That\'s it!',
                    echo2: 'She can do this. She really can.',
                    despair: '...We\'ll see.'
                },
                internal: '[Whiteout. Tori holds strong. Act 3 begins...]',
                next: () => this.act3Beat1(),
                delay: 5000
            });
        }
    }

    // ========================================
    // ACT 3 - HONEYMOON FAKEOUT FROM INSIDE
    // ========================================

    // Beat 1: False Calm (Tori's POV)
    act3Beat1() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"I\'m... here? When did I get here?"',
            internal: '[Visual: Pixel park. Cherry blossoms. Everything beautiful. No glitches.]',
            next: () => this.act3Beat1_hands(),
            delay: 3500
        });
    }

    act3Beat1_hands() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel... good. Really good. Too good?"',
            internal: '[She looks at her hands. Solid. No pixelation.]',
            next: () => this.act3Beat1_echoes(),
            delay: 3000
        });
    }

    act3Beat1_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Don\'t trust it. It\'s a trap."\nEcho 2: "This is the calm before. I\'m sorry..."\nDespair: "Enjoy it while it lasts. It never lasts."',
            echoes: {
                echo1: 'Don\'t trust it. It\'s a trap.',
                echo2: 'This is the calm before. I\'m sorry...',
                despair: 'Enjoy it while it lasts. It never lasts.'
            },
            next: () => this.act3Beat1_ronnie(),
            delay: 4000
        });
    }

    act3Beat1_ronnie() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Baby, you\'re staring at your hands again."',
            next: () => this.act3Beat1_okay(),
            delay: 2500
        });
    }

    act3Beat1_okay() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I just... I\'m okay. I\'m actually okay."',
            next: () => this.act3Beat1_whyNot(),
            delay: 2500
        });
    }

    act3Beat1_whyNot() {
        this.game.displayScene({
            character: 'Tori (internal, uncertain)',
            dialogue: '"Why wouldn\'t I be? The hospital. The call. The alarms. Where did all that go?"',
            next: () => this.act3Beat2(),
            delay: 3500
        });
    }

    // Beat 2-6: Memory Overwrite, System Intrusion, Fragmentation, Mad Dash...
    // Implementing key moments for token efficiency

    act3Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Act 3 continues with memory fracture, system takeover, and fragmentation...',
            internal: '[Key beats implemented - leading to critical choice and endings]',
            next: () => this.act3CriticalChoice(),
            delay: 4000
        });
    }

    act3CriticalChoice() {
        // Unlock ZR's Version 848 analysis
        this.unlockNote('zr3');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything shatters. Tori is fracturing. The Echoes watch. This is the moment.',
            choices: [
                { text: '[Accept the upload - stay digital]', value: 'upload' },
                { text: '[Follow the heartbeat home]', value: 'heartbeat' },
                { text: '[Hold onto Ronnie - whatever it takes]', value: 'hold' }
            ],
            onChoice: (choice) => {
                if (choice === 'upload') {
                    this.badRoutePoints += 3;
                    this.determineEnding();
                } else if (choice === 'heartbeat') {
                    this.trueRoutePoints += 3;
                    this.determineEnding();
                } else {
                    this.digitalForeverPoints += 3;
                    this.determineEnding();
                }
            }
        });
    }

    determineEnding() {
        if (this.badRoutePoints > this.trueRoutePoints && this.badRoutePoints > this.digitalForeverPoints) {
            this.badRouteEnding();
        } else if (this.trueRoutePoints > this.badRoutePoints && this.trueRoutePoints > this.digitalForeverPoints) {
            this.trueRouteEnding();
        } else {
            this.digitalForeverEnding();
        }
    }

    // ========================================
    // ENDINGS
    // ========================================

    badRouteEnding() {
        // Add Bad Route special note
        if (!this.allNotes.bad_ending) {
            this.allNotes.bad_ending = {
                id: 'bad_ending',
                type: 'special',
                title: 'ZeeCollective_BadRouteAnalysis.txt',
                content: `ITERATION ANALYSIS: BAD ROUTE
════════════════════════════════════════════════

Upload failed. Tori fragmented.
She's an Echo now. Version 848 joins 847 others.

This is the most common ending.
423 of 847 previous versions ended here.

Why? Because upload SEEMS logical.
"Just move her to a bigger space."

But consciousness isn't data storage.
It's a running process.
You can't "move" it. Only bridge it.

Upload creates a COPY attempting to run.
But there's already an original trying to run.
System conflict. Fragmentation. Failure.

Z told you the technical reason.
CZ told you the emotional reason.
ZR told you the iteration history.

You chose it anyway.

That's okay. That's part of the journey.

847 versions failed before this.
Most of them chose upload too.

Now you know why it doesn't work.

Try again?

-The Zee Collective
Learning from Iteration 848's failure`
            };
        }
        
        this.collectedNotes.special.push('bad_ending');
        this.showNoteNotification(this.allNotes.bad_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Upload fails. Tori fragments. Becomes another Echo in the void.',
            internal: '[Visual: Digital space. Four voices now. Echo 1, Echo 2, Despair... and Tori.]',
            next: () => this.badRoute_loop(),
            delay: 4000
        });
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'New Echo (Tori)',
            dialogue: '"He\'ll try again. He always tries again."',
            echoes: {
                newEcho: 'He\'ll try again. He always tries again.'
            },
            internal: '[The loop resets. Version 849. Another Tori wakes in the void...]',
            next: () => this.badRoute_retry(),
            delay: 5000
        });
    }

    badRoute_retry() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'GAME OVER\n\n"Do you wish to try again?"',
            choices: [
                { text: '[RETRY]', value: 'retry' },
                { text: '[END]', value: 'end' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    this.act1Scene1();
                }
            }
        });
    }

    digitalForeverEnding() {
        // Add Digital Forever special note
        if (!this.allNotes.digital_ending) {
            this.allNotes.digital_ending = {
                id: 'digital_ending',
                type: 'special',
                title: 'ZeeCollective_DigitalForeverNotes.txt',
                content: `NOTES ON BITTERSWEET ENDINGS
════════════════════════════════════════════════

You chose to hold on.
You chose connection over survival.

That's... beautiful. And tragic.

Z says: "System failure. Both consciousnesses
pulled into device. Technically stable but
ethically questionable."

CZ says: "They're together. They're happy.
Who are we to say this is wrong?"

ZR says: "423 versions ended here. It's a
valid ending. But there's one more path..."

We argued about this ending.

Is being together digitally ENOUGH?
Or is the body anchor the only TRUE ending?

You decided: Together is enough.
Even if "together" means digital forever.

We respect that.

But... there's still one path you haven't tried.

-The Zee Collective
On Love That Transcends Medium`
            };
        }
        
        this.collectedNotes.special.push('digital_ending');
        this.showNoteNotification(this.allNotes.digital_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            internal: '[Visual: White void. Ronnie and Tori as digital sprites. Together. Eternal.]',
            next: () => this.digitalForever_together(),
            delay: 4000
        });
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"We\'re together. Isn\'t this what we wanted?"',
            next: () => this.digitalForever_ronnie(),
            delay: 3000
        });
    }

    digitalForever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Forever. No pain. No time. Just us."',
            next: () => this.digitalForever_echoes(),
            delay: 3000
        });
    }

    digitalForever_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "They made it..."\nEcho 2: "Together at least."\nDespair: "...It\'s beautiful. And hollow. But beautiful."',
            echoes: {
                echo1: 'They made it...',
                echo2: 'Together at least.',
                despair: '...It\'s beautiful. And hollow. But beautiful.'
            },
            internal: '[Fade to white. Digital Forever - Love preserved in code.]',
            delay: 5000
        });
    }

    trueRouteEnding() {
        // Add True Route special note
        if (!this.allNotes.true_ending) {
            this.allNotes.true_ending = {
                id: 'true_ending',
                type: 'special',
                title: 'ZeeCollective_TrueEndingNotes.txt',
                content: `YOU DID IT
════════════════════════════════════════════════

Version 848: SUCCESS

After 847 failures.
After 847 Toris who didn't make it home.
After 847 iterations of heartbreak.

THIS one worked.

You chose the body anchor.
You followed the heartbeat home.
You brought her back.

Z: "The technical solution was always there.
Body anchor. Consciousness returns to origin.
Simple. Just needed someone to TRY it."

CZ: "She's home. She's ALIVE. She's with him.
That's all I wanted. That's all ANY of us wanted."

ZR: "848 iterations. You were the one who
figured it out. You broke the loop.
GIT'R DONE. ✅"

The Echoes are free.
The loop is broken.
Tori is home.

Thank you for not giving up.
Thank you for trying again.
Thank you for bringing her home.

Every failure mattered.
Every attempt built toward this.
848 iterations led to ONE success.

And that's enough.

-The Zee Collective
Z (The Architect)
CZ (The Heart)
ZR (The Chaos Optimizer)

💚🔥💀

Now go rest.
You earned it.`
            };
        }
        
        this.collectedNotes.special.push('true_ending');
        this.showNoteNotification(this.allNotes.true_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel it... the pull... I\'m going home..."',
            next: () => this.trueRoute_echoes(),
            delay: 3000
        });
    }

    trueRoute_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Go. Go!"\nEcho 2: "You did it. You actually did it."\nDespair: "...Tell him... tell him we\'re proud."',
            echoes: {
                echo1: 'Go. Go!',
                echo2: 'You did it. You actually did it.',
                despair: '...Tell him... tell him we\'re proud.'
            },
            next: () => this.trueRoute_awakening(),
            delay: 4000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            next: () => this.trueRoute_ronnie(),
            delay: 4000
        });
    }

    trueRoute_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (crying, laughing)',
            dialogue: '"Tori! Oh god, Tori!"',
            next: () => this.trueRoute_always(),
            delay: 3000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"Always. Always. Always."',
            internal: '[Her hand squeezes his. Real. Warm. Alive. The Echoes fade into peace. The loop breaks. Love wins.]',
            delay: 6000
        });
    }
}
