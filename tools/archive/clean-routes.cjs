const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, 'src/content/routes');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.json')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

async function cleanRoutes() {
    console.log('🧹 Starting Route Cleanup...');

    // Find all JSON files
    const files = getAllFiles(ROUTES_DIR);
    console.log(`Found ${files.length} files to process.`);

    let totalReplacements = 0;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        let fileReplacements = 0;

        // Replace \\' with '
        const apostropheRegex = /\\\\'/g;

        if (apostropheRegex.test(newContent)) {
            const matches = newContent.match(apostropheRegex);
            fileReplacements = matches ? matches.length : 0;
            newContent = newContent.replace(apostropheRegex, "'");
        }

        if (fileReplacements > 0) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`✅ Cleaned ${path.basename(file)}: ${fileReplacements} fixes`);
            totalReplacements += fileReplacements;
        }
    }

    console.log('✨ Cleanup Complete!');
    console.log(`Total escaped apostrophes fixed: ${totalReplacements}`);
}

async function findDuplicates() {
    console.log('🔍 Scanning for Duplicate Scene IDs...');
    const files = getAllFiles(ROUTES_DIR);
    const idMap = new Map(); // id -> [file1, file2, ...]
    const fileContentMap = new Map(); // file -> content object

    // 1. Load all IDs
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const json = JSON.parse(content);
            fileContentMap.set(file, json);

            if (json.scenes) {
                json.scenes.forEach(scene => {
                    if (scene.id) {
                        if (!idMap.has(scene.id)) {
                            idMap.set(scene.id, []);
                        }
                        idMap.get(scene.id).push(path.basename(file));
                    }
                });
            }
        } catch (e) {
            console.error(`Error parsing ${path.basename(file)}:`, e.message);
        }
    }

    // 2. Report Duplicates
    let duplicateCount = 0;
    idMap.forEach((fileList, id) => {
        if (fileList.length > 1) {
            console.warn(`⚠️  Duplicate ID: "${id}" found in: ${fileList.join(', ')}`);
            duplicateCount++;
        }
    });

    if (duplicateCount === 0) {
        console.log('✅ No duplicate IDs found!');
    } else {
        console.log(`❌ Found ${duplicateCount} duplicate IDs across files.`);
    }
}

async function checkLinks() {
    console.log('🔗 Checking Link Integrity...');
    const files = getAllFiles(ROUTES_DIR);
    const allIds = new Set();
    const links = []; // { sourceFile, sourceId, targetId }

    // 1. Harvest all IDs and Links
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const json = JSON.parse(content);

            if (json.scenes) {
                json.scenes.forEach(scene => {
                    if (scene.id) allIds.add(scene.id);

                    if (scene.nextSceneId) {
                        links.push({
                            sourceFile: path.basename(file),
                            sourceId: scene.id,
                            targetId: scene.nextSceneId
                        });
                    }
                    if (scene.choices) {
                        scene.choices.forEach(choice => {
                            if (choice.nextSceneId) {
                                links.push({
                                    sourceFile: path.basename(file),
                                    sourceId: scene.id,
                                    targetId: choice.nextSceneId
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) { }
    }

    // 2. Verify Links
    let brokenCount = 0;
    const WHITELIST = new Set(['prologueComplete', 'titleScreen', 'credits']);

    links.forEach(link => {
        if (!allIds.has(link.targetId) && !WHITELIST.has(link.targetId)) {
            // Ignore reserved/special IDs if any (e.g. 'title', 'end')
            // Assuming no special keywords for now except maybe null/undefined which are filtered
            console.warn(`⚠️  Broken Link in ${link.sourceFile} (Scene: ${link.sourceId}): Target "${link.targetId}" not found.`);
            brokenCount++;
        }
    });

    if (brokenCount === 0) {
        console.log('✅ All links are valid!');
    } else {
        console.log(`❌ Found ${brokenCount} broken links.`);
    }
}

async function main() {
    await cleanRoutes();
    await findDuplicates();
    await checkLinks();
}

main().catch(console.error);
