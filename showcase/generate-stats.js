#!/usr/bin/env node
/**
 * Generate Real Stats for Showcase
 * Runs tests and TypeScript checks to generate accurate stats.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Generating real stats...\n');

// Run tests and capture output
console.log('🧪 Running tests...');
let testsPassing = 0;
let testsFailing = 0;
let testsSkipped = 0;
let testsTotal = 0;

try {
    const testOutput = execSync('npx vitest run', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
    });

    // Parse test output
    // Look for: "Tests  X passed | Y failed | Z skipped (Total)"
    const testMatch = testOutput.match(/Tests\s+(\d+)\s+failed.*?(\d+)\s+passed.*?\((\d+)\)/);
    if (testMatch) {
        testsFailing = parseInt(testMatch[1]);
        testsPassing = parseInt(testMatch[2]);
        testsTotal = parseInt(testMatch[3]);
        testsSkipped = testsTotal - testsPassing - testsFailing;
    } else {
        // Try alternate format: "Tests  X passed | Y skipped (Total)"
        const passMatch = testOutput.match(/Tests\s+(\d+)\s+passed.*?\((\d+)\)/);
        if (passMatch) {
            testsPassing = parseInt(passMatch[1]);
            testsTotal = parseInt(passMatch[2]);
            testsSkipped = testsTotal - testsPassing;
        }
    }

    console.log(`✅ Tests: ${testsPassing} passing, ${testsFailing} failing, ${testsSkipped} skipped (${testsTotal} total)`);
} catch (error) {
    // Tests failed, parse error output
    const output = error.stdout || error.message;
    const failMatch = output.match(/Tests\s+(\d+)\s+failed.*?(\d+)\s+passed.*?\((\d+)\)/);
    if (failMatch) {
        testsFailing = parseInt(failMatch[1]);
        testsPassing = parseInt(failMatch[2]);
        testsTotal = parseInt(failMatch[3]);
        testsSkipped = testsTotal - testsPassing - testsFailing;
    }
    console.log(`⚠️  Tests: ${testsPassing} passing, ${testsFailing} failing, ${testsSkipped} skipped (${testsTotal} total)`);
}

// Run TypeScript check
console.log('\n🔍 Running TypeScript check...');
let tsErrors = 0;

try {
    execSync('npx tsc --noEmit', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
    });
    console.log('✅ TypeScript: 0 errors');
} catch (error) {
    const output = error.stdout || error.message;
    // Count error lines (lines starting with file paths and containing "error TS")
    const errorLines = output.split('\n').filter(line => line.includes('error TS'));
    tsErrors = errorLines.length;
    console.log(`⚠️  TypeScript: ${tsErrors} errors`);
}

// Count phases (from timeline-data.js or hardcoded)
const phasesComplete = 15; // Update this manually or parse from timeline

// Generate stats.json
const stats = {
    testsPass: testsPassing,
    testsFail: testsFailing,
    testsSkip: testsSkipped,
    testsTotal: testsTotal,
    tsErrors: tsErrors,
    phasesComplete: phasesComplete,
    lastUpdated: new Date().toISOString()
};

const statsPath = path.join(__dirname, 'stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

console.log(`\n✅ Generated stats.json:`);
console.log(JSON.stringify(stats, null, 2));
console.log(`\n📁 Saved to: ${statsPath}`);
