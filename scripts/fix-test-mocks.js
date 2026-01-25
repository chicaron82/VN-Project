#!/usr/bin/env node
/**
 * Fix test files to properly inject mocks into constructors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🔧 Fixing test mocks to inject dependencies...\n');

// Analyze source file to get constructor params
function analyzeConstructor(sourceFilePath) {
    try {
        const content = fs.readFileSync(sourceFilePath, 'utf-8');
        
        // Find constructor signature
        const constructorMatch = content.match(/constructor\s*\([^)]*\)\s*{/);
        if (!constructorMatch) {
            return [];
        }
        
        const signature = constructorMatch[0];
        const paramsString = signature.match(/constructor\s*\(([^)]*)\)/)?.[1] || '';
        
        // Parse parameters
        const params = paramsString
            .split(',')
            .map(p => p.trim())
            .filter(p => p)
            .map(p => {
                // Extract type: "eventBus: EventBus" -> {name: "eventBus", type: "EventBus"}
                const parts = p.split(':').map(x => x.trim());
                return {
                    name: parts[0],
                    type: parts[1]?.replace(/\s*=.*$/, '') || 'any' // Remove default values
                };
            });
        
        return params;
    } catch (error) {
        return [];
    }
}

// Generate mock setup for a parameter
function generateMockSetup(param) {
    const { name, type } = param;
    
    if (type.includes('EventBus')) {
        return `const mock${type} = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};`;
    }
    
    if (type.includes('StateManager')) {
        return `const mock${type} = {
    getState: vi.fn(() => ({})),
    setState: vi.fn(),
    subscribe: vi.fn()
};`;
    }
    
    if (type.includes('Manager') || type.includes('System') || type.includes('Controller')) {
        return `const mock${type} = {} as any; // TODO: Add specific mocks`;
    }
    
    return `const mock${type} = {} as any;`;
}

// Fix a test file
function fixTestFile(testFilePath) {
    const content = fs.readFileSync(testFilePath, 'utf-8');
    
    // Get source file path
    const sourceFilePath = testFilePath.replace('.test.ts', '.ts');
    if (!fs.existsSync(sourceFilePath)) {
        return { fixed: false, reason: 'No source file' };
    }
    
    // Analyze constructor
    const params = analyzeConstructor(sourceFilePath);
    if (params.length === 0) {
        return { fixed: false, reason: 'No constructor params' };
    }
    
    // Check if already has proper mocks
    const hasMockInjection = params.every(p => 
        content.includes(`mock${p.type}`) && 
        content.includes(`new `) && 
        content.includes(`(mock`)
    );
    
    if (hasMockInjection) {
        return { fixed: false, reason: 'Already has mocks' };
    }
    
    // Generate mock setups
    const mockSetups = params.map(generateMockSetup).join('\n\n');
    
    // Find where to insert mocks (after imports, before describe)
    const describeIndex = content.indexOf('describe(');
    if (describeIndex === -1) {
        return { fixed: false, reason: 'No describe block' };
    }
    
    // Insert mocks after imports
    const lastImportIndex = content.lastIndexOf('import ', describeIndex);
    const insertPoint = content.indexOf('\n', lastImportIndex) + 1;
    
    let newContent = content.slice(0, insertPoint) + '\n' + mockSetups + '\n' + content.slice(insertPoint);
    
    // Replace constructor calls: `new ClassName()` -> `new ClassName(mockEventBus, mockStateManager, ...)`
    const className = path.basename(sourceFilePath, '.ts');
    const mockParams = params.map(p => `mock${p.type}`).join(', ');
    
    // Replace all instances of `new ClassName()`
    newContent = newContent.replace(
        new RegExp(`new ${className}\\(\\)`, 'g'),
        `new ${className}(${mockParams})`
    );
    
    // Write fixed content
    fs.writeFileSync(testFilePath, newContent);
    
    return { fixed: true, params: params.length };
}

// Find and fix all test files
function fixAllTests() {
    let fixed = 0;
    let skipped = 0;
    const reasons = {};
    
    function processDir(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            
            if (item.isDirectory() && !['node_modules', 'dist', 'build'].includes(item.name)) {
                processDir(fullPath);
            } else if (item.isFile() && item.name.endsWith('.test.ts')) {
                const result = fixTestFile(fullPath);
                
                if (result.fixed) {
                    fixed++;
                    console.log(`✅ Fixed: ${path.relative(projectRoot, fullPath)} (${result.params} params)`);
                } else {
                    skipped++;
                    reasons[result.reason] = (reasons[result.reason] || 0) + 1;
                }
            }
        }
    }
    
    processDir(path.join(projectRoot, 'v2'));
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Fixed: ${fixed} test files`);
    console.log(`⏭️  Skipped: ${skipped} test files`);
    console.log(`\nSkip reasons:`);
    Object.entries(reasons).forEach(([reason, count]) => {
        console.log(`  - ${reason}: ${count}`);
    });
}

fixAllTests();
