import { createApp } from './app.js';
import { pool } from './db.js';

const port = Number(process.env.PORT || 8000);

const app = createApp();

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`[api] listening on http://0.0.0.0:${port}`);
});

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, closing`);
  server.close(() => pool.end().then(() => process.exit(0)));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
