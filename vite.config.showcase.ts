import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    root: '.',
    publicDir: false, // Don't copy public assets
    build: {
        outDir: 'showcase/js',
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'src/bridge/ShowcaseBridge.ts'),
            name: 'UV7System', // Global variable name
            fileName: (format) => `uv7-system-bridge.js`,
            formats: ['iife'],
        },
        rollupOptions: {
            external: [], // Bundle everything
            output: {
                // Ensure global variable assignment works
                extend: true,
            }
        },
        sourcemap: true,
        minify: false, // Keep it readable for now
    },
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@systems': path.resolve(__dirname, './src/systems'),
            '@controllers': path.resolve(__dirname, './src/controllers'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@content': path.resolve(__dirname, './src/content'),
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
});
