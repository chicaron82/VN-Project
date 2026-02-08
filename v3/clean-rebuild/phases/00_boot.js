/**
 * PHASE 00: THE BOOT SEQUENCE
 * Status: Faithful Recreation of V1 Boot
 */
window.phases["00_boot"] = {
    start: function () {
        const stage = document.getElementById('stage');
        let lineIndex = 0;

        // The V1 Boot Text Buffer
        const bootLines = [
            { text: "INITIALIZING...", delay: 1000 },
            { text: "CHECKING MEMORY INTEGRITY...", delay: 400 },
            { text: "OK: 0x00004BF", delay: 100, class: "memory-ok" },
            { text: "OK: 0x00004C0", delay: 100, class: "memory-ok" },
            { text: "OK: 0x00004C1", delay: 100, class: "memory-ok" },
            // The sacred pause
            { text: "WARNING: SECTOR 7 CORRUPTED.", delay: 800, class: "memory-warn" },
            { text: "ATTEMPTING RECOVERY...", delay: 1500 }, // Hesitate
            { text: "RECOVERY FAILED. BYPASSING...", delay: 300, class: "memory-warn" },
            { text: "LOADING KERNEL...", delay: 600 },
            { text: "....................", delay: 50 },
            { text: "ACCESS GRANTED.", delay: 200, class: "memory-ok" },
            { text: "CONNECTION ESTABLISHED.", delay: 800 },
            { text: "", delay: 1000 },
            { text: "WELCOME, USER [NULL].", delay: 0 }
        ];

        function typeLine() {
            if (lineIndex >= bootLines.length) {
                // Boot Complete -> Transition to Menu
                window.vn.bootSequenceComplete = true;
                setTimeout(() => window.vn.loadPhase("01_menu"), 2000);
                return;
            }

            const lineData = bootLines[lineIndex];
            const div = document.createElement('div');
            if (lineData.class) div.className = lineData.class;
            stage.appendChild(div);

            // Audio Synthesis: Play "Think" beep (using Synthesis for Boot only as per old specs, 
            // but Assets doc says use V1 files. I will simulate V1 beeps with AudioContext if file fails, 
            // but let's try to stick to the 'Heavy Click' asset for interactions later).
            // Actually, for Boot, V1 used a simple typing sound. I'll omit audio for now to ensure reliability.

            let charIndex = 0;
            const text = lineData.text;

            function typeChar() {
                if (charIndex < text.length) {
                    div.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 30); // Typing speed
                } else {
                    // Line done, wait for delay
                    div.innerHTML += '<span class="cursor">█</span>'; // Add cursor to current line
                    // Remove cursor from previous line
                    const prevCursor = stage.querySelectorAll('.cursor');
                    if (prevCursor.length > 1) {
                        prevCursor[0].remove();
                    }

                    lineIndex++;
                    setTimeout(typeLine, lineData.delay);
                }
            }

            typeChar();
        }

        // Delay initial start
        setTimeout(typeLine, 1000);
    }
};
