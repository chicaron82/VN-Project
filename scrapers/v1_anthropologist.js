import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const V1_DIR = path.join(__dirname, '../v1');
const OUTPUT_FILE = path.join(__dirname, '../v1_soul_report.json');

const CREW_SIGNATURES = [
    'Ronnie', 'Belle', 'DiZee', 'Tori', 'GenZee', 'Zee', 'Chicharon'
];

const CHAOS_MARKERS = [
    'TODO', 'FIXME', 'HACK', 'god help', 'don\'t ask', 'magic', 'spaghetti', 'broken', 'legacy', 'deprecated', 'oops', 'wtf'
];

// Emoji regex range
const EMOJIS = /[\u{1F300}-\u{1F9FF}]/gu;

const stats = {
    totalFiles: 0,
    totalLines: 0,
    signatures: {},
    chaosComments: [],
    emojiCounts: {},
    massiveFunctions: [], // Functions > 100 lines (heuristic)
    globalVars: 0
};

// Initialize signatures
CREW_SIGNATURES.forEach(name => stats.signatures[name] = 0);

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
            analyzeFile(filePath);
        }
    });
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relPath = path.relative(V1_DIR, filePath);

    stats.totalFiles++;
    stats.totalLines += lines.length;

    // Line-by-line analysis
    lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Signatures
        CREW_SIGNATURES.forEach(name => {
            if (line.includes(name)) {
                stats.signatures[name]++;
            }
        });

        // Chaos Markers
        CHAOS_MARKERS.forEach(marker => {
            if (line.toLowerCase().includes(marker.toLowerCase())) {
                stats.chaosComments.push({
                    file: relPath,
                    line: lineNum,
                    content: line.trim()
                });
            }
        });

        // Emojis
        const emojis = line.match(EMOJIS);
        if (emojis) {
            emojis.forEach(emoji => {
                stats.emojiCounts[emoji] = (stats.emojiCounts[emoji] || 0) + 1;
            });
        }
    });

    // Heuristic for Global Vars (window.X = ...)
    const globalMatches = content.match(/window\.\w+\s*=/g);
    if (globalMatches) {
        stats.globalVars += globalMatches.length;
    }
}

console.log('🔍 Starting Anthropological Scan of V1...');
try {
    walkDir(V1_DIR);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    console.log(`✅ Scan Complete. Analyzed ${stats.totalFiles} files and ${stats.totalLines} lines.`);
    console.log(`📄 Report saved to ${OUTPUT_FILE}`);
} catch (error) {
    console.error('Failed to analyze:', error);
}
