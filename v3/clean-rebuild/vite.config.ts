import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../v2/core'),
      '@systems': path.resolve(__dirname, '../v2/systems'),
      '@controllers': path.resolve(__dirname, '../v2/controllers'),
      '@ui': path.resolve(__dirname, '../v2/ui'),
      '@content': path.resolve(__dirname, '../v2/content'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3848,
    open: true,
  },
});
