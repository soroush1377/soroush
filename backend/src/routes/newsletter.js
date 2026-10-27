import { Router } from 'express';
import { query } from '../db.js';
import { asString, isEmail } from '../lib/validate.js';

const router = Router();

// POST /api/newsletter — subscribe an email address to the market report.
router.post('/', async (req, res, next) => {
  try {
    const email = asString((req.body || {}).email);

    if (!isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address', fields: { email: 'Invalid email' } });
    }

    await query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase()],
    );

    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
