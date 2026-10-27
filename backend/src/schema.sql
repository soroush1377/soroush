-- Horizon Properties schema. Applied by `npm run migrate`, which is idempotent.

CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  photo TEXT NOT NULL,
  bio TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  price BIGINT NOT NULL,
  price_label TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  beds INTEGER NOT NULL,
  baths NUMERIC(4, 1) NOT NULL,
  sqft INTEGER NOT NULL,
  lot_size TEXT NOT NULL,
  year_built INTEGER NOT NULL,
  parking INTEGER NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  summary TEXT NOT NULL,
  description JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  agent_slug TEXT NOT NULL,
  listed_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS properties_featured_idx ON properties (featured);
CREATE INDEX IF NOT EXISTS properties_city_idx ON properties (city);
CREATE INDEX IF NOT EXISTS properties_type_idx ON properties (type);
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties (price);
CREATE INDEX IF NOT EXISTS properties_listed_on_idx ON properties (listed_on DESC);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  property_slug TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
