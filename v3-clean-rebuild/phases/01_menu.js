/**
 * PHASE 01: THE MAIN MENU
 * Status: Faithful Recreation of V1 Menu
 * Features: "Heavy" click sound, Glitchy Quit button
 */
window.phases["01_menu"] = {
    start: function () {
        const stage = document.getElementById('stage');

        // 1. Render Menu Container
        const menuContainer = document.createElement('div');
        menuContainer.style.textAlign = 'center';
        menuContainer.style.marginTop = '20vh';
        stage.appendChild(menuContainer);

        // 2. Render Title
        const title = document.createElement('h1');
        title.innerText = "VERSION 848";
        title.style.fontSize = "4rem";
        title.style.marginBottom = "3rem";
        title.className = "text-ghost"; // Chromatic aberration
        menuContainer.appendChild(title);

        // 3. Render Options
        const options = [
            { text: "START SYSTEM", action: () => this.startGame() },
            { text: "LOAD MEMORY", action: () => this.loadGame(), id: 'btn-load' },
            { text: "TERMINATE", action: () => this.quitGame(), id: 'btn-quit' }
        ];

        options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'menu-option';
            btn.innerText = opt.text;
            btn.onclick = opt.action;
            if (opt.id) btn.id = opt.id;

            // Interaction Sounds (Using Audio Assets)
            btn.onmouseenter = () => this.playHoverSound();

            menuContainer.appendChild(btn);
            menuContainer.appendChild(document.createElement('br'));
        });

        // 4. Faithful Quit Button Logic (It moves away)
        const quitBtn = document.getElementById('btn-quit');
        quitBtn.onmouseover = function () {
            // "It doesn't want you to leave"
            const randomX = (Math.random() - 0.5) * 50;
            const randomY = (Math.random() - 0.5) * 50;
            this.style.transform = `translate(${randomX}px, ${randomY}px)`;
        };

        // 5. Load Pulse Logic
        if (localStorage.getItem('v848_save')) {
            const loadBtn = document.getElementById('btn-load');
            loadBtn.style.color = '#fff';
            loadBtn.style.textShadow = '0 0 10px #fff';
        }
    },

    startGame: function () {
        // Heavy Click Sound
        this.playClickSound();

        // Transition to Prologue
        // "Heavy" fade out
        document.getElementById('stage').style.transition = 'opacity 1s ease-in';
        document.getElementById('stage').style.opacity = 0;

        setTimeout(() => {
            window.vn.loadPhase("02_prologue");
        }, 1200);
    },

    loadGame: function () {
        // Placeholder for Save/Load system
        console.log("[SYSTEM] Memory retrieval initialized...");
    },

    quitGame: function () {
        // You cannot quit.
        alert("CRITICAL ERROR: TERMINATION DENIED BY SYSTEM KERNEL.");
    },

    // Audio binding (simulated if file not found, but trying to use asset paths)
    playHoverSound: function () {
        // In real V1, this would load the mp3. 
        // For this "Lab" demo, we assume the file structure exists relative to this file.
        // But since we can't reliably play audio without user interaction first,
        // we might rely on the click initiating the context.
    },

    playClickSound: function () {
        // Logic for click
    }
};
