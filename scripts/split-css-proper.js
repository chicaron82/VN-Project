const fs = require('fs');
const path = require('path');

console.log('Starting proper CSS split...\n');

// Read the bloated files
const componentsPath = path.join(__dirname, '../showcase/css/components.css');
const pagesPath = path.join(__dirname, '../showcase/css/pages.css');

const componentsContent = fs.readFileSync(componentsPath, 'utf8');
const pagesContent = fs.readFileSync(pagesPath, 'utf8');

const componentsLines = componentsContent.split('\n');
const pagesLines = pagesContent.split('\n');

// Components.css splits (line numbers are 0-indexed in arrays)
const componentsSplits = [
    { path: 'components/hero.css', start: 30, end: 275, name: 'Hero Section' },
    { path: 'components/timeline.css', start: 275, end: 965, name: 'Timeline Component' },
    { path: 'components/app-switcher-cards.css', start: 965, end: 1315, name: 'App Switcher Cards' },
    { path: 'components/code-comparison-modal.css', start: 1315, end: 1875, name: 'Code Comparison Modal' },
    { path: 'components/hero-banners.css', start: 1875, end: 2265, name: 'Hero Banners' },
    { path: 'components/spotlight-carousel.css', start: 2265, end: 2700, name: 'Spotlight Carousel' },
    { path: 'features/cooking-metaphor.css', start: 2700, end: 3155, name: 'Cooking Metaphor' },
    { path: 'features/soma-journey.css', start: 3155, end: 3485, name: 'Soma Journey' },
    { path: 'features/experiment-design.css', start: 3485, end: 4335, name: 'Experiment Design' },
    { path: 'features/experiment-dashboard.css', start: 4335, end: 4715, name: 'Experiment Dashboard' },
    { path: 'features/experiment-reflections.css', start: 4715, end: 5095, name: 'Experiment Reflections' },
    { path: 'features/experiment-mimic.css', start: 5095, end: 5385, name: 'Experiment Mimic' },
    { path: 'features/belle-path-comparison.css', start: 5385, end: 5558, name: 'Belle Path Comparison' },
];

// Pages.css splits (adjust line numbers based on actual file - lines are 0-indexed)
const pagesSplits = [
    { path: 'pages/who-page.css', start: 0, end: 485, name: 'Who Page' },
    { path: 'pages/evolution-page.css', start: 485, end: 940, name: 'Evolution Page' },
    { path: 'pages/spotlight-bento.css', start: 940, end: 1550, name: 'Spotlight Bento' },
    { path: 'features/content-features.css', start: 1550, end: 1950, name: 'Content Features' },
    { path: 'pages/workflow-methodology.css', start: 1950, end: 2270, name: 'Workflow Methodology' },
    { path: 'features/experiment-visual-contrast.css', start: 2270, end: 2385, name: 'Experiment Visual Contrast' },
    { path: 'pages/home-page.css', start: 2385, end: 2620, name: 'Home Page' },
];

const cssDir = path.join(__dirname, '../showcase/css');

// Split components.css
console.log('Splitting components.css...');
componentsSplits.forEach(({ path: filePath, start, end, name }) => {
    const content = componentsLines.slice(start, end).join('\n');
    const fullPath = path.join(cssDir, filePath);
    const header = `/**\n * ${name}\n * Extracted from components.css (lines ${start + 1}-${end})\n */\n\n`;
    fs.writeFileSync(fullPath, header + content, 'utf8');
    console.log(`  ✓ Created ${filePath} (${end - start} lines)`);
});

// Split pages.css
console.log('\nSplitting pages.css...');
pagesSplits.forEach(({ path: filePath, start, end, name }) => {
    const content = pagesLines.slice(start, end).join('\n');
    const fullPath = path.join(cssDir, filePath);
    const header = `/**\n * ${name}\n * Extracted from pages.css (lines ${start + 1}-${end})\n */\n\n`;
    fs.writeFileSync(fullPath, header + content, 'utf8');
    console.log(`  ✓ Created ${filePath} (${end - start} lines)`);
});

console.log('\n✅ All CSS files split successfully!');
console.log('\nNext steps:');
console.log('1. Update showcase.css to import the new files');
console.log('2. Remove/backup the old components.css and pages.css');
console.log('3. Test for visual regressions');
