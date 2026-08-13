// live-server.mjs — runs a REAL, live version of the mini Server API for Postman practice.
//
// It mirrors qa-learning/src-under-test/miniServerApi.ts (the same API Chelsi wrote
// Supertest tests for) — INCLUDING its BUG-002 validation gap (it checks the name is
// present/non-blank, but NOT its length). Wrapped with a simple Bearer-token auth gate
// so she can practise the Authorization header on a real protected endpoint.
//
// Run:  node live-server.mjs        → serves at http://localhost:4000
import express from 'express';

const TOKEN = 'chelsi-secret-token';
const PORT = 4000;

// in-memory "database"
const db = [];
let counter = 1;

const app = express();
app.use(express.json());

// --- /health needs no auth (like a real API's public health check) ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mini-server-api', time: 'live' });
});

// --- everything below requires a Bearer token ---
app.use((req, res, next) => {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// CREATE — NOTE: checks name is present + non-blank, but NOT length (the BUG-002 gap!)
app.post('/servers', (req, res) => {
  const { name, type } = req.body ?? {};
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' });
  }
  const created = { id: `srv-${counter++}`, name, type: type ?? 'VANILLA' };
  db.push(created);
  return res.status(201).json(created);
});

// LIST
app.get('/servers', (_req, res) => res.json({ servers: db, total: db.length }));

// GET by id
app.get('/servers/:id', (req, res) => {
  const server = db.find((s) => s.id === req.params.id);
  if (!server) return res.status(404).json({ error: 'not_found' });
  return res.json(server);
});

// DELETE
app.delete('/servers/:id', (req, res) => {
  const i = db.findIndex((s) => s.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'not_found' });
  db.splice(i, 1);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`\n✅ Live API running at http://localhost:${PORT}`);
  console.log(`   Token: Bearer ${TOKEN}`);
  console.log(`   Try:   GET /health (no auth)  ·  GET/POST /servers (needs token)\n`);
});
