/**
 * token.ts - authentication helpers, adapted for learning.
 *
 * PROVENANCE (where this came from):
 * This is based on the REAL token logic in `frontend/src/api.ts` on the
 * platform - specifically `isTokenExpired()` and the UUID check `validateUUID()`.
 *
 * In the real file those functions read the browser's localStorage and the
 * current clock directly, which makes them awkward to test. Here we have made
 * one small, honest change: we PASS IN the values (the expiry time, the current
 * time) as arguments instead of reading them from hidden places.
 *
 * That change is itself a testing lesson: code that receives what it needs as
 * inputs is FAR easier to test than code that reaches out for hidden state.
 * Testers and developers call this "testability".
 */

// The real app refreshes the login token 60 seconds BEFORE it actually expires,
// so a user is never caught mid-action with a dead token.
export const REFRESH_BUFFER_MS = 60 * 1000;

/**
 * Is the access token expired (or about to expire within the refresh buffer)?
 *
 * @param expiryTimestampMs - when the token expires, as a millisecond timestamp
 *                            (or null/undefined if we have no token at all)
 * @param nowMs - the current time as a millisecond timestamp
 * @returns true if we should treat the token as expired
 */
export function isTokenExpired(
  expiryTimestampMs: number | null | undefined,
  nowMs: number
): boolean {
  // No expiry stored means we have no valid token - treat as expired.
  if (expiryTimestampMs == null) return true;
  return nowMs >= expiryTimestampMs - REFRESH_BUFFER_MS;
}

// The exact UUID pattern the real platform uses to reject bad/unsafe server IDs
// (this protects against a class of attack called SSRF).
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Is this string a validly-formatted server ID (UUID)?
 * @param id - the id to check
 */
export function isValidServerId(id: string): boolean {
  return UUID_REGEX.test(id);
}
