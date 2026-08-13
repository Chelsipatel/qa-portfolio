/**
 * miniActivityApi.ts - a tiny, self-contained API for learning integration testing.
 *
 * PROVENANCE (where this came from):
 * This is a simplified version of the REAL activity-log endpoint on the platform:
 * `api-server/src/routes/activity-routes.ts` -> GET /servers/:id/activity
 *
 * The real one is wired into a huge app with authentication, permissions, and a
 * live CockroachDB database. That is too much to run on a laptop just to learn.
 * So here we keep the SAME SHAPE (an Express route that asks a "store" for logs,
 * clamps the limit, and returns JSON) but shrink it to something you can run in
 * one second with no database.
 *
 * The "store" below stands in for the database. In our integration test we will
 * REPLACE it with a fake one - that is the heart of the lesson: test how the
 * pieces (route + store) work TOGETHER, without needing the real database.
 */

import express, { type Express, type Request, type Response } from 'express';

// The shape of one activity-log entry (simplified).
export interface ActivityLog {
  id: string;
  serverId: string;
  action: string;
  createdAt: string;
}

// The "store" is anything that knows how to fetch logs. The real app's store
// talks to a database; a test can hand us a fake that returns canned data.
export interface ActivityStore {
  getServerLogs(
    serverId: string,
    opts: { limit: number; offset: number }
  ): Promise<ActivityLog[]>;
  getLogCount(serverId: string): Promise<number>;
}

// The platform caps how many logs you can ask for at once, to protect the server.
export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 50;

/**
 * Build a small Express app that serves activity logs from the given store.
 * Passing the store IN (instead of importing a fixed one) is what makes this
 * testable - the test can pass a fake store.
 */
export function createApp(store: ActivityStore): Express {
  const app = express();

  app.get('/servers/:id/activity', async (req: Request, res: Response) => {
    try {
      const serverId = req.params.id;

      // Read the requested limit, fall back to the default, and CLAMP it so
      // nobody can ask for a million rows. This clamping is exactly the kind of
      // rule an integration test should prove works.
      const requestedLimit = parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10);
      const safeLimit = Number.isNaN(requestedLimit)
        ? DEFAULT_LIMIT
        : Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);

      const offset = parseInt(String(req.query.offset ?? 0), 10) || 0;

      const logs = await store.getServerLogs(serverId, { limit: safeLimit, offset });
      const total = await store.getLogCount(serverId);

      res.json({ logs, total, limit: safeLimit, offset });
    } catch {
      res.status(500).json({ error: 'internal_error' });
    }
  });

  return app;
}
