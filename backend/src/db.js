import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // Fail loudly: without a connection string every query would hang.
  throw new Error('DATABASE_URL is not set');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const query = (text, params) => pool.query(text, params);

export const closePool = () => pool.end();
