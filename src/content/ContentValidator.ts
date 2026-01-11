import { GameConfig } from '@core/GameConfig';

/**
 * ContentValidator
 * 
 * Simple runtime validation for content data.
 * Ensures loaded JSON matches Scene interface.
 */
export class ContentValidator {

    static validateScene(data: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data) {
            return { valid: false, errors: ['Data is null or undefined'] };
        }

        // Required fields
        if (typeof data.id !== 'string') {
            errors.push('Missing or invalid "id"');
        }

        // Optional arrays check
        if (data.dialog && !Array.isArray(data.dialog)) {
            errors.push('"dialog" must be an array');
        }

        if (data.choices && !Array.isArray(data.choices)) {
            errors.push('"choices" must be an array');
        }

        // Validate Dialog entries if present
        if (Array.isArray(data.dialog)) {
            data.dialog.forEach((entry: any, index: number) => {
                if (!entry.speaker || typeof entry.speaker !== 'string') {
                    errors.push(`Dialog[${index}] missing speaker`);
                }
                if (!entry.text || typeof entry.text !== 'string') {
                    errors.push(`Dialog[${index}] missing text`);
                }
            });
        }

        // Validate Choices if present
        if (Array.isArray(data.choices)) {
            data.choices.forEach((choice: any, index: number) => {
                if (!choice.text || typeof choice.text !== 'string') {
                    errors.push(`Choice[${index}] missing text`);
                }
                // next can be null, string
                if (choice.next !== null && typeof choice.next !== 'string') {
                    errors.push(`Choice[${index}] invalid next`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
