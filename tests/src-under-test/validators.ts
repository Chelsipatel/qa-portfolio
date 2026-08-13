/**
 * validators.ts - input-validation helpers for the practice drills.
 *
 * PROVENANCE: these mirror the REAL rules the platform enforces:
 * - Server name (displayName): 1-64 characters, not blank
 *   (from the operator CRD: spec.displayName MinLength=1, MaxLength=64 — the exact
 *    rule behind BUG-002).
 * - Subdomain: DNS-safe, 3-63 chars, lowercase letters/numbers/hyphens, no leading
 *   or trailing hyphen (from the CRD: spec.subdomain pattern).
 * - Max players: a positive whole number within a sensible range (the field behind
 *   BUG-006).
 *
 * These are CORRECT implementations. Your job in the drills is to write LOTS of
 * tests that prove they behave correctly at every edge — and to write the
 * regression tests that would have caught BUG-002 and BUG-006.
 */

export const NAME_MIN = 1;
export const NAME_MAX = 64;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a server name: must be 1-64 characters and not blank (whitespace-only
 * does not count as a real name).
 */
export function validateServerName(name: unknown): ValidationResult {
  if (typeof name !== 'string') {
    return { valid: false, error: 'name must be text' };
  }
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN) {
    return { valid: false, error: 'name is required' };
  }
  if (name.length > NAME_MAX) {
    return { valid: false, error: `name must be ${NAME_MAX} characters or less` };
  }
  return { valid: true };
}

export const PLAYERS_MIN = 1;
export const PLAYERS_MAX = 1000;

/**
 * Clamp a max-players value into the allowed range. Non-numbers / NaN fall back to
 * a safe default of 20. Decimals are floored.
 */
export function clampMaxPlayers(value: unknown): number {
  const n = typeof value === 'number' ? value : parseInt(String(value), 10);
  if (!Number.isFinite(n)) return 20;
  const floored = Math.floor(n);
  return Math.min(Math.max(floored, PLAYERS_MIN), PLAYERS_MAX);
}

// The real DNS rule from the CRD: start & end alphanumeric, hyphens allowed in the
// middle, total length 3-63.
const SUBDOMAIN_REGEX = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

/**
 * Is this a valid, DNS-safe subdomain? (3-63 chars, lowercase, no leading/trailing
 * hyphen.)
 */
export function isValidSubdomain(sub: unknown): boolean {
  if (typeof sub !== 'string') return false;
  return SUBDOMAIN_REGEX.test(sub);
}
