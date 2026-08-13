/**
 * Your very first test file. Welcome! 🎉
 *
 * A "unit test" checks one small piece of code (a "unit") in isolation.
 * Here that unit is the `formatUptime` function.
 *
 * Read this file top to bottom - it is written to be read like a story.
 * Guide `automation/02-unit-testing.md` explains every idea in here.
 */

import { describe, it, expect } from 'vitest';
import { formatUptime } from '../src-under-test/formatUptime';

// `describe` groups related tests together. Think of it as a chapter title.
describe('formatUptime', () => {
  // Each `it` is ONE test. Read it as a sentence: "it formats seconds only".
  // The pattern inside every test is Arrange -> Act -> Assert (AAA):
  //   Arrange: set up the input
  //   Act:     call the function
  //   Assert:  check we got what we expected
  it('formats a value under a minute as just seconds', () => {
    const result = formatUptime(59); // Arrange + Act
    expect(result).toBe('59s'); // Assert
  });

  it('rolls seconds up into minutes', () => {
    expect(formatUptime(60)).toBe('1m 0s');
    expect(formatUptime(125)).toBe('2m 5s');
  });

  it('rolls up into hours and days', () => {
    expect(formatUptime(3661)).toBe('1h 1m 1s'); // 1 hour, 1 min, 1 sec
    expect(formatUptime(90061)).toBe('1d 1h 1m 1s'); // 1 day and a bit
  });

  // --- Edge cases: the interesting bit! Bugs love to hide at the "edges". ---

  it('handles the boundary value 0', () => {
    expect(formatUptime(0)).toBe('0s');
  });

  it('ignores extra fractions of a second', () => {
    expect(formatUptime(59.9)).toBe('59s'); // we floor, we do not round up
  });

  // A GOOD tester also checks that bad input is REJECTED, not silently accepted.
  it('refuses negative numbers by throwing an error', () => {
    // When we expect a throw, we wrap the call in an arrow function like this:
    expect(() => formatUptime(-1)).toThrow();
  });
});
