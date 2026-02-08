
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENTRIES_DIR = path.resolve(__dirname, '../showcase/data/blog/entries');
const OUTPUT_FILE = path.resolve(__dirname, '../showcase/data/blog/index.ts');

interface BlogEntryFile {
    path: string;
    filename: string;
    sortDate: string;
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
            if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
                results.push(filePath);
            }
        }
    });

    return results;
}

/**
 * Extract sortDate from file content via regex
 * Handles both TypeScript literal and JSON formats:
 *   sortDate: '2026-02-07T21:00:00'       (TS literal)
 *   sortDate: "2026-02-07T21:00:00"       (TS literal double-quote)
 *   "sortDate": "2026-02-07T21:00:00"     (JSON)
 */
function extractSortDate(filePath: string): string {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/["']?sortDate["']?\s*:\s*['"]([^'"]+)['"]/);
        return match ? match[1] : '0000-00-00T00:00:00';
    } catch {
        return '0000-00-00T00:00:00';
    }
}

/**
 * Generate the index.ts file content
 */
function generateIndex() {
    console.log('🔍 Scanning for timeline entries...');

    if (!fs.existsSync(ENTRIES_DIR)) {
        console.error(`❌ Entries directory not found: ${ENTRIES_DIR}`);
        process.exit(1);
    }

    const files = getEntries(ENTRIES_DIR);
    console.log(`found ${files.length} entry files.`);

    const entries: BlogEntryFile[] = files.map((filePath, index) => {
        const filename = path.basename(filePath);

        // Extract sortDate from file content for accurate ordering
        const sortDate = extractSortDate(filePath);

        // Create relative import path
        // path.relative returns something like '..\entries\2026\file.ts' on Windows
        // We need './entries/2026/02/file' (forward slashes, no extension)
        let relPath = path.relative(path.dirname(OUTPUT_FILE), filePath);
        relPath = relPath.replace(/\\/g, '/').replace(/\.ts$/, '');
        if (!relPath.startsWith('.')) {
            relPath = './' + relPath;
        }

        return {
            path: filePath,
            filename,
            sortDate,
            importPath: relPath,
            variableName: `entry${index}` // Simple unique alias
        };
    });

    // Sort by sortDate descending (newest first)
    const sortedEntries = entries.sort((a, b) => b.sortDate.localeCompare(a.sortDate));

    // Reassign sequential variable names after sorting
    sortedEntries.forEach((e, i) => {
        e.variableName = `entry${i}`;
    });

    // Generate File Content
    const imports = sortedEntries
        .map(e => `import { entry as ${e.variableName} } from '${e.importPath}';`)
        .join('\n');

    const arrayItems = sortedEntries
        .map(e => `    ${e.variableName}`)
        .join(',\n');

    const fileContent = `// Auto-generated index file for timeline entries
// DO NOT EDIT MANUALLY - regenerate using npm run generate:timeline

${imports}

export * from './types';
import type { BlogEntry } from './types';

export const timelineData: BlogEntry[] = [
${arrayItems}
];

export const TIMELINE_DATA = {
    entries: timelineData
};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`✅ Generated ${OUTPUT_FILE}`);
    console.log(`📊 Total Entries: ${sortedEntries.length}`);
}

generateIndex();
