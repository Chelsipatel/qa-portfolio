import { describe, it, expect } from 'vitest';
import { validateServerName, clampMaxPlayers, isValidSubdomain } from '../src-under-test/validators';

describe('validateServerName', () => {
  it.each([
    { name: 'accepts a normal name', input: 'My Server', valid: true },
    { name: 'rejects an empty name', input: '', valid: false },
    { name: 'accepts 1 character (min boundary)', input: 'a', valid: true },
    { name: 'accepts 64 characters (max boundary)', input: 'a'.repeat(64), valid: true },
    { name: 'rejects 65 characters (BUG-002)', input: 'a'.repeat(65), valid: false },
    { name: 'accepts a name containing spaces', input: 'Has only spaces', valid: true },
    { name: 'accepts surrounding whitespace', input: ' My Server ', valid: true },
    { name: 'accepts a script tag as text', input: '<script>alert(1)</script', valid: true },
  ])('$name', ({ input, valid }) => {
    expect(validateServerName(input).valid).toBe(valid);
  });
});

describe('clampMaxPlayers', () => {
  it.each([
    { name: 'keeps a normal value', input: 20, expected: 20 },
    { name: 'keeps a mid-range value', input: 50, expected: 50 },
    { name: 'keeps the minimum of 1', input: 1, expected: 1 },
    { name: 'keeps the maximum of 1000', input: 1000, expected: 1000 },
    { name: 'clamps 0 up to 1', input: 0, expected: 1 },
    { name: 'clamps a negative up to 1', input: -5, expected: 1 },
    { name: 'clamps a negative decimal up to 1', input: -5.9, expected: 1 },
    { name: 'clamps a too-high value to 1000', input: 9999, expected: 1000 },
    { name: 'clamps a very large number to 1000', input: 1000000, expected: 1000 },
    { name: 'floors a decimal', input: 5.9, expected: 5 },
    { name: 'falls back to 20 for a string', input: 'abc', expected: 20 },
    { name: 'falls back to 20 for NaN', input: NaN, expected: 20 },
    { name: 'falls back to 20 for Infinity', input: Infinity, expected: 20 },
  ])('$name', ({ input, expected }) => {
    expect(clampMaxPlayers(input)).toBe(expected);
  });
});

describe('isValidSubdomain', () => {
  it.each([
    { name: 'accepts a normal address', input: 'myserver', valid: true },
    { name: 'accepts 3 characters (min boundary)', input: 'abc', valid: true },
    { name: 'accepts digits', input: 'server123', valid: true },
    { name: 'accepts hyphens in the middle', input: 'server-name-1', valid: true },
    { name: 'rejects 2 characters', input: 'ab', valid: false },
    { name: 'rejects 1 character', input: 'a', valid: false },
    { name: 'rejects mixed case', input: 'MyServer', valid: false },
    { name: 'rejects all capitals', input: 'UPPER', valid: false },
    { name: 'rejects a leading hyphen', input: '-abc', valid: false },
    { name: 'rejects a leading hyphen (2)', input: '-start', valid: false },
    { name: 'rejects a trailing hyphen', input: 'abc-', valid: false },
    { name: 'rejects an underscore', input: 'my_server', valid: false },
  ])('$name', ({ input, valid }) => {
    expect(isValidSubdomain(input)).toBe(valid);
  });
});
