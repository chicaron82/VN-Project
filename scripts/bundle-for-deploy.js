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
    // console.log('   (Skipping build for debug speed - ensure dist exists)');
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
            // console.log(`   -> ${entry.name}`); // Reduced spam
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(showcaseDir, targetShowcaseDir);

// 4. Copy V1 (Legacy) to dist/v1
console.log('\n🏛️  Copying V1 Legacy to dist/v1...');
const targetV1Dir = path.resolve(distDir, 'v1');
const v1Exclude = [
    'node_modules', '.git', 'dist', 'showcase', 'src', 'public', '.vscode', '.idea',
    'timeline_847_failures', '.gemini', '.antigravity', 'v2-contributions', 'v2-starter', 'docs'
];

if (!fs.existsSync(targetV1Dir)) fs.mkdirSync(targetV1Dir, { recursive: true });

// Copy root files (V1)
const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
for (let entry of rootEntries) {
    if (v1Exclude.includes(entry.name)) continue;

    // Skip file-like artifacts that shouldn't be in V1
    if (entry.name === 'vite.config.ts' || entry.name === 'package.json' || entry.name === 'package-lock.json' || entry.name === 'tsconfig.json' || entry.name === 'tsconfig.node.json') continue;

    let srcPath = path.join(rootDir, entry.name);
    let destPath = path.join(targetV1Dir, entry.name);

    if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
    } else {
        fs.copyFileSync(srcPath, destPath);
    }
}

// 5. Create Landing Page
console.log('\n✨ Creating Landing Page...');
// Copy favicon
if (fs.existsSync(path.join(rootDir, 'favicon.ico'))) {
    fs.copyFileSync(path.join(rootDir, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
    console.log('   -> Copied favicon.ico');
}

const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UV7 Project Hub</title>
    <link rel="icon" type="image/x-icon" href="./favicon.ico">
    <style>
        body {
            background-color: #050505;
            color: #e0e0e0;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }
        .container {
            text-align: center;
            animation: fadeIn 1s ease-out;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #00ff88, #00ccff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }
        .card-grid {
            display: flex;
            gap: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            width: 300px;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            position: relative;
            overflow: hidden;
        }
        .card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .card h2 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }
        .card p {
            color: #888;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-v2 { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
        .badge-showcase { background: rgba(0, 204, 255, 0.2); color: #00ccff; }
        .badge-legacy { background: rgba(255, 0, 85, 0.2); color: #ff0055; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>UV7 Project Hub</h1>
        
        <div class="card-grid">
            <a href="./index.v2.html" class="card">
                <span class="badge badge-v2">Playable Demo</span>
                <h2>Launch V2 Engine</h2>
                    <!-- Static Logo Fallback (Hidden by default via CSS) -->
                    <img src="./UnitedVoices7.png" class="uv7-logo-static" alt="United Voices 7 Logo">
                    
                    <!-- Animated Reveal Video (Width controlled by JS) -->
                    <div class="uv7-logo-wrap loading" id="uv7-logo-wrap">
                        <div class="uv7-logo-reveal" id="uv7-logo-reveal">
                            <video id="uv7-logo-video" class="uv7-logo-video" preload="auto" muted playsinline>
                                <source src="./UnitedVoices7.mp4" type="video/mp4">
                            </video>
                        </div>
                    </div>
                <p>Experience the latest build of the Vision 7 engine. Fully rebuilt with TypeScript, EventBus, and strict architecture.</p>
            </a>

            <a href="./showcase/index.html" class="card">
                <span class="badge badge-showcase">Documentation</span>
                <h2>View Showcase</h2>
                <p>Explore the development timeline, technical challenges, and the 'order vs chaos' journey behind the code.</p>
            </a>

            <a href="./v1/index.html" class="card">
                <span class="badge badge-legacy">Legacy Build</span>
                <h2>Play V1 (Original)</h2>
                <p>The original JavaScript chaos. Experience the bootstrap paradox where it all began (Version 848).</p>
            </a>
        </div>
        
        <p style="margin-top: 3rem; color: #444; font-size: 0.8rem;">Build: ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), landingHtml);

console.log('\n✅ Deployment preparation complete!');
console.log('👉 Upload the "dist" folder to GitHub Pages to go live.');
