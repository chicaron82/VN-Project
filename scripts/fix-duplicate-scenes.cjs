/**
 * Fix duplicate scene IDs across route JSON files
 *
 * Strategy:
 * 1. Backup all route files
 * 2. Analyze duplicates and determine renaming strategy
 * 3. Rename scene IDs to be unique (prefix with filename)
 * 4. Update all nextSceneId references
 * 5. Generate detailed report
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'src', 'content', 'routes');
const backupDir = path.join(__dirname, '..', 'src', 'content', 'routes-backup');

console.log('\n🔧 DIZEE: Fixing Duplicate Scene IDs\n');
console.log('═'.repeat(60));

// Step 1: Create backup
console.log('\n📦 Step 1: Creating backup...');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.json'));
files.forEach(file => {
    const src = path.join(routesDir, file);
    const dest = path.join(backupDir, file);
    fs.copyFileSync(src, dest);
});
console.log(`✅ Backed up ${files.length} files to routes-backup/`);

// Step 2: Analyze duplicates
console.log('\n🔍 Step 2: Analyzing scene IDs...');
const sceneRegistry = {}; // sceneId -> [{file, index, scene}]
const fileData = {};

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fileData[file] = data;

    if (!data.scenes) return;

    data.scenes.forEach((scene, index) => {
        if (!sceneRegistry[scene.id]) {
            sceneRegistry[scene.id] = [];
        }
        sceneRegistry[scene.id].push({ file, index, scene });
    });
});

const duplicates = Object.entries(sceneRegistry)
    .filter(([id, occurrences]) => occurrences.length > 1);

console.log(`Found ${duplicates.length} duplicate scene IDs`);

// Step 3: Determine renaming strategy
console.log('\n🏷️  Step 3: Planning renames...');
const renameMap = {}; // oldId -> { file -> newId }
const changeLog = [];

duplicates.forEach(([sceneId, occurrences]) => {
    renameMap[sceneId] = {};

    occurrences.forEach(({ file, index, scene }) => {
        // Generate new ID: prefix with file basename (without .json)
        const filePrefix = file.replace('.json', '').replace(/_/g, '_');
        const newId = `${filePrefix}_${sceneId}`;

        renameMap[sceneId][file] = newId;
        changeLog.push({
            file,
            oldId: sceneId,
            newId: newId,
            index
        });
    });
});

console.log(`Planned ${changeLog.length} ID changes`);

// Step 4: Apply renames
console.log('\n✏️  Step 4: Applying changes...');
let totalChanges = 0;

files.forEach(file => {
    const data = fileData[file];
    if (!data.scenes) return;

    let fileChanged = false;

    // Update scene IDs
    data.scenes.forEach((scene, index) => {
        // Rename this scene if it's a duplicate
        if (renameMap[scene.id] && renameMap[scene.id][file]) {
            const oldId = scene.id;
            const newId = renameMap[scene.id][file];
            scene.id = newId;
            fileChanged = true;
            totalChanges++;
            console.log(`  ${file}: "${oldId}" → "${newId}"`);
        }

        // Update nextSceneId references
        if (scene.nextSceneId || scene.next) {
            const nextId = scene.nextSceneId || scene.next;

            // Check if this nextSceneId is a duplicate that got renamed
            Object.entries(renameMap).forEach(([oldId, fileMap]) => {
                if (nextId === oldId) {
                    // Find which file this scene points to (same file or cross-file)
                    // For simplicity, assume same-file references first
                    if (fileMap[file]) {
                        if (scene.nextSceneId) scene.nextSceneId = fileMap[file];
                        if (scene.next) scene.next = fileMap[file];
                        fileChanged = true;
                        totalChanges++;
                    }
                }
            });
        }

        // Update choice references
        if (scene.choices) {
            scene.choices.forEach(choice => {
                const nextId = choice.nextSceneId || choice.next;

                Object.entries(renameMap).forEach(([oldId, fileMap]) => {
                    if (nextId === oldId && fileMap[file]) {
                        if (choice.nextSceneId) choice.nextSceneId = fileMap[file];
                        if (choice.next) choice.next = fileMap[file];
                        fileChanged = true;
                        totalChanges++;
                    }
                });
            });
        }
    });

    // Write file if changed
    if (fileChanged) {
        const filePath = path.join(routesDir, file);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8');
    }
});

console.log(`\n✅ Applied ${totalChanges} changes across ${files.length} files`);

// Step 5: Verify no duplicates remain
console.log('\n✔️  Step 5: Verifying...');
const newRegistry = {};
files.forEach(file => {
    const filePath = path.join(routesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.scenes) return;

    data.scenes.forEach(scene => {
        if (!newRegistry[scene.id]) {
            newRegistry[scene.id] = [];
        }
        newRegistry[scene.id].push(file);
    });
});

const remainingDuplicates = Object.entries(newRegistry)
    .filter(([id, files]) => files.length > 1);

if (remainingDuplicates.length === 0) {
    console.log('✅ All duplicates resolved!');
} else {
    console.log(`⚠️  ${remainingDuplicates.length} duplicates still remain:`);
    remainingDuplicates.forEach(([id, files]) => {
        console.log(`  "${id}" in: ${files.join(', ')}`);
    });
}

// Final report
console.log('\n' + '═'.repeat(60));
console.log('📊 SUMMARY');
console.log('═'.repeat(60));
console.log(`Files processed: ${files.length}`);
console.log(`Duplicates found: ${duplicates.length}`);
console.log(`Total changes: ${totalChanges}`);
console.log(`Backup location: routes-backup/`);
console.log('\n✨ Done! To restore backup: copy routes-backup/* back to routes/\n');
