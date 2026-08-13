/**
 * Integration test: do the ROUTE and the STORE work correctly TOGETHER?
 *
 * A unit test checks one function alone. An integration test checks that
 * several pieces cooperate. Here we start the real Express route from
 * `miniActivityApi.ts`, hand it a FAKE store (so we need no database), and make
 * real HTTP requests to it using a tool called `supertest`.
 *
 * What we are really proving: given a request, does the app ask the store
 * correctly, clamp the limit, and shape the JSON response the way we promised?
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp, type ActivityStore, type ActivityLog } from '../src-under-test/miniActivityApi';

// A helper that builds a FAKE store for each test. `vi.fn()` creates a
// "spy" function - a stand-in we can inspect afterwards ("was it called? with
// what arguments?"). This is called mocking.
function makeFakeStore(logs: ActivityLog[]): ActivityStore {
  return {
    getServerLogs: vi.fn(async () => logs),
    getLogCount: vi.fn(async () => logs.length),
  };
}

const sampleLogs: ActivityLog[] = [
  { id: '1', serverId: 'srv-1', action: 'server.start', createdAt: '2026-01-01T00:00:00Z' },
  { id: '2', serverId: 'srv-1', action: 'server.stop', createdAt: '2026-01-01T01:00:00Z' },
];

describe('GET /servers/:id/activity', () => {
  it('returns the logs from the store as JSON', async () => {
    const app = createApp(makeFakeStore(sampleLogs));

    const response = await request(app).get('/servers/srv-1/activity');

    expect(response.status).toBe(200);
    expect(response.body.logs).toHaveLength(2);
    expect(response.body.total).toBe(2);
    expect(response.body.logs[0].action).toBe('server.start');
  });

  it('uses the default limit of 50 when none is given', async () => {
    const store = makeFakeStore(sampleLogs);
    const app = createApp(store);

    await request(app).get('/servers/srv-1/activity');

    // We can inspect our fake: was the store asked for a limit of 50?
    expect(store.getServerLogs).toHaveBeenCalledWith('srv-1', {
      limit: 50,
      offset: 0,
    });
  });

  it('CLAMPS a huge limit down to the maximum of 100', async () => {
    const store = makeFakeStore(sampleLogs);
    const app = createApp(store);

    // A user (or attacker) asks for 99999 rows...
    await request(app).get('/servers/srv-1/activity?limit=99999');

    // ...but the app must protect itself and ask the store for only 100.
    expect(store.getServerLogs).toHaveBeenCalledWith('srv-1', {
      limit: 100,
      offset: 0,
    });
  });

  it('returns a 500 error if the store blows up', async () => {
    // Arrange a store that fails, to prove the error path is handled.
    const brokenStore: ActivityStore = {
      getServerLogs: vi.fn(async () => {
        throw new Error('database on fire');
      }),
      getLogCount: vi.fn(async () => 0),
    };
    const app = createApp(brokenStore);

    const response = await request(app).get('/servers/srv-1/activity');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('internal_error');
  });
});
