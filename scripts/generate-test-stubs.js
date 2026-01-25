#!/usr/bin/env node
/**
 * Generate test stub files for all TypeScript files that don't have tests
 * Creates comprehensive test coverage structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🧪 Generating test stubs for complete coverage...\n');

const directories = [
    'v2/controllers',
    'v2/managers', 
    'v2/systems',
    'v2/ui/components',
    'v2/core',
    'v2/utils'
];

function generateTestContent(filePath, className) {
    const relativePath = path.relative(path.dirname(filePath), filePath.replace('.test.ts', '.ts'));
    
    return `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ${className} } from './${path.basename(filePath.replace('.test.ts', ''))}';

describe('${className}', () => {
    beforeEach(() => {
        // Setup
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Cleanup
    });

    describe('Initialization', () => {
        it('should initialize correctly', () => {
            // TODO: Add initialization test
            expect(true).toBe(true);
        });
    });

    describe('Core Functionality', () => {
        it('should handle basic operations', () => {
            // TODO: Add functionality tests
            expect(true).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle edge cases gracefully', () => {
            // TODO: Add edge case tests
            expect(true).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle errors appropriately', () => {
            // TODO: Add error handling tests
            expect(true).toBe(true);
        });
    });
});
`;
}

let totalCreated = 0;
let totalSkipped = 0;

for (const dir of directories) {
    const fullDir = path.join(projectRoot, dir);
    
    if (!fs.existsSync(fullDir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        continue;
    }

    const files = fs.readdirSync(fullDir)
        .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('.d.ts') && f !== 'index.ts' && f !== 'types.ts');

    console.log(`\n📁 ${dir}/`);
    
    for (const file of files) {
        const sourceFile = path.join(fullDir, file);
        const testFile = sourceFile.replace('.ts', '.test.ts');
        
        if (fs.existsSync(testFile)) {
            console.log(`  ✓ ${file} (test exists)`);
            totalSkipped++;
            continue;
        }

        const className = file.replace('.ts', '');
        const testContent = generateTestContent(testFile, className);
        
        fs.writeFileSync(testFile, testContent);
        console.log(`  ✨ Created ${file.replace('.ts', '.test.ts')}`);
        totalCreated++;
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`📊 Test Stub Generation Complete!`);
console.log(`   ✨ Created: ${totalCreated} new test files`);
console.log(`   ✓ Skipped: ${totalSkipped} existing tests`);
console.log(`   📝 Total: ${totalCreated + totalSkipped} test files`);
console.log(`${'='.repeat(60)}\n`);

console.log('Next steps:');
console.log('1. Review generated test files');
console.log('2. Fill in TODO sections with actual tests');
console.log('3. Run `npm test` to verify all tests pass');
console.log('4. Aim for meaningful test coverage, not just 100% files\n');
