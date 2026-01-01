-- Supabase Schema for Beat Store
-- Uses gen_random_uuid() which is built-in and doesn't require extensions
-- If you prefer uuid_generate_v4(), enable the extension first:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS beats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    bpm INTEGER,
    key TEXT,
    genre TEXT,
    price_cents INTEGER NOT NULL,
    license_type TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_checkout_id TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    total_cents INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    beat_id UUID NOT NULL REFERENCES beats(id),
    price_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id),
    license_type TEXT NOT NULL,
    license_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    beat_id UUID NOT NULL REFERENCES beats(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    download_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables (idempotent - safe to run multiple times)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for beats table
DROP POLICY IF EXISTS "Anyone can view active beats" ON beats;
CREATE POLICY "Anyone can view active beats"
    ON beats FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can view all beats" ON beats;
CREATE POLICY "Authenticated users can view all beats"
    ON beats FOR SELECT
    TO authenticated
    USING (true);

-- Note: INSERT/UPDATE/DELETE on beats should be done via service role
-- or create admin policies if you have an admin role system

-- RLS Policies for orders table
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for order_items table
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
CREATE POLICY "Users can create own order items"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- RLS Policies for licenses table
DROP POLICY IF EXISTS "Users can view own licenses" ON licenses;
CREATE POLICY "Users can view own licenses"
    ON licenses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM order_items
            JOIN orders ON orders.id = order_items.order_id
            WHERE order_items.id = licenses.order_item_id
            AND orders.user_id = auth.uid()
        )
    );

-- Note: INSERT on licenses should be done via service role after payment confirmation

-- RLS Policies for downloads table
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
CREATE POLICY "Users can view own downloads"
    ON downloads FOR SELECT
    USING (auth.uid() = user_id);

-- Note: INSERT on downloads should be done via service role after purchase

-- RLS Policies for webhook_events table
DROP POLICY IF EXISTS "Authenticated users can view webhook events" ON webhook_events;
CREATE POLICY "Authenticated users can view webhook events"
    ON webhook_events FOR SELECT
    TO authenticated
    USING (true);

-- Note: INSERT/UPDATE on webhook_events should be done via service role
-- from your webhook handlers

-- Add indexes for better query performance (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_beat_id ON order_items(beat_id);
CREATE INDEX IF NOT EXISTS idx_licenses_order_item_id ON licenses(order_item_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_beat_id ON downloads(beat_id);
CREATE INDEX IF NOT EXISTS idx_downloads_order_id ON downloads(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================
-- These policies control access to the 'beats' storage bucket
-- Run these after creating the bucket in Supabase Dashboard: Storage > New bucket > Name: "beats" > Public: Yes

-- Drop existing storage policies if they exist (idempotent - safe to run multiple times)
DROP POLICY IF EXISTS "Allow public file uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public file reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated file uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated file updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated file deletes" ON storage.objects;

-- Policy 1: Allow INSERT (uploads) for anonymous and authenticated users
-- This allows uploads from the frontend using the anon key
CREATE POLICY "Allow public file uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
    bucket_id = 'beats'::text
);

-- Policy 2: Allow SELECT (reads) for everyone
-- This allows anyone to read/download files from the bucket
CREATE POLICY "Allow public file reads"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id = 'beats'::text
);

-- Policy 3: Allow UPDATE for authenticated users (optional)
-- This allows users to update/replace their uploaded files
CREATE POLICY "Allow authenticated file updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'beats'::text
)
WITH CHECK (
    bucket_id = 'beats'::text
);

-- Policy 4: Allow DELETE for authenticated users (optional)
-- This allows users to delete their uploaded files
CREATE POLICY "Allow authenticated file deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'beats'::text
);
