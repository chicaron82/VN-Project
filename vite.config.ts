import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  base: './', // Relative paths for GitHub Pages
  publicDir: 'assets',
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
    open: '/index.v2.html',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'src/**/types.ts',
      ],
    },
  },
})
