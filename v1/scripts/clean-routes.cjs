#!/usr/bin/env node
/**
 * DIZEE: Route JSON Cleanup Script
 * Fixes escaped apostrophes and normalizes character names from V1 migration
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'src', 'content', 'routes');

console.log('🧹 DIZEE Route Cleanup Script');
console.log('================================\n');

// Get all JSON files
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} route files to clean\n`);

let totalChanges = 0;

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Parse JSON to validate structure
    let json;
    try {
        json = JSON.parse(content);
    } catch (e) {
        console.error(`❌ ${file}: Invalid JSON, skipping\n`);
        return;
    }

    const originalContent = content;
    let changes = 0;

    // Fix 1: Remove escaped apostrophes (\\' -> ')
    const apostropheCount = (content.match(/\\\\'/g) || []).length;
    if (apostropheCount > 0) {
        content = content.replace(/\\\\'/g, "'");
        changes += apostropheCount;
        console.log(`  📝 Fixed ${apostropheCount} escaped apostrophes`);
    }

    // Fix 2: Normalize character names (remove parentheticals)
    // Track which character names need normalization
    const characterNormalizations = {
        'Tori (internal)': 'Tori',
        'Tori (internal, confused)': 'Tori',
        'Tori (internal, disoriented)': 'Tori',
        'Tori (distorted)': 'Tori',
        'Ronnie (internal)': 'Ronnie',
        'Older Man': 'Old Man', // Consistency with prologue
        'Old Ronnie': 'Old Man', // Normalize
    };

    let characterChanges = 0;
    Object.keys(characterNormalizations).forEach(oldName => {
        const newName = characterNormalizations[oldName];
        const pattern = new RegExp(`"character":\\s*"${oldName.replace(/[()]/g, '\\$&')}"`, 'g');
        const matches = content.match(pattern);
        if (matches) {
            content = content.replace(pattern, `"character": "${newName}"`);
            characterChanges += matches.length;
        }
    });

    if (characterChanges > 0) {
        changes += characterChanges;
        console.log(`  👤 Normalized ${characterChanges} character names`);
    }

    // Fix 3: Convert string "null" to actual null in sprites
    const nullCount = (content.match(/"sprites":\s*\{\s*"[^"]+"\s*:\s*"null"/g) || []).length;
    if (nullCount > 0) {
        content = content.replace(/"sprites":\s*\{\s*"([^"]+)"\s*:\s*"null"\s*\}/g, '"sprites": {}');
        content = content.replace(/:\s*"null"/g, ': null');
        changes += nullCount;
        console.log(`  🔧 Fixed ${nullCount} string "null" values`);
    }

    // Fix 4: Add isInternal flag AND normalize character names in JSON
    // This requires parsing and re-serializing
    let jsonModified = false;
    let internalFlagsAdded = 0;
    let characterNamesNormalized = 0;

    if (json.scenes) {
        json.scenes.forEach(scene => {
            // Check if character name suggests internal thought
            if (scene.character &&
                (scene.character.includes('(internal)') ||
                 scene.character.includes('(distorted)'))) {
                scene.isInternal = true;
                internalFlagsAdded++;
                jsonModified = true;
            }

            // Normalize character names (JSON level)
            Object.keys(characterNormalizations).forEach(oldName => {
                if (scene.character === oldName) {
                    scene.character = characterNormalizations[oldName];
                    characterNamesNormalized++;
                    jsonModified = true;
                }
            });
        });
    }

    if (jsonModified) {
        content = JSON.stringify(json, null, 4);
        if (internalFlagsAdded > 0) {
            console.log(`  🏷️  Added ${internalFlagsAdded} isInternal flags`);
        }
        if (characterNamesNormalized > 0) {
            console.log(`  👤 Normalized ${characterNamesNormalized} character names in JSON`);
        }
        changes++;
    }

    // Write back if changed
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file}: ${changes} fixes applied\n`);
        totalChanges += changes;
    } else {
        console.log(`⚪ ${file}: No changes needed\n`);
    }
});

console.log('================================');
console.log(`✨ Cleanup complete! ${totalChanges} total fixes applied.\n`);
console.log('Next steps:');
console.log('1. Review changes with git diff');
console.log('2. Test a route in V2 to verify');
console.log('3. Commit when satisfied\n');
