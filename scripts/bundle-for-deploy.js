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
const rootAssets = ['UnitedVoices7.mp4', 'UnitedVoices7.png', 'favicon.ico', 'site.webmanifest'];
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

// 6. Create Landing Page
console.log('\n✨ Creating Landing Page...');

const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UV7 Project Hub</title>
    <link rel="icon" type="image/x-icon" href="./favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #000;
            color: #e0e0e0;
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
        }

        /* Animated Background */
        .bg-gradient {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a1a 100%);
            z-index: 0;
        }

        .bg-gradient::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0,204,255,0.1) 0%, transparent 50%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Particles */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 255, 136, 0.5);
            border-radius: 50%;
            animation: float 15s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        /* Container */
        .container {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
        }

        /* Hero */
        .hero {
            text-align: center;
            margin-bottom: 3rem;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
            font-size: clamp(2rem, 8vw, 4rem);
            font-weight: 900;
            background: linear-gradient(135deg, #00ff88, #00ccff, #00ff88);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s ease-in-out infinite;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }

        @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .hero p {
            font-size: clamp(0.9rem, 2.5vw, 1.1rem);
            color: #888;
            font-weight: 300;
        }

        /* Card Grid */
        .card-grid {
            display: grid;
            gap: 1.5rem;
            width: 100%;
            max-width: 1200px;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        /* Responsive adjustments for landscape mobile */
        @media (max-width: 1024px) and (max-height: 600px) {
            .container {
                padding: 1rem;
                justify-content: flex-start;
            }
            
            .hero {
                margin-bottom: 1.5rem;
            }

            .hero h1 {
                font-size: 2rem;
                margin-bottom: 0.25rem;
            }

            .hero p {
                font-size: 0.85rem;
            }

            .card-grid {
                gap: 1rem;
                grid-template-columns: repeat(3, 1fr);
            }

            .card {
                padding: 1rem !important;
            }

            .card h2 {
                font-size: 1rem !important;
            }

            .card p {
                font-size: 0.75rem !important;
                line-height: 1.3 !important;
            }

            .badge {
                font-size: 0.65rem !important;
                padding: 3px 6px !important;
            }
        }

        /* Portrait mobile */
        @media (max-width: 600px) {
            .card-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Card */
        .card {
            position: relative;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            animation: fadeInUp 0.6s ease-out backwards;
        }

        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,204,255,0.1));
            opacity: 0;
            transition: opacity 0.4s;
            border-radius: 20px;
        }

        .card:hover {
            transform: translateY(-8px) scale(1.02);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 255, 136, 0.4);
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2),
                        0 0 40px rgba(0, 204, 255, 0.1);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card:active {
            transform: translateY(-4px) scale(1.01);
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1rem;
        }

        .badge-v2 { 
            background: rgba(0, 255, 136, 0.2); 
            color: #00ff88;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .badge-showcase { 
            background: rgba(0, 204, 255, 0.2); 
            color: #00ccff;
            box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);
        }
        
        .badge-legacy { 
            background: rgba(255, 0, 85, 0.2); 
            color: #ff0055;
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.3);
        }

        .card h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: #fff;
        }

        .card p {
            color: #aaa;
            font-size: 0.9rem;
            line-height: 1.5;
            font-weight: 300;
        }

        /* Footer */
        .footer {
            margin-top: 3rem;
            text-align: center;
            color: #444;
            font-size: 0.75rem;
            font-weight: 300;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="bg-gradient"></div>
    <div class="particles">
        <div class="particle" style="left: 10%; animation-delay: 0s;"></div>
        <div class="particle" style="left: 20%; animation-delay: 2s;"></div>
        <div class="particle" style="left: 30%; animation-delay: 4s;"></div>
        <div class="particle" style="left: 40%; animation-delay: 1s;"></div>
        <div class="particle" style="left: 50%; animation-delay: 3s;"></div>
        <div class="particle" style="left: 60%; animation-delay: 5s;"></div>
        <div class="particle" style="left: 70%; animation-delay: 2.5s;"></div>
        <div class="particle" style="left: 80%; animation-delay: 4.5s;"></div>
        <div class="particle" style="left: 90%; animation-delay: 1.5s;"></div>
    </div>

    <div class="container">
        <div class="hero">
            <h1>UV7 PROJECT HUB</h1>
            <p>Where chaos meets harmony. Choose your experience.</p>
        </div>
        
        <div class="card-grid">
            <a href="./index.v2.html" class="card">
                <span class="badge badge-v2">V2 Engine</span>
                <h2>Launch V2</h2>
                <p>TypeScript rebuild. EventBus architecture. 128 tests passing. Zero errors.</p>
            </a>

            <a href="./showcase/index.html" class="card">
                <span class="badge badge-showcase">Documentation</span>
                <h2>View Showcase</h2>
                <p>The journey from chaos to order. 10 phases. 72 hours. AI collaboration.</p>
            </a>

            <a href="./v1/index.html" class="card">
                <span class="badge badge-legacy">Legacy V1</span>
                <h2>Play Original</h2>
                <p>The bootstrap paradox. Version 848. Where it all began.</p>
            </a>
        </div>

        <div class="footer">
            Build: ${new Date().toISOString()} • Built with AI collaboration
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), landingHtml);

console.log('\n✅ Deployment preparation complete!');
console.log('👉 Upload the "dist" folder to GitHub Pages to go live.');
