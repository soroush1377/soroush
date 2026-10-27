import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

const COLUMNS = `
  p.slug, p.name, p.city, p.state, p.country, p.address, p.price, p.price_label,
  p.type, p.status, p.beds, p.baths, p.sqft, p.lot_size, p.year_built, p.parking,
  p.featured, p.summary, p.description, p.features, p.amenities, p.images,
  p.agent_slug, p.listed_on
`;

const toProperty = (row, agent = null) => ({
  slug: row.slug,
  name: row.name,
  city: row.city,
  state: row.state,
  country: row.country,
  address: row.address,
  price: Number(row.price),
  priceLabel: row.price_label,
  type: row.type,
  status: row.status,
  beds: row.beds,
  baths: Number(row.baths),
  sqft: row.sqft,
  lotSize: row.lot_size,
  yearBuilt: row.year_built,
  parking: row.parking,
  featured: row.featured,
  summary: row.summary,
  description: row.description,
  features: row.features,
  amenities: row.amenities,
  images: row.images,
  agentSlug: row.agent_slug,
  listedOn: row.listed_on,
  location: `${row.city}, ${row.state}, ${row.country}`,
  ...(agent ? { agent } : {}),
});

const SORTS = {
  featured: 'p.featured DESC, p.listed_on DESC',
  newest: 'p.listed_on DESC',
  'price-asc': 'p.price ASC',
  'price-desc': 'p.price DESC',
  'beds-desc': 'p.beds DESC, p.price DESC',
  'sqft-desc': 'p.sqft DESC',
};

const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

// GET /api/properties — search, filter and sort the catalogue.
router.get('/', async (req, res, next) => {
  try {
    const { q, location, type, minPrice, maxPrice, beds, baths, sort, featured, limit, offset } =
      req.query;

    const where = [];
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      const i = params.length;
      where.push(
        `(p.name ILIKE $${i} OR p.city ILIKE $${i} OR p.state ILIKE $${i} OR p.address ILIKE $${i} OR p.type ILIKE $${i} OR p.summary ILIKE $${i})`,
      );
    }
    if (location) {
      params.push(location);
      where.push(`(p.city ILIKE $${params.length} OR p.state ILIKE $${params.length})`);
    }
    if (type) {
      params.push(type);
      where.push(`p.type ILIKE $${params.length}`);
    }
    if (toInt(minPrice) !== null) {
      params.push(toInt(minPrice));
      where.push(`p.price >= $${params.length}`);
    }
    if (toInt(maxPrice) !== null) {
      params.push(toInt(maxPrice));
      where.push(`p.price <= $${params.length}`);
    }
    if (toInt(beds) !== null) {
      params.push(toInt(beds));
      where.push(`p.beds >= $${params.length}`);
    }
    const bathsValue = Number.parseFloat(baths);
    if (Number.isFinite(bathsValue)) {
      params.push(bathsValue);
      where.push(`p.baths >= $${params.length}`);
    }
    if (featured === 'true') {
      where.push('p.featured = TRUE');
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const orderSql = SORTS[sort] || SORTS.featured;
    const rowLimit = Math.min(Math.max(toInt(limit) || 24, 1), 60);
    const rowOffset = Math.max(toInt(offset) || 0, 0);

    const [items, total] = await Promise.all([
      query(
        // The casts are required: PostgreSQL cannot infer a type for a parameter
        // used only in LIMIT/OFFSET.
        `SELECT ${COLUMNS} FROM properties p ${whereSql} ORDER BY ${orderSql} LIMIT $${
          params.length + 1
        }::int OFFSET $${params.length + 2}::int`,
        [...params, rowLimit, rowOffset],
      ),
      query(`SELECT COUNT(*)::int AS total FROM properties p ${whereSql}`, params),
    ]);

    res.json({
      items: items.rows.map((row) => toProperty(row)),
      total: total.rows[0].total,
      limit: rowLimit,
      offset: rowOffset,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/facets — options and ranges for the filter bar.
router.get('/facets', async (req, res, next) => {
  try {
    const [locations, types, range] = await Promise.all([
      query('SELECT DISTINCT city, state FROM properties ORDER BY city'),
      query('SELECT DISTINCT type FROM properties ORDER BY type'),
      query('SELECT MIN(price) AS min, MAX(price) AS max, MAX(beds) AS beds, MAX(baths) AS baths FROM properties'),
    ]);

    res.json({
      locations: locations.rows.map((row) => ({
        city: row.city,
        state: row.state,
        label: `${row.city}, ${row.state}`,
      })),
      types: types.rows.map((row) => row.type),
      priceRange: {
        min: Number(range.rows[0].min || 0),
        max: Number(range.rows[0].max || 0),
      },
      maxBeds: Number(range.rows[0].beds || 0),
      maxBaths: Number(range.rows[0].baths || 0),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/:slug — one property with its agent.
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT ${COLUMNS}, a.id AS agent_id, a.slug AS agent_row_slug, a.name AS agent_name,
              a.role AS agent_role, a.phone AS agent_phone, a.email AS agent_email,
              a.photo AS agent_photo, a.bio AS agent_bio
         FROM properties p
         LEFT JOIN agents a ON a.slug = p.agent_slug
        WHERE p.slug = $1`,
      [req.params.slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const row = rows[0];
    const agent = row.agent_id
      ? {
          slug: row.agent_row_slug,
          name: row.agent_name,
          role: row.agent_role,
          phone: row.agent_phone,
          email: row.agent_email,
          photo: row.agent_photo,
          bio: row.agent_bio,
        }
      : null;

    res.json({ property: toProperty(row, agent) });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/:slug/similar — same city or type, current listing excluded.
router.get('/:slug/similar', async (req, res, next) => {
  try {
    const requested = Math.min(Math.max(toInt(req.query.limit) || 3, 1), 6);
    const { rows: source } = await query('SELECT city, type FROM properties WHERE slug = $1', [
      req.params.slug,
    ]);

    if (source.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const { rows } = await query(
      `SELECT ${COLUMNS} FROM properties p
        WHERE p.slug <> $1 AND (p.city = $2 OR p.type = $3)
        ORDER BY (p.city = $2) DESC, p.featured DESC, p.listed_on DESC
        LIMIT $4::int`,
      [req.params.slug, source[0].city, source[0].type, requested],
    );

    res.json({ items: rows.map((row) => toProperty(row)) });
  } catch (error) {
    next(error);
  }
});

export default router;
