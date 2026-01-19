/**
 * Find duplicate scene IDs across route JSON files
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'src', 'content', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.json'));

const sceneIds = {};
let totalScenes = 0;

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.scenes) return;

    data.scenes.forEach(scene => {
        totalScenes++;
        if (!sceneIds[scene.id]) {
            sceneIds[scene.id] = [];
        }
        sceneIds[scene.id].push(file);
    });
});

console.log(`\n📊 Scene ID Analysis`);
console.log(`Total scenes: ${totalScenes}`);
console.log(`Unique IDs: ${Object.keys(sceneIds).length}`);

const duplicates = Object.entries(sceneIds).filter(([id, files]) => files.length > 1);

if (duplicates.length > 0) {
    console.log(`\n❌ Found ${duplicates.length} duplicate scene IDs:\n`);
    duplicates.forEach(([id, files]) => {
        console.log(`  "${id}" appears in:`);
        files.forEach(file => console.log(`    - ${file}`));
        console.log('');
    });
} else {
    console.log('\n✅ No duplicate scene IDs found!');
}
