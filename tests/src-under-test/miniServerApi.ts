/**
 * miniServerApi.ts - a small Server CRUD API for the backend/integration drills.
 *
 * PROVENANCE: a shrunk-down stand-in for the real server endpoints in
 * `api-server/src/index.ts` (create / list / get / delete a MinecraftServer),
 * backed by an injectable store so tests need no real database or cluster.
 *
 * Use it for Drill 9 (integration) and Part 8 (the frontend-vs-backend validation
 * gap). Hint for Part 8: test this API DIRECTLY with the kinds of names the UI
 * blocks (empty, spaces-only, very long) and check what the API itself accepts.
 * Not everything the UI stops is stopped here...
 */

import express, { type Express, type Request, type Response } from 'express';

export interface ServerRecord {
  id: string;
  name: string;
  type: string;
}

export interface ServerStore {
  create(server: Omit<ServerRecord, 'id'>): Promise<ServerRecord>;
  list(): Promise<ServerRecord[]>;
  get(id: string): Promise<ServerRecord | null>;
  delete(id: string): Promise<boolean>;
}

export function createServerApp(store: ServerStore): Express {
  const app = express();
  app.use(express.json());

  // CREATE
  app.post('/servers', async (req: Request, res: Response) => {
    try {
      const { name, type } = req.body ?? {};

      // Validation: a name is required.
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'name is required' });

      }

      const created = await store.create({ name, type: type ?? 'VANILLA' });
      return res.status(201).json(created);
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  // LIST
  app.get('/servers', async (_req: Request, res: Response) => {
    try {
      const servers = await store.list();
      return res.json({ servers, total: servers.length });
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  // GET by id
  app.get('/servers/:id', async (req: Request, res: Response) => {
    try {
      const server = await store.get(req.params.id);
      if (!server) return res.status(404).json({ error: 'not_found' });
      return res.json(server);
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  // DELETE
  app.delete('/servers/:id', async (req: Request, res: Response) => {
    try {
      const ok = await store.delete(req.params.id);
      if (!ok) return res.status(404).json({ error: 'not_found' });
      return res.status(204).send();
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  return app;
}
