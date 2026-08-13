import { describe, it, expect } from 'vitest';
import { parsePlayerList } from '../../api-server/src/utils/nbt-parser';

describe('parsePlayerList',() => {
it('reads the online count', () => {
 const result = parsePlayerList('There are 2 of a max of 20 players online :Steve, ALex');
 expect(result.online) .toBe(2);
    });

it('Check Count', () => {
    const result = parsePlayerList('There are 0 of a max of 20 players online');
    expect(result.online) .toBe(0);
});

it('Check Player', () => {
    const result = parsePlayerList('There are 0 of a max of 20 players online');
    expect(result.players) .toEqual([]);
});

it('Minimun Online Count', () => {
    const result = parsePlayerList('There are 1 of a max of 100 players online: Steve');
    expect(result.online) .toBe(1);
});

it('Maximum Player', () => {
    const result = parsePlayerList('There are 1 of a max of 100 players online: Steve');
    expect(result.max) .toBe(100);
});

it('Minimun Number of Count', () => {
    const result =parsePlayerList('the server exploded');
    expect(result.online) .toBe (0);
});

it('Minimum Players required', () => {
    const result = parsePlayerList('the parser falls back to safe defaults');
    expect(result.players) .toEqual([]);
});
});