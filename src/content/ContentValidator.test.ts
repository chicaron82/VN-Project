import { describe, it, expect } from 'vitest';
import { ContentValidator } from './ContentValidator';
import migrationScene from './routes/micro_migration_scene.json';

describe('ContentValidator', () => {
    it('should validate a correct scene', () => {
        const scene = {
            id: 'test',
            dialog: [{ speaker: 'me', text: 'hi' }],
            choices: [{ text: 'go', next: 'next' }]
        };
        const result = ContentValidator.validateScene(scene);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should detect missing ID', () => {
        const scene = { dialog: [] };
        const result = ContentValidator.validateScene(scene);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing or invalid "id"');
    });

    it('should detect invalid dialog structure', () => {
        const scene = {
            id: 'test',
            dialog: [{ speaker: 'me' }] // missing text
        };
        const result = ContentValidator.validateScene(scene);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Dialog[0] missing text');
    });

    it('MICRO-MIGRATION: should validate the ported V1 scene', () => {
        const result = ContentValidator.validateScene(migrationScene);

        if (!result.valid) {
            console.error('Migration Scene Errors:', result.errors);
        }

        expect(result.valid).toBe(true);
    });
});
