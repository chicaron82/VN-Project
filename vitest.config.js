import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@systems': path.resolve(__dirname, './src/systems'),
            '@controllers': path.resolve(__dirname, './src/controllers'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@content': path.resolve(__dirname, './src/content'),
            '@utils': path.resolve(__dirname, './src/utils')
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.js'],
        exclude: [
            'node_modules/**',
            'timeline_847_failures/**',
            'dist/**'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                'tests/',
                '*.config.js'
            ]
        }
    }
});
