/**
 * Unit tests for the auth token helpers.
 *
 * This lesson adds one powerful idea: testing code that depends on TIME.
 * If a function looked at the real clock, our test would pass today and fail
 * tomorrow - useless! Because `isTokenExpired` takes the current time as an
 * argument, we can hand it any moment we like and test it precisely.
 */

import { describe, it, expect } from 'vitest';
import { isTokenExpired, isValidServerId, REFRESH_BUFFER_MS } from '../src-under-test/token';

describe('isTokenExpired', () => {
  // A fixed pretend "now". Using a constant makes the maths easy to follow.
  const NOW = 1_000_000_000_000; // some millisecond timestamp

  it('says a token far in the future is NOT expired', () => {
    const expiry = NOW + 10 * 60 * 1000; // expires in 10 minutes
    expect(isTokenExpired(expiry, NOW)).toBe(false);
  });

  it('says a token already in the past IS expired', () => {
    const expiry = NOW - 1000; // expired 1 second ago
    expect(isTokenExpired(expiry, NOW)).toBe(true);
  });

  it('treats a missing token as expired', () => {
    expect(isTokenExpired(null, NOW)).toBe(true);
    expect(isTokenExpired(undefined, NOW)).toBe(true);
  });

  // --- The tricky boundary: the 60-second "refresh buffer". ---
  // The token should be considered expired a little EARLY, so the app can
  // refresh it before the user notices.
  it('considers the token expired once inside the 60s refresh buffer', () => {
    // Token expires in exactly 59 seconds - that is INSIDE the 60s buffer,
    // so we should already treat it as expired.
    const expiry = NOW + 59 * 1000;
    expect(isTokenExpired(expiry, NOW)).toBe(true);
  });

  it('is still valid one millisecond before the buffer begins', () => {
    // Expiry is 1ms more than the buffer away -> just barely still valid.
    const expiry = NOW + REFRESH_BUFFER_MS + 1;
    expect(isTokenExpired(expiry, NOW)).toBe(false);
  });

  it('in exactly 60 seconds', () => {
    const expiry = NOW + REFRESH_BUFFER_MS;
    expect(isTokenExpired(expiry, NOW)).toBe(true);
  });

  it('in 60 seconds + 1ms', () => {
    const expiry = NOW + REFRESH_BUFFER_MS +1;
    expect(isTokenExpired(expiry, NOW)).toBe(false);
  });

  it('in 59.99 seconds', () => {
    const expiry = NOW + REFRESH_BUFFER_MS -1;
    expect(isTokenExpired(expiry, NOW)).toBe(true);
  });

  it('right now', () => {
    const expiry = NOW;
    expect(isTokenExpired(expiry, NOW)).toBe(true);
  });
});

describe('isValidServerId', () => {
  it('accepts a well-formed UUID', () => {
    expect(isValidServerId('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
  });

  it('rejects obviously bad ids', () => {
    expect(isValidServerId('')).toBe(false);
    expect(isValidServerId('not-a-uuid')).toBe(false);
    expect(isValidServerId('../../etc/passwd')).toBe(false); // an attack attempt
    expect(isValidServerId('123e4567e89b12d3a456426614174000')).toBe(false); // no dashes
  });

  it('a real UUID', () => {
    expect(isValidServerId('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
  });

  it('the same UUID in uppercase', () => {
    expect(isValidServerId('123e4567-E89B-12D3-A456-426614174000')).toBe(true);
  });

  it('no dashes', () => {
    expect(isValidServerId('123e4567e89b12d3a456426614174000')).toBe(false);
  });

  it('a SQL-injection attempt', () => {
    expect(isValidServerId('"; DROP TABLE servers;--')).toBe(false);
  });

  it('a path-traversal attack', () => {
    expect(isValidServerId('../../etc/passwd')).toBe(false);
  });

  it('empty string', () => {
    expect(isValidServerId('')).toBe(false);
  });
});
