import { describe, it, expect } from 'vitest';
import { validateServerName } from '../src-under-test/validators';

describe('validateServerName', () => {
    it('accepts a normal valid name', () => {
        const result = validateServerName('My Server');
        expect(result.valid).toBe(true);
    });
    it('rejects a name that is only spaces', () => {
        const result = validateServerName('  ');
        expect(result.valid).toBe(false);
    });
    it('accepts a name of exactly 64 characters', () => {
        const result = validateServerName('a'.repeat(64)); // 'a' repeated 64 times
        expect(result.valid).toBe(true); 
    });
});