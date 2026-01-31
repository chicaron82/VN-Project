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
        testTimeout: 5000,
        hookTimeout: 5000,
        setupFiles: ['./tests/setup.js'],
        include: ['v2/**/*.test.ts', 'tests/**/*.test.ts', 'shell/**/*.test.ts', 'showcase/**/*.test.ts', 'landing/**/*.test.ts'],
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
