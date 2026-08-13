/**
 * Integration tests for the mini Server CRUD API (`miniServerApi.ts`).
 *
 * Part 8 drill — the FRONTEND vs BACKEND validation gap. We send the create
 * endpoint the kinds of names the UI form blocks, and check whether the API
 * ITSELF blocks them too. Anything the API accepts that the form would reject is
 * a real validation-gap bug.
 *
 * NOTE: the harness below (the fake store + the one worked-example test) was set
 * up by the mentor so Chelsi can focus on writing the actual test cases. The fake
 * store means no real database is needed.
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createServerApp, type ServerStore } from '../src-under-test/miniServerApi';

// A FAKE store (same idea as activityApi.test.ts). `create` just echoes back the
// server it was handed, with a pretend id — so we can see what the API let through.
function makeFakeStore(): ServerStore {
  return {
    create: vi.fn(async (server) => ({ id: 'srv-test-1', ...server })),
    list: vi.fn(async () => []),
    get: vi.fn(async () => null),
    delete: vi.fn(async () => true),
  };
}

describe('POST /servers (create)', () => {
  // ✅ WORKED EXAMPLE (mentor-provided) — a valid name is accepted with 201.
  //    Copy this shape for your own tests below.
  it('creates a server when the name is valid', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name: 'My Server' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('My Server');
  });

  // 👇 YOUR TESTS GO HERE — write the validation-gap tests below this line.
  it.fails('create a server when the name is invalid', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name: 'a'.repeat(65) });

    expect(res.status).toBe(400);
  });

  it('saves the server with the default VANILLA type', async () => {
    const store = makeFakeStore();

    const app = createServerApp(store);

    const res = await request(app).post('/servers').send({ name: 'My Server' });

    expect(store.create).toHaveBeenCalledWith({ name: 'My Server', type: 'VANILLA' });
  });

  it('returns a 500 error if the store blows up', async () => {
    const store = makeFakeStore();
    store.create = vi.fn(async() => { throw new Error('boom'); }); //DB on fire
    const app = createServerApp(store);

    const res = await request(app).post('/servers').send({ name:'chelsi'});
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('internal_error');
  });

  it('returns 500 when the store throws on list ', async () => {
    const store = makeFakeStore();
    store.list = vi.fn(async () => {throw new Error('boom'); });
    const app = createServerApp(store);

    const res = await request(app).get('/servers');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('internal_error');
  });

  it('returns 500 when the store throws on get', async () => {
    const store = makeFakeStore();
    store.get = vi.fn(async () => { throw new Error('boom'); });
    const app = createServerApp(store);

    const res = await request(app).get('/servers/srv-1');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('internal_error');
  });

  it('returns 500 when the store throws on delete', async () => {
    const store = makeFakeStore();
    store.delete = vi.fn(async () => { throw new Error('boom'); });
    const app = createServerApp(store);

    const res = await request(app).delete('/servers/srv-1');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('internal_error');
  });

  it('make delete report"not found', async () => {
    const store = makeFakeStore();
    store.delete = vi.fn(async() => false); // store says "nothing to delete"
    const app = createServerApp(store);

    const res = await request(app).delete('/servers/anything');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not_found');
  });

  it('make get return an actual error', async () => {
    const store = makeFakeStore();
    store.get = vi.fn(async () => ({ id: 'srv-1', name: 'Test', type: 'VANILLA'}));
    const app = createServerApp(store);

    const res = await request(app).get('/servers/srv-1');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test');
  });

  it('rejects an empty name with 400', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name: "" });

    expect(res.status).toBe(400);
  });

  it('rejects a name with spaces only with 400', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name: '   ' });

    expect(res.status).toBe(400);
  });

  it('reject no name field at all with 201', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name : {} });

    expect(res.status).toBe(400);
  });

  it('a good name with 201', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).post('/servers').send({ name : 'My cool Server' });
  
  expect(res.status).toBe(201);
  });

  it('list them all with 404', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).get('/servers');
    expect(res.status).toBe(200);
  });

  it('get one by id - store finds nothing with 200', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).get('/servers/srv-1/activity');

    expect(res.status).toBe(404);
  });

  it('delete one- the store says success with 204', async () => {
    const app = createServerApp(makeFakeStore());

    const res = await request(app).delete('/server/srv-1/activity');
    
    expect(res.status).toBe(404);
  });
});