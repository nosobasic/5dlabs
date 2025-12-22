-- Migration: Add Stripe Webhook Support
-- Modifies existing tables to support Stripe Payment Link integration
-- All changes are additive and non-breaking

-- 1. Make orders.user_id nullable (for guest checkout support)
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add license_type to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS license_type TEXT;

-- 3. Add user_id and beat_id to licenses table (keep order_item_id for compatibility)
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS beat_id UUID REFERENCES beats(id);

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_beat_id ON licenses(beat_id);
CREATE INDEX IF NOT EXISTS idx_order_items_license_type ON order_items(license_type);

