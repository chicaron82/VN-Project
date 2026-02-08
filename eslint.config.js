import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/**
 * ════════════════════════════════════════════════════════════════
 * ESLint Configuration - UV7 Visual Novel Project
 *
 * TypeScript-first linting with Prettier integration.
 * Enforces type safety, consistent style, and catches common bugs.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */
export default [
  // ── Global ignores ──────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'v1/**',
      'labs/**',
      'scrapers/**',
      'scripts/**',
      '*.js',
      '*.cjs',
      '*.mjs',
      'vite.config.*.ts',
      'vitest.config.*',
    ],
  },

  // ── TypeScript source files ─────────────────────────────────
  {
    files: ['v2/**/*.ts', 'showcase/**/*.ts', 'shared/**/*.ts', 'shell/**/*.ts', 'types/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // ── TypeScript strictness ───────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/consistent-type-imports': ['warn', {
        prefer: 'type-imports',
      }],

      // ── Code quality ────────────────────────────────────────
      'no-console': ['warn', {
        allow: ['warn', 'error', 'info'],
      }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      // ── Off — handled by Prettier ──────────────────────────
      'indent': 'off',
      'semi': 'off',
      'quotes': 'off',
      'no-trailing-spaces': 'off',
      'no-multi-spaces': 'off',
      'no-multiple-empty-lines': 'off',
    },
  },

  // ── Test files — relaxed rules ──────────────────────────────
  {
    files: ['**/*.test.ts', '**/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off',
    },
  },

  // ── Prettier overrides (must be last) ───────────────────────
  prettier,
];
