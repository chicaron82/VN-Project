import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './v2/core'),
            '@systems': path.resolve(__dirname, './v2/systems'),
            '@controllers': path.resolve(__dirname, './v2/controllers'),
            '@ui': path.resolve(__dirname, './v2/ui'),
            '@content': path.resolve(__dirname, './v2/content'),
            '@utils': path.resolve(__dirname, './v2/utils')
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
