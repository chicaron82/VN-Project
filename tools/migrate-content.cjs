const fs = require('fs');
const path = require('path');

// CLI Arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
    console.error('Usage: node migrate-content.js <input_js_file> <output_json_file>');
    process.exit(1);
}

// Read V1 file
const content = fs.readFileSync(inputFile, 'utf8');

// Regex to find methods that look like scenes
// Matches: sceneName() { ... displayScene({...}) ... }
// This is a naive regex but should work for the consistent coding style of V1
const sceneMethodRegex = /^\s*(\w+)\(\)\s*\{([\s\S]*?)\},?\s*['"](\w+)['"]\);/gm;

// Better approach:
// 1. Find all method definitions: `sceneName() {`
// 2. Inside them, look for `this.game.displayScene({ ... }, 'id')`
// 3. Extract the object literal string.

const scenes = {};
const sceneList = [];

// Helper to extract value from object literal string
function extractValue(propName, str) {
    // Regex matches: propName : 'value' OR "value" OR value
    // Handles escaped quotes in strings
    const regex = new RegExp(`${propName}\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)"|([^,}\\s]*))`);
    const match = str.match(regex);
    if (!match) return null;
    return match[1] || match[2] || match[3];
}

function extractObject(propName, str) {
    const regex = new RegExp(`${propName}\\s*:\\s*{([^}]*)}`);
    const match = str.match(regex);
    if (!match) return null;

    const inner = match[1];
    const parts = inner.split(',').map(p => p.trim()).filter(p => p);
    const obj = {};
    parts.forEach(p => {
        const [k, v] = p.split(':').map(s => s.trim().replace(/['"]/g, ''));
        if (k && v) obj[k] = v;
    });
    return obj;
}

// Regex to find the chunks "sceneName() { ... }" roughly
// We'll iterate line by line to be safer.

const lines = content.split('\n');
let currentSceneId = null;
let currentSceneBody = '';
let captureMode = false;

// We will parse the file using a state machine
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of a scene method
    // Matches any method like: name() {
    const methodMatch = line.match(/^\s*(\w+)\(.*\)\s*\{/);
    if (methodMatch) {
        // Potential scene start
        // We'll rely on "displayScene" check inside processScene to filter
        captureMode = true;
        currentSceneId = methodMatch[1];
        currentSceneBody = '';
        continue;
    }

    if (captureMode) {
        currentSceneBody += line + '\n';

        // End of method (naive, looking for `}, 'sceneId');` or just `}` at start of line
        // In V1, the displayScene call usually ends with `}, 'sceneId');`
        if (line.includes("}, '") && line.trim().endsWith("');")) {
            // Process the accumulated body
            processScene(currentSceneId, currentSceneBody);
            captureMode = false;
        }
    }
}

function processScene(id, body) {
    // Extract displayScene config
    // We are looking for the object inside displayScene({ ... 

    // Clean up body to just the object literal content
    const match = body.match(/displayScene\(\s*\{([\s\S]*)\}\s*,\s*['"]/);
    if (!match) return;

    const configStr = match[1];

    const char = extractValue('character', configStr);
    const dialogue = extractValue('dialogue', configStr);
    const internal = extractValue('internal', configStr);
    const background = extractValue('background', configStr);
    const sprites = extractObject('sprites', configStr);

    // Next scene?
    // 1. Simple arrow: next: () => this.sceneName()
    let nextMatch = configStr.match(/next:\s*\(\)\s*=>\s*this\.(\w+)\(\)/);
    let nextSceneId = nextMatch ? nextMatch[1] : null;

    // 2. Block arrow: next: () => { ... } using brace counting
    if (!nextSceneId) {
        const nextStartRegex = /next:\s*\(\)\s*=>\s*\{/;
        const startMatch = configStr.match(nextStartRegex);

        if (startMatch) {
            const startIndex = startMatch.index + startMatch[0].length;
            let braceCount = 1;
            let endIndex = -1;

            for (let i = startIndex; i < configStr.length; i++) {
                if (configStr[i] === '{') braceCount++;
                if (configStr[i] === '}') braceCount--;

                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }

            if (endIndex > -1) {
                const body = configStr.substring(startIndex, endIndex);
                // Find calls
                const calls = body.match(/this\.(\w+)\(\)/g);
                if (calls && calls.length > 0) {
                    const ignored = ['showCommentary', 'triggerSensoryFeedback', 'setEchoGrowthStage', 'blockSaves', 'unlockNote', 'showInsaneCageOverlay', 'triggerInsaneVisuals'];

                    for (let i = calls.length - 1; i >= 0; i--) {
                        const matchName = calls[i].match(/this\.(\w+)\(\)/)[1];
                        if (!ignored.includes(matchName)) {
                            nextSceneId = matchName;
                            break;
                        }
                    }
                }
            }
        }
    }
    // Choices?
    let choices = null;
    const choicesMatch = configStr.match(/choices:\s*\[([\s\S]*?)\]/);
    if (choicesMatch) {
        const choicesBody = choicesMatch[1];
        const choiceObjects = choicesBody.match(/\{[^}]+\}/g);
        if (choiceObjects) {
            choices = choiceObjects.map(objStr => {
                const text = extractValue('text', objStr);
                const value = extractValue('value', objStr);
                return { text, value };
            });

            const onChoiceMatch = configStr.match(/onChoice:\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*this\.(\w+)\(/);
            if (onChoiceMatch) {
                const targetMethod = onChoiceMatch[1];
                choices.forEach(c => c.nextSceneId = targetMethod);
            }
        }
    }

    const scene = {
        id: id,
        type: 'dialog',
        character: char,
        text: dialogue,
        nextSceneId: nextSceneId
    };
    if (choices) scene.choices = choices;

    if (internal) scene.internal = internal;
    if (background) scene.background = background;
    if (sprites) scene.sprites = sprites;

    sceneList.push(scene);
}

// Write output
const output = {
    scenes: sceneList
};

// Ensure dir exists
const dir = path.dirname(outputFile);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
console.log(`✅ Converted ${sceneList.length} scenes to ${outputFile}`);
