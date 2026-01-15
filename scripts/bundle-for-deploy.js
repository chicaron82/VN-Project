import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const showcaseDir = path.resolve(rootDir, 'showcase');

console.log('🚀 Starting Deployment Bundle...');

// 1. Run V2 Build
console.log('\n📦 Building V2 Engine...');
try {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
    console.error('❌ Build failed!');
    process.exit(1);
}

// 2. Ensure dist exists (it should after build)
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// 3. Copy Showcase to dist/showcase
console.log('\n📂 Copying Showcase to dist/showcase...');
const targetShowcaseDir = path.resolve(distDir, 'showcase');

// Helper to copy directory recursive
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(showcaseDir, targetShowcaseDir);

// 4. Copy V1 (Legacy) to dist/v1
console.log('\n🏛️  Copying V1 Legacy to dist/v1...');
const targetV1Dir = path.resolve(distDir, 'v1');

// IMPORTANT: Do NOT exclude 'src' - V1 needs src/ui/styles/ for CSS
const v1Exclude = [
    'node_modules', '.git', 'dist', 'showcase', 'public', '.vscode', '.idea',
    'timeline_847_failures', '.gemini', '.antigravity', 'v2-contributions', 'v2-starter', 'docs',
    '.agent', '.claude'
];

if (!fs.existsSync(targetV1Dir)) fs.mkdirSync(targetV1Dir, { recursive: true });

// Copy root files (V1)
const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
for (let entry of rootEntries) {
    if (v1Exclude.includes(entry.name)) continue;

    // Skip V2-specific config files
    if (['vite.config.ts', 'package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.node.json', 'tsconfig.v2.json', 'vitest.config.js'].includes(entry.name)) continue;

    let srcPath = path.join(rootDir, entry.name);
    let destPath = path.join(targetV1Dir, entry.name);

    if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
    } else {
        fs.copyFileSync(srcPath, destPath);
    }
}

// 5. Copy essential assets to dist root
console.log('\n📦 Copying essential assets to dist root...');
const rootAssets = ['UnitedVoices7.mp4', 'UnitedVoices7.png', 'favicon.ico', 'site.webmanifest', 'uv7-os-landing.js'];
for (const asset of rootAssets) {
    const srcPath = path.join(rootDir, asset);
    const altSrcPath = path.join(rootDir, 'assets', asset); // Try assets folder too
    const destPath = path.join(distDir, asset);

    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`   -> Copied ${asset}`);
    } else if (fs.existsSync(altSrcPath)) {
        fs.copyFileSync(altSrcPath, destPath);
        console.log(`   -> Copied ${asset} (from assets/)`);
    } else {
        console.log(`   ⚠️  ${asset} not found`);
    }
}

// 6. Create Landing Page from Template
console.log('\n✨ Creating Landing Page...');

// Read template file
const templatePath = path.join(__dirname, '..', 'landing-page-template.html');
let landingHtml = fs.readFileSync(templatePath, 'utf8');

// Replace BUILD_TIMESTAMP placeholder
landingHtml = landingHtml.replace('BUILD_TIMESTAMP', new Date().toISOString());

fs.writeFileSync(path.join(distDir, 'index.html'), landingHtml);

console.log('\n✅ Deployment preparation complete!');
console.log('👉 Upload the "dist" folder to GitHub Pages to go live.');
