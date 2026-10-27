import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

const toAgent = (row) => ({
  slug: row.slug,
  name: row.name,
  role: row.role,
  phone: row.phone,
  email: row.email,
  photo: row.photo,
  bio: row.bio,
});

// GET /api/agents — the advisory team, also used as listing agents.
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT slug, name, role, phone, email, photo, bio
         FROM agents
        ORDER BY position, id`,
    );
    res.json({ items: rows.map(toAgent) });
  } catch (error) {
    next(error);
  }
});

export default router;
