import { defineConfig } from 'vite';

export default defineConfig({
    // Set base to '/' for custom domain or repo-name for GitHub Pages
    // Override with VITE_BASE env var: VITE_BASE=/chicharons-kitchen/ npm run build
    base: process.env.VITE_BASE || '/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split entries into a separate chunk to reduce initial load
                    'blog-data': ['./entries/index']
                }
            }
        },
        chunkSizeWarningLimit: 600
    }
});
