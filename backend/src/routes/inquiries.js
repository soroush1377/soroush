import { Router } from 'express';
import { query } from '../db.js';
import { asString, isEmail, minLength } from '../lib/validate.js';

const router = Router();

const KINDS = new Set(['contact', 'viewing', 'general']);

// POST /api/inquiries — contact an agent, request a viewing, or send a general enquiry.
router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const kind = KINDS.has(body.kind) ? body.kind : 'general';
    const name = asString(body.name);
    const email = asString(body.email);
    const phone = asString(body.phone);
    const message = asString(body.message);
    const propertySlug = asString(body.propertySlug) || null;
    const preferredDate = asString(body.preferredDate) || null;
    const preferredTime = asString(body.preferredTime) || null;

    const fields = {};
    if (!minLength(name, 2)) fields.name = 'Please enter your name';
    if (!isEmail(email)) fields.email = 'Please enter a valid email address';
    if (kind === 'viewing' && !preferredDate) fields.preferredDate = 'Choose a preferred date';
    if (kind !== 'viewing' && !minLength(message, 10)) {
      fields.message = 'Please add a short message (10 characters or more)';
    }

    if (Object.keys(fields).length > 0) {
      return res.status(400).json({ error: 'Please check the highlighted fields', fields });
    }

    const { rows } = await query(
      `INSERT INTO inquiries (kind, property_slug, name, email, phone, message, preferred_date, preferred_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [kind, propertySlug, name, email, phone || null, message || null, preferredDate, preferredTime],
    );

    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    next(error);
  }
});

export default router;
