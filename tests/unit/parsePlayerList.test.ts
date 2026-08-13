/**
 * 🌟 THE BIG ONE: this test runs against the REAL platform code.
 *
 * The import below reaches straight into the actual api-server source and pulls
 * out `parsePlayerList` - the very function the live platform uses to read how
 * many players are online from a Minecraft server's response.
 *
 * We did not copy or change it. We are testing the real thing. When you write a
 * test like this, you can honestly say on your CV: "I wrote automated tests for
 * production code in a real Kubernetes-based platform." Because you did. 💪
 */

import { describe, it, expect } from 'vitest';
import { parsePlayerList } from '../../api-server/src/utils/nbt-parser';

describe('parsePlayerList (real platform code)', () => {
  it('reads the online count, max count, and player names', () => {
    const response = 'There are 2 of a max of 20 players online: Steve, Alex';
    const result = parsePlayerList(response);

    expect(result.online).toBe(2);
    expect(result.max).toBe(20);
    expect(result.players).toEqual(['Steve', 'Alex']);
  });

  it('handles an empty server (nobody online)', () => {
    const response = 'There are 0 of a max of 20 players online:';
    const result = parsePlayerList(response);

    expect(result.online).toBe(0);
    expect(result.players).toEqual([]); // no names -> empty list
  });

  it('falls back to safe defaults when the text makes no sense', () => {
    // What SHOULD happen if the server returns gibberish? Reading the code, it
    // returns online: 0, max: 20, players: []. A test locks that behaviour in.
    const result = parsePlayerList('the server exploded');

    expect(result.online).toBe(0);
    expect(result.max).toBe(20);
    expect(result.players).toEqual([]);
  });

  it('trims whitespace around player names', () => {
    const response = 'There are 3 of a max of 20 players online:  Steve ,  Alex , Bob ';
    const result = parsePlayerList(response);

    expect(result.players).toEqual(['Steve', 'Alex', 'Bob']);
  });
});
