import { describe, it, expect } from 'vitest';
import { validateServerName, clampMaxPlayers, isValidSubdomain } from '../src-under-test/validators';

describe('validateServerName', () => {
  it('accepts a normal valid name', () => {
    const result = validateServerName('My Server');
    expect(result.valid).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = validateServerName('');
    expect(result.valid).toBe(false);
  });

  it('rejects a name longer than 64 characters', () => {
    const result = validateServerName('a'.repeat(65)); // BUG-002 regression!
    expect(result.valid).toBe(false);
  });

  it('Just 1 character', () => {
    const result = validateServerName('a');
    expect(result.valid).toBe(true);
  });

  it('Repeated 64 times', () => {
    const result = validateServerName('a'.repeat(64));
    expect(result.valid).toBe(true);
  });

  it('Repeated 65 times', () => {
    const result = validateServerName('a');
    expect(result.valid).toBe(true);
  });

  it('"  "', () => {
    const result = validateServerName('Has only spaces');
    expect(result.valid).toBe(true);
  });

  it('real name, but with spaces around it', () => {
    const result = validateServerName(' My Server ');
    expect(result.valid).toBe(true);
  });

  it(' Written Code', () => {
    const result = validateServerName('<script>alert(1)</script');
    expect(result.valid).toBe(true);
  });
});

describe('clampMaxPlayers', () => {
  it('keeps a normal value unchanged', () => {
    expect(clampMaxPlayers(20)).toBe(20);
  });

  it('clamps a too-low value up to 1', () => {
    expect(clampMaxPlayers(0)).toBe(1);
  });

  it('clamps a too-high value down to 1000', () => {
    expect(clampMaxPlayers(9999)).toBe(1000);
  });

  it('floors a decimal', () => {
    expect(clampMaxPlayers(5.9)).toBe(5);
  });

  it('falls back to 20 for non-numbers', () => {
    expect(clampMaxPlayers('abc')).toBe(20);
  });

  it('clamps a negative number up to 1', () => {
    expect(clampMaxPlayers(-5)).toBe(1);
  });

  it('keeps the max of 1000', () => {
    expect(clampMaxPlayers(1000)).toBe(1000); // right on the boundary
  });
  
  it('the minimum', () => {
    expect(clampMaxPlayers(1)).toBe(1);
  });

  it('Not a Number', () => {
    expect(clampMaxPlayers(NaN)).toBe(20);
  });

  it('infinity', () => {
    expect(clampMaxPlayers(Infinity)).toBe(20);
  });

  it('A million', () => {
    expect(clampMaxPlayers(1000000)).toBe(1000);
  });

  it('a string, not a number', () => {
    expect(clampMaxPlayers(50)).toBe(50);
  });

  it('negative decimal', () => {
    expect(clampMaxPlayers(-5.9)).toBe(1);
  });
});

describe('isValidSubdomain', () => {
  it('accepts a normal valid address', () => {
    expect( isValidSubdomain('myserver')) .toBe( true );
  });

  it('Rule says at least 3+ characters', () =>{
    expect(isValidSubdomain('ab')) .toBe( false );
  });

  it('has lowercase letters only', () => {
    expect(isValidSubdomain('MyServer')) .toBe( false );
  });

  it('starts without any leading hyphen', () => {
    expect(isValidSubdomain('-abc')) .toBe( false );
  });

  it('exactly 3 characters', () => {
    expect( isValidSubdomain('abc')) .toBe( true );
  });

  it('ends with a hyphen', () =>{
    expect(isValidSubdomain('abc-')) .toBe( false );
  });

  it('has numbers in it', () => {
    expect(isValidSubdomain('server123')) .toBe( true );
  });

  it('has an underscore (_)', () => {
    expect(isValidSubdomain('my_server')) .toBe( false );
  });

  it('just 1 character (way under the min of 3)', () => {
    expect( isValidSubdomain('a')) .toBe( false );
  });

  it('lowercase, hyphen in the middle, a number', () =>{
    expect(isValidSubdomain('server-name-1')) .toBe( true );
  });

  it('all capitals', () => {
    expect(isValidSubdomain('UPPER')) .toBe( false );
  });

  it('begins with a hyphen', () => {
    expect(isValidSubdomain('-start')) .toBe( false );
  });
});
