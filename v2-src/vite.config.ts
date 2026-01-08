import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@systems': resolve(__dirname, 'src/systems'),
      '@controllers': resolve(__dirname, 'src/controllers'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@content': resolve(__dirname, 'src/content'),
      '@features': resolve(__dirname, 'src/features'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/**/*.test.ts'],
    },
  },
});
