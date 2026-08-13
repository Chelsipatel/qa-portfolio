// A tiny static file server so Playwright can open the demo dashboard over http.
// Playwright starts this automatically (see playwright.config.ts -> webServer).
// You normally never run this by hand.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.static(__dirname));

const PORT = 4321;
app.listen(PORT, () => {
  console.log(`Demo dashboard running at http://localhost:${PORT}`);
});
