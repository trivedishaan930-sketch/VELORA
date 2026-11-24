-- VELORA D1 initial schema.
-- Only ASINs and editorial placement are stored permanently.
-- Amazon Product Advertising Content and image URLs are cached for <24 hours.

PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS featured_products (
  asin TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'luggage',
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 100,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_featured_products_active_order
  ON featured_products (is_active, display_order, created_at);
CREATE TABLE IF NOT EXISTS amazon_product_cache (
  asin TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (asin) REFERENCES featured_products(asin) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_amazon_product_cache_expiry
  ON amazon_product_cache (expires_at);
CREATE TABLE IF NOT EXISTS api_rate_limits (
  scope TEXT PRIMARY KEY,
  last_request_at INTEGER NOT NULL
);
