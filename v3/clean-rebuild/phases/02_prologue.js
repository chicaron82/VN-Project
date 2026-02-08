/**
 * PHASE 02: THE SHARED PROLOGUE
 * Status: Faithful Recreation of V1 Prologue
 * Flow: Street Bump -> Home Banter -> The Fall
 */
window.phases["02_prologue"] = {
    start: function () {
        // Set Prologue State
        window.vn.currentPhase = "PROLOGUE";
        window.vn.flags.seenGhost = false;

        // Start at Scene 1: The Street
        this.scene1_StreetBump();
    },

    // ============================================
    // SCENE 1: THE STREET BUMP
    // ============================================
    scene1_StreetBump: function () {
        const stage = document.getElementById('stage');

        // Background: Street
        const bg = document.createElement('img');
        bg.src = window.vn.assets.backgrounds.street;
        bg.style.position = 'absolute';
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.zIndex = '0';
        stage.appendChild(bg);

        // Tori Sprite
        const tori = document.createElement('img');
        tori.src = window.vn.assets.sprites.tori;
        tori.style.position = 'absolute';
        tori.style.bottom = '0';
        tori.style.right = '10%';
        tori.style.height = '80%';
        tori.style.zIndex = '1';
        stage.appendChild(tori);

        // Dialogue Box
        this.renderDialogue({
            name: "Tori",
            text: "I wasn't looking where I was going...",
            next: () => this.scene1_Collision()
        });
    },

    scene1_Collision: function () {
        // Update Dialogue
        this.renderDialogue({
            name: "Tori",
            text: "Oh my gosh, I'm so sorry... I wasn't paying attention!",
            next: () => this.scene1_OldMan(document.getElementById('stage'))
        });
    },

    scene1_OldMan: function (stage) {
        // Add Old Ronnie Sprite
        const oldMan = document.createElement('img');
        oldMan.src = window.vn.assets.sprites.oldRonnie;
        oldMan.style.position = 'absolute';
        oldMan.style.bottom = '0';
        oldMan.style.left = '10%'; // Appears on left
        oldMan.style.height = '80%';
        oldMan.style.zIndex = '2';
        stage.appendChild(oldMan);

        this.renderDialogue({
            name: "Old Man",
            text: "No problem. Hang on to that. It may save your life someday.",
            next: () => {
                // He leaves
                oldMan.style.transition = 'opacity 1s';
                oldMan.style.opacity = '0';
                setTimeout(() => this.scene2_Home(), 1000);
            }
        });
    },

    // ============================================
    // SCENE 2: HOME SWEET HOME
    // ============================================
    scene2_Home: function () {
        const stage = document.getElementById('stage');
        stage.innerHTML = ''; // Clear Stage

        // Background: Apartment
        const bg = document.createElement('img');
        bg.src = window.vn.assets.backgrounds.apartment;
        bg.style.position = 'absolute';
        bg.style.width = '100%';
        bg.style.height = '100%';
        stage.appendChild(bg);

        // Ronnie Sprite
        const ronnie = document.createElement('img');
        ronnie.src = window.vn.assets.sprites.ronnie;
        ronnie.style.position = 'absolute';
        ronnie.style.bottom = '0';
        ronnie.style.left = '10%';
        ronnie.style.height = '80%';
        stage.appendChild(ronnie);

        // Tori Sprite
        const tori = document.createElement('img');
        tori.src = window.vn.assets.sprites.tori;
        tori.style.position = 'absolute';
        tori.style.bottom = '0';
        tori.style.right = '10%';
        tori.style.height = '80%';
        stage.appendChild(tori);

        this.renderDialogue({
            name: "Tori",
            text: "Hey babe, I'm home! Can you check my Tamagotchi? It's acting weird.",
            next: () => this.scene2_Chicharon()
        });
    },

    scene2_Chicharon: function () {
        this.renderDialogue({
            name: "Ronnie",
            text: "Sure thing, Chicharon. Give it here.",
            next: () => this.scene3_TheFall()
        });
    },

    // ============================================
    // SCENE 3: THE ACCIDENT
    // ============================================
    scene3_TheFall: function () {
        // Dramatic Pause
        const stage = document.getElementById('stage');

        this.renderDialogue({
            name: "Ronnie",
            text: "Babe, watch out for the—!",
            next: () => {
                // THE CRASH
                // 1. Audio: Loud thud (simulated text shake for now)
                stage.style.animation = 'ghost 0.2s infinite'; // Violent shake

                // 2. Visual: Fade to black rapidly
                setTimeout(() => {
                    stage.style.backgroundColor = 'black';
                    stage.innerHTML = ''; // Kill everything

                    // 3. Transition to Awakening (Tori's Route)
                    setTimeout(() => {
                        window.vn.loadPhase("03_awakening");
                    }, 2000);
                }, 500);
            }
        });
    },

    // Helper: Render Dialogue Box
    renderDialogue: function (data) {
        let box = document.getElementById('dialogue-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'dialogue-box';
            box.className = 'dialogue-box';
            document.getElementById('stage').appendChild(box);
        }

        box.innerHTML = `<strong>${data.name}:</strong><br>${data.text}`;

        // Click to continue
        box.onclick = () => {
            // Play click sound
            data.next();
        };
    }
};
