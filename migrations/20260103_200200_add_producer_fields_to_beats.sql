-- Migration: Add Producer Fields to Beats Table
-- Adds producer_name and licensor_legal_name columns for per-beat license generation
-- All changes are additive and non-breaking

-- Add producer_name column (nullable, allows fallback to env vars)
ALTER TABLE beats 
ADD COLUMN IF NOT EXISTS producer_name TEXT;

-- Add licensor_legal_name column (nullable, allows fallback to env vars)
ALTER TABLE beats 
ADD COLUMN IF NOT EXISTS licensor_legal_name TEXT;

-- Add indexes for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_beats_producer_name ON beats(producer_name);
CREATE INDEX IF NOT EXISTS idx_beats_licensor_legal_name ON beats(licensor_legal_name);




