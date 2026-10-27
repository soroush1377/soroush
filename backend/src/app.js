import express from 'express';
import cors from 'cors';

import propertiesRouter from './routes/properties.js';
import agentsRouter from './routes/agents.js';
import inquiriesRouter from './routes/inquiries.js';
import newsletterRouter from './routes/newsletter.js';

// Cross-origin access is only needed when the API is reached directly on its own
// host port. The default preview wiring is single-origin (the web dev server
// proxies /api), so nothing is allowed unless CORS_ORIGINS names an origin.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  if (allowedOrigins.length > 0) {
    app.use(
      cors({
        origin(origin, callback) {
          // Same-origin and server-to-server requests carry no Origin header.
          if (!origin) return callback(null, true);
          const allowed = allowedOrigins.some((entry) =>
            entry.startsWith('*.') ? origin.endsWith(entry.slice(1)) : entry === origin,
          );
          return callback(null, allowed);
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
      }),
    );
  }

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/properties', propertiesRouter);
  app.use('/api/agents', agentsRouter);
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/newsletter', newsletterRouter);

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
  app.use((err, req, res, next) => {
    console.error('[api] unhandled error', err);
    res.status(500).json({ error: 'Something went wrong' });
  });

  return app;
}
