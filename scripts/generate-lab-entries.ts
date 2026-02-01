
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENTRIES_DIR = path.resolve(__dirname, '../showcase/data/lab-entries');
const OUTPUT_FILE = path.resolve(__dirname, '../showcase/data/lab-entries/index.ts');

interface TimelineEntryFile {
    path: string;
    filename: string;
    dateStr: string;
    importPath: string;
    variableName: string;
}

/**
 * Recursively get all .ts files from a directory
 */
function getEntries(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getEntries(filePath));
        } else {
            // Ignore index.ts if it exists
            if (file.endsWith('.ts') && !file.endsWith('.d.ts') && file !== 'index.ts') {
                results.push(filePath);
            }
        }
    });

    return results;
}

/**
 * Generate the index.ts file content
 */
function generateIndex() {
    console.log('🔍 Scanning for lab entries...');

    if (!fs.existsSync(ENTRIES_DIR)) {
        console.error(`❌ Entries directory not found: ${ENTRIES_DIR}`);
        process.exit(1);
    }

    const files = getEntries(ENTRIES_DIR);
    console.log(`found ${files.length} entry files.`);

    const entries: TimelineEntryFile[] = files.map((filePath, index) => {
        const filename = path.basename(filePath);
        // Extract date from filename (YYYY-MM-DD) for sorting
        const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
        const dateStr = match ? match[1] : '0000-00-00';

        let relPath = path.relative(path.dirname(OUTPUT_FILE), filePath);
        relPath = relPath.replace(/\\/g, '/').replace(/\.ts$/, '');
        if (!relPath.startsWith('.')) {
            relPath = './' + relPath;
        }

        return {
            path: filePath,
            filename,
            dateStr, // For sorting
            importPath: relPath,
            variableName: `entry${index}` // Simple unique alias
        };
    });

    // Sort by filename descending (newest first)
    const sortedEntries = entries.sort((a, b) => b.filename.localeCompare(a.filename));

    // Generate File Content
    const imports = sortedEntries
        .map(e => `import { entry as ${e.variableName} } from '${e.importPath}';`)
        .join('\n');

    const arrayItems = sortedEntries
        .map(e => `    ${e.variableName}`)
        .join(',\n');

    const fileContent = `// Auto-generated index file for lab entries
// DO NOT EDIT MANUALLY - regenerate using npm run generate:lab-entries

${imports}

import type { TimelineEntry, TimelineData } from '../timeline/types';

export const entries: TimelineEntry[] = [
${arrayItems}
];

export const V3_LAB_DATA: TimelineData = {
    entries
};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`✅ Generated ${OUTPUT_FILE}`);
    console.log(`📊 Total Entries: ${sortedEntries.length}`);
}

generateIndex();
