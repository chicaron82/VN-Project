import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: '.',
  base: './', // Relative paths for GitHub Pages
  publicDir: 'assets',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './v2/core'),
      '@systems': path.resolve(__dirname, './v2/systems'),
      '@controllers': path.resolve(__dirname, './v2/controllers'),
      '@ui': path.resolve(__dirname, './v2/ui'),
      '@content': path.resolve(__dirname, './v2/content'),
      '@utils': path.resolve(__dirname, './v2/utils'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.v2.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true, // Opens index.v2.html automatically
  },
  // @ts-expect-error - Vitest config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    // Only include V2 TypeScript tests, exclude V1 JavaScript tests
    include: ['v2/**/*.test.ts', 'v2/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/timeline_847_failures/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'v2/**/*.d.ts',
        'v2/**/*.config.*',
        'v2/**/types.ts',
      ],
    },
  },
})
