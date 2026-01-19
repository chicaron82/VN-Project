#!/usr/bin/env node
/**
 * Timeline Refactor Script
 * Converts phase-based IDs to date-based IDs
 * Adds sortDate field for proper chronological ordering
 *
 * Run: node scripts/refactor-timeline.cjs
 */

const fs = require('fs');
const path = require('path');

const timelinePath = path.join(__dirname, '../showcase/timeline-data.js');

// Read the file
let content = fs.readFileSync(timelinePath, 'utf8');

// Extract the JSON part (after "window.TIMELINE_DATA = ")
const jsonStart = content.indexOf('{');
const jsonEnd = content.lastIndexOf('}') + 1;
const jsonStr = content.substring(jsonStart, jsonEnd);

// Parse (we need to handle the JS object notation)
let data;
try {
    // Use eval since it's JS object notation, not strict JSON
    eval('data = ' + jsonStr);
} catch (e) {
    console.error('Failed to parse timeline data:', e);
    process.exit(1);
}

// Parse date string to ISO format
function parseDate(dateStr) {
    const months = { January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
                    July: '07', August: '08', September: '09', October: '10', November: '11', December: '12' };

    // Handle "December 2025" format
    if (dateStr.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/)) {
        const [month, year] = dateStr.split(' ');
        return `${year}-${months[month]}-01`;
    }

    // Handle "January 8, 2026" or "January 12, 2026 (Evening)" or "January 13-14, 2026" format
    const match = dateStr.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:-\d{1,2})?,?\s+(\d{4})/);
    if (match) {
        const [, month, day, year] = match;
        return `${year}-${months[month]}-${day.padStart(2, '0')}`;
    }

    console.warn(`Could not parse date: ${dateStr}`);
    return '2026-01-01'; // fallback
}

// Extract time of day suffix for same-day ordering
function getTimeOfDaySuffix(dateStr) {
    if (dateStr.includes('Morning')) return '1';
    if (dateStr.includes('Afternoon')) return '2';
    if (dateStr.includes('Evening') && !dateStr.includes('Late')) return '3';
    if (dateStr.includes('Late Evening')) return '4';
    if (dateStr.includes('Late Night')) return '5';
    if (dateStr.includes('Midnight')) return '6';
    return '0'; // default - no time specified
}

// Session counter per date+time combo
const sessionCounters = {};

function getSessionId(dateStr) {
    const isoDate = parseDate(dateStr);
    const timeOfDay = getTimeOfDaySuffix(dateStr);
    const key = `${isoDate}-${timeOfDay}`;

    if (!sessionCounters[key]) {
        sessionCounters[key] = 0;
    }
    sessionCounters[key]++;
    const suffix = String.fromCharCode(96 + sessionCounters[key]); // a, b, c...

    return { isoDate, timeOfDay, suffix };
}

// Process each phase
data.phases = data.phases.map((phase) => {
    const { isoDate, timeOfDay, suffix } = getSessionId(phase.date);

    // New ID format: 2026-01-17-a
    const newId = `${isoDate}-${suffix}`;

    // Remove "Phase X: " prefix from title
    let newTitle = phase.title.replace(/^Phase \d+[a-z]?:\s*/i, '');

    // Add sortDate for proper ordering
    // Format: YYYY-MM-DDT{timeOfDay}{suffix} for deterministic ordering
    const sortDate = `${isoDate}T${timeOfDay}${suffix}`;

    return {
        ...phase,
        id: newId,
        sortDate: sortDate,
        title: newTitle,
        // Keep original phase number as reference
        legacyPhase: phase.id,
    };
});

// Sort by sortDate
data.phases.sort((a, b) => a.sortDate.localeCompare(b.sortDate));

// Convert back to JS string
const newContent = `// Timeline data for showcase website
// This is loaded as a script to avoid CORS issues with local file:// protocol
// REFACTORED: Now uses date-based IDs instead of phase numbers
// Each entry has a sortDate field for proper chronological ordering
window.TIMELINE_DATA = ${JSON.stringify(data, null, 4)};
`;

// Write back
fs.writeFileSync(timelinePath, newContent, 'utf8');

console.log('Timeline refactored successfully!');
console.log(`Processed ${data.phases.length} entries`);
console.log('IDs changed from phase-X to YYYY-MM-DD-x format');
console.log('Added sortDate field for proper ordering');

// Show the final sort order
console.log('\nFinal entry order:');
data.phases.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.sortDate} | ${p.id} | ${p.title.substring(0, 40)}...`);
});
