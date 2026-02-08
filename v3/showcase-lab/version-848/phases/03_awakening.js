/**
 * PHASE 03: THE AWAKENING (TORI'S ROUTE)
 * Status: Faithful Recreation of V1 Awakening
 * Flow: Void -> Echoes -> Despair's Cage
 */
window.phases["03_awakening"] = {
    start: function () {
        // Set Phase State
        window.vn.currentPhase = "AWAKENING";

        // 1. Initial Void Render
        const stage = document.getElementById('stage');
        stage.innerHTML = '';

        // Background: Digital Void
        const bg = document.createElement('img');
        bg.src = window.vn.assets.backgrounds.void;
        bg.style.position = 'absolute';
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.opacity = '0.8';
        stage.appendChild(bg);

        // Tori (No Body yet, just internal voice, but we show sprite for visualization)
        // In V1 she is a sprite.
        const tori = document.createElement('img');
        tori.src = window.vn.assets.sprites.tori;
        tori.style.position = 'absolute';
        tori.style.bottom = '0';
        tori.style.left = '10%';
        tori.style.height = '80%';
        tori.style.opacity = '0.5'; // Ghostly
        stage.appendChild(tori);

        // Start Scene
        this.scene1_Confusion(tori);
    },

    scene1_Confusion: function (tori) {
        this.renderDialogue({
            name: "Tori (Internal)",
            text: "Wait... where am I? What happened? I was just walking...",
            next: () => this.scene2_Echoes()
        });
    },

    scene2_Echoes: function () {
        const stage = document.getElementById('stage');

        // Reveal Echoes
        const echoes = document.createElement('img');
        echoes.src = window.vn.assets.sprites.echoes;
        echoes.style.position = 'absolute';
        echoes.style.bottom = '0';
        echoes.style.right = '10%';
        echoes.style.height = '80%';
        echoes.style.opacity = '0'; // Fade in
        echoes.style.transition = 'opacity 2s';
        stage.appendChild(echoes);

        setTimeout(() => { echoes.style.opacity = '1'; }, 100);

        this.renderDialogue({
            name: "???",
            text: "Another one... it's starting again...",
            next: () => this.scene3_Revelation()
        });
    },

    scene3_Revelation: function () {
        this.renderDialogue({
            name: "Echo 1",
            text: "You're in the device. The Tamagotchi. With us.",
            next: () => this.scene4_Despair()
        });
    },

    scene4_Despair: function () {
        this.renderDialogue({
            name: "Despair",
            text: "Welcome to your new cage. You're trapped. Just like we were. Just like you always will be.",
            next: () => {
                // End of Vertical Slice for this phase
                alert("END OF VERTICAL SLICE (V3 LAB).");
                // In full version, this would go to Phase 04_Horror
            }
        });
    },

    // Helper: Render Dialogue Box (Shared or localized? Using shared helper in main.js ideally, 
    // but sticking to local for strict file separation rule if needed. 
    // I'll reuse the one from Prologue by making main.js expose a helper? 
    // No, instructions said "No shared utils", but main.js IS the brain.
    // I will duplicate for "Spaghetti" adherence :P )
    renderDialogue: function (data) {
        let box = document.getElementById('dialogue-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'dialogue-box';
            box.className = 'dialogue-box';
            document.getElementById('stage').appendChild(box);
        }

        box.innerHTML = `<strong>${data.name}:</strong><br>${data.text}`;
        box.onclick = () => {
            data.next();
        };
    }
};
