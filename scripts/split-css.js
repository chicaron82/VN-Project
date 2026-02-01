const fs = require('fs');
const path = require('path');

// Read components.css
const componentsContent = fs.readFileSync('showcase/css/components.css', 'utf8');
const componentsLines = componentsContent.split('\n');

// Split components.css
const componentsSplits = [
    ['components/hero.css', 0, 275],
    ['components/timeline.css', 275, 965],
    ['components/app-switcher-cards.css', 965, 1315],
    ['components/code-comparison-modal.css', 1315, 1875],
    ['components/hero-banners.css', 1875, 2265],
    ['components/spotlight-carousel.css', 2265, 2700],
    ['features/cooking-metaphor.css', 2700, 3155],
    ['features/soma-journey.css', 3155, 3485],
    ['features/experiment-design.css', 3485, 4335],
    ['features/experiment-dashboard.css', 4335, 4715],
    ['features/experiment-reflections.css', 4715, 5095],
    ['features/experiment-mimic.css', 5095, 5385],
    ['features/belle-path-comparison.css', 5385, 5558],
];

componentsSplits.forEach(([filename, start, end]) => {
    const content = componentsLines.slice(start, end).join('\n');
    fs.writeFileSync(`showcase/css/${filename}`, content, 'utf8');
    console.log(`✓ Created ${filename} (${end - start} lines)`);
});

// Read pages.css
const pagesContent = fs.readFileSync('showcase/css/pages.css', 'utf8');
const pagesLines = pagesContent.split('\n');

// Split pages.css
const pagesSplits = [
    ['pages/who-page.css', 0, 485],
    ['pages/evolution-page.css', 485, 940],
    ['pages/spotlight-bento.css', 940, 1550],
    ['features/content-features.css', 1550, 1950],
    ['pages/workflow-methodology.css', 1950, 2270],
    ['features/experiment-visual-contrast.css', 2270, 2385],
    ['pages/home-page.css', 2385, 2620],
];

pagesSplits.forEach(([filename, start, end]) => {
    const content = pagesLines.slice(start, end).join('\n');
    fs.writeFileSync(`showcase/css/${filename}`, content, 'utf8');
    console.log(`✓ Created ${filename} (${end - start} lines)`);
});

console.log('\n✅ All CSS files split successfully!');
