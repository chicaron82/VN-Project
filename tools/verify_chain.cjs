const fs = require('fs');

function checkChain(filePath, startId) {
    console.log(`Checking ${filePath} starting at ${startId}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const scenes = new Map(data.scenes.map(s => [s.id, s]));

    let currentId = startId;
    let visited = new Set();

    while (currentId) {
        if (visited.has(currentId)) {
            console.log(`Loop detected at ${currentId}`);
            break;
        }
        visited.add(currentId);

        const scene = scenes.get(currentId);
        if (!scene) {
            console.log(`Scene not found: ${currentId}`);
            break;
        }

        console.log(`Visited: ${currentId} -> ${scene.nextSceneId}`);
        currentId = scene.nextSceneId;
    }
    console.log(`Chain ended. Total visited: ${visited.size}`);
}

checkChain('src/content/routes/ronnie_act3.json', 'trueRouteEnding');
checkChain('src/content/routes/ronnie_act3.json', 'badRouteEnding');
checkChain('src/content/routes/ronnie_act3.json', 'digitalForeverEnding');
