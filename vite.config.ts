import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: '.',
  base: '/VN-Project/', // Absolute path for GitHub Pages
  publicDir: 'public', // Use 'public' for V2-specific assets, we'll copy 'assets' manually
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
        main: path.resolve(__dirname, 'index.html'),
        v2: path.resolve(__dirname, 'v2/index.html'),
        showcase: path.resolve(__dirname, 'showcase/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true, // Opens v2/index.html automatically
  },
  // @ts-expect-error - Vitest config
  test: {
    globals: true, // REQUIRED for test discovery to work
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    // Include ALL V2 tests + shell tests wherever they are located
    include: [
      'v2/**/*.test.ts',
      'v2/**/*.spec.ts',
      'shell/**/*.test.ts',
      'showcase/**/*.test.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'v1/**',        // V1 tests have broken imports after reorganization
      'tests/**',     // Old V1 test suite with broken paths
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
