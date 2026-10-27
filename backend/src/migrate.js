// Idempotent schema + data migration. Runs as a one-shot compose service before
// the API starts; re-running it updates the seeded catalogue in place.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { query, closePool } from './db.js';
import { agents } from './data/agents.js';
import { properties } from './data/properties.js';

const here = path.dirname(fileURLToPath(import.meta.url));

const waitForDatabase = async (attempts = 30) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

const seedAgents = async () => {
  for (const [index, agent] of agents.entries()) {
    await query(
      `INSERT INTO agents (slug, name, role, phone, email, photo, bio, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         photo = EXCLUDED.photo,
         bio = EXCLUDED.bio,
         position = EXCLUDED.position`,
      [agent.slug, agent.name, agent.role, agent.phone, agent.email, agent.photo, agent.bio, index],
    );
  }
  console.log(`[migrate] agents upserted: ${agents.length}`);
};

const seedProperties = async () => {
  for (const property of properties) {
    await query(
      `INSERT INTO properties (
         slug, name, city, state, country, address, price, price_label, type, status,
         beds, baths, sqft, lot_size, year_built, parking, featured, summary, description,
         features, amenities, images, agent_slug, listed_on
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
         $11, $12, $13, $14, $15, $16, $17, $18, $19,
         $20, $21, $22, $23, $24
       )
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         country = EXCLUDED.country,
         address = EXCLUDED.address,
         price = EXCLUDED.price,
         price_label = EXCLUDED.price_label,
         type = EXCLUDED.type,
         status = EXCLUDED.status,
         beds = EXCLUDED.beds,
         baths = EXCLUDED.baths,
         sqft = EXCLUDED.sqft,
         lot_size = EXCLUDED.lot_size,
         year_built = EXCLUDED.year_built,
         parking = EXCLUDED.parking,
         featured = EXCLUDED.featured,
         summary = EXCLUDED.summary,
         description = EXCLUDED.description,
         features = EXCLUDED.features,
         amenities = EXCLUDED.amenities,
         images = EXCLUDED.images,
         agent_slug = EXCLUDED.agent_slug,
         listed_on = EXCLUDED.listed_on`,
      [
        property.slug,
        property.name,
        property.city,
        property.state,
        property.country,
        property.address,
        property.price,
        property.priceLabel,
        property.type,
        property.status,
        property.beds,
        property.baths,
        property.sqft,
        property.lotSize,
        property.yearBuilt,
        property.parking,
        property.featured,
        property.summary,
        JSON.stringify(property.description),
        JSON.stringify(property.features),
        JSON.stringify(property.amenities),
        JSON.stringify(property.images),
        property.agentSlug,
        property.listedOn,
      ],
    );
  }
  console.log(`[migrate] properties upserted: ${properties.length}`);
};

const main = async () => {
  await waitForDatabase();
  const schema = await readFile(path.join(here, 'schema.sql'), 'utf8');
  await query(schema);
  console.log('[migrate] schema applied');
  await seedAgents();
  await seedProperties();
  console.log('[migrate] done');
};

main()
  .then(() => closePool())
  .catch(async (error) => {
    console.error('[migrate] failed', error);
    await closePool().catch(() => {});
    process.exit(1);
  });
