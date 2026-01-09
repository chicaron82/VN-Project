
// DOM Elements
const container = document.querySelector('.split-container');
const layerOrder = document.querySelector('.layer-order');
const handle = document.querySelector('.slider-handle');

// State
let isDragging = false;
let skew = 0; // In case we want diagonal later, keeping simple for now
let position = 50; // Percentage

// Event Listeners
handle.querySelector('.slider-knob').addEventListener('mousedown', (e) => {
    isDragging = true;
    container.style.cursor = 'ew-resize';
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'default';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate percentage position
    let x = e.clientX;
    let width = window.innerWidth;
    let pct = (x / width) * 100;

    // Constraints
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    updateSlider(pct);
});

// Touch support
handle.querySelector('.slider-knob').addEventListener('touchstart', () => {
    isDragging = true;
});

window.addEventListener('touchend', () => {
    isDragging = false;
});

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    let touch = e.touches[0];
    let x = touch.clientX;
    let width = window.innerWidth;
    let pct = (x / width) * 100;
    updateSlider(pct);
});

function updateSlider(pct) {
    position = pct;

    // Update Clip Path for the top layer (Order)
    // We reveal chaos (bottom) on left, Order (top) on right
    // Wait... if slider is at 50%, left is Chaos, right is Order.
    // So Order layer (top) needs to be clipped from LEFT.

    // clip-path: polygon(X% 0, 100% 0, 100% 100%, X% 100%);
    // If pct is 20%, we start at 20% and go right.

    layerOrder.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;

    // Update Handle position
    handle.style.left = `${pct}%`;
}

// Initial Position
updateSlider(50);

// Random Code Typer for Chaos Background
const chaosCodeBlock = document.querySelector('.chaos-code-bg');
const codeSnippets = [
    "function forceUpdate() { while(true) { try { render() } catch(e) { ignore() } } }",
    "// TODO: Fix this later... maybe...",
    "if (user.isSad) { makeHappy(user); } else { breakStuff(); }",
    "box-shadow: 0 0 100px #f0f;",
    "$('body').on('click', function() { alert('Why?'); });",
    "return null; // I give up",
    "try { everything() } catch (nothing) {}",
    "// Logic is overrated",
    "width: calc(100% + 50px); /* Just to be safe */"
];

function typeCode() {
    if (!chaosCodeBlock) return;

    let text = chaosCodeBlock.innerText;
    if (text.length > 500) text = text.substring(200); // trimming

    // Add random snippet
    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    text += "\n" + snippet;

    chaosCodeBlock.innerText = text;

    setTimeout(typeCode, Math.random() * 500 + 100);
}

// Start typing effect
typeCode();
