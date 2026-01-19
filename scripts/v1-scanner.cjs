const fs = require('fs');
const path = require('path');

const SYSTEM_DIR = path.join(__dirname, '../system');
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(__dirname, '../docs/v1-parity-gap-report.json');

// Regex patterns
const CSS_CLASS_REGEX = /(?:class=["']|className\s*=\s*["']|classList\.add\(\s*["'])([\w\-\s]+)(?:["'])/g;
const LOCAL_STORAGE_REGEX = /localStorage\.(?:getItem|setItem|removeItem)\(\s*['"]([^'"]+)['"]/g;
const GLOBAL_FUNC_REGEX = /\b(showText|playSound|playMusic|showScene|updateState|saveGame|loadGame)\s*\(/g;

function scanFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');

    const cssClasses = new Set();
    const storageKeys = new Set();
    const globalCalls = new Set();

    // Scan CSS
    let match;
    while ((match = CSS_CLASS_REGEX.exec(content)) !== null) {
        match[1].split(/\s+/).forEach(cls => {
            if (cls.trim()) cssClasses.add(cls.trim());
        });
    }

    // Scan LocalStorage
    while ((match = LOCAL_STORAGE_REGEX.exec(content)) !== null) {
        storageKeys.add(match[1]);
    }

    // Scan Globals
    while ((match = GLOBAL_FUNC_REGEX.exec(content)) !== null) {
        globalCalls.add(match[1]);
    }

    return {
        cssClasses: [...cssClasses],
        storageKeys: [...storageKeys],
        globalCalls: [...globalCalls]
    };
}

function scanDirectory(dir) {
    const results = {};
    if (!fs.existsSync(dir)) return results;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.html')) {
            const filePath = path.join(dir, file);
            results[file] = scanFile(filePath);
        }
    });
    return results;
}

function main() {
    console.log('🔍 Scanning V1 Legacy Codebase...');

    const systemResults = scanDirectory(SYSTEM_DIR);
    const indexResults = scanFile(path.join(ROOT_DIR, 'index.html'));

    const aggregated = {
        cssClasses: new Set(),
        storageKeys: new Set(),
        globalCalls: new Set(),
        filesScanned: Object.keys(systemResults).length + (indexResults ? 1 : 0)
    };

    // Aggregate results
    [...Object.values(systemResults), indexResults].forEach(res => {
        if (!res) return;
        res.cssClasses.forEach(c => aggregated.cssClasses.add(c));
        res.storageKeys.forEach(k => aggregated.storageKeys.add(k));
        res.globalCalls.forEach(f => aggregated.globalCalls.add(f));
    });

    const report = {
        timestamp: new Date().toISOString(),
        filesScanned: aggregated.filesScanned,
        uniqueCSSClasses: [...aggregated.cssClasses].sort(),
        uniqueStorageKeys: [...aggregated.storageKeys].sort(),
        uniqueGlobalCalls: [...aggregated.globalCalls].sort(),
        details: {
            index: indexResults,
            system: systemResults
        }
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
    console.log(`✅ Scan Complete. Report saved to ${OUTPUT_FILE}`);
    console.log(`stats: ${aggregated.cssClasses.size} CSS classes, ${aggregated.storageKeys.size} Storage Keys, ${aggregated.globalCalls.size} Global Calls found.`);
}

main();
