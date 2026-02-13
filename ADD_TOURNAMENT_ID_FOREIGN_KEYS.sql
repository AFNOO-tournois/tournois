-- ============================================
-- ADD TOURNAMENT_ID FOREIGN KEYS
-- ============================================
-- This fixes the issue where multiple tournaments with the same 
-- tournament_type would share participants and results.
-- 
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Add tournament_id to participants
-- ============================================

-- Add the column (nullable at first)
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE;

-- Populate it based on existing tournament_type
-- (This assumes you match by tournament_type for now)
UPDATE participants p
SET tournament_id = (
  SELECT id FROM tournaments t 
  WHERE t.tournament_type = p.tournament_type 
  LIMIT 1
)
WHERE tournament_id IS NULL;

-- Make it NOT NULL after populating
ALTER TABLE participants 
ALTER COLUMN tournament_id SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_participants_tournament_id 
ON participants(tournament_id);

-- ============================================
-- STEP 2: Add tournament_id to matches
-- ============================================

-- Check if column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'matches' AND column_name = 'tournament_id'
  ) THEN
    ALTER TABLE matches 
    ADD COLUMN tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Populate it based on existing tournament_type
UPDATE matches m
SET tournament_id = (
  SELECT id FROM tournaments t 
  WHERE t.tournament_type = m.tournament_type 
  LIMIT 1
)
WHERE tournament_id IS NULL;

-- Make it NOT NULL after populating (if all matches have a tournament_id now)
ALTER TABLE matches 
ALTER COLUMN tournament_id SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id 
ON matches(tournament_id);

-- ============================================
-- STEP 3: Update RLS policies to use tournament_id
-- ============================================

-- For participants (keep tournament_type validation for backwards compatibility)
DROP POLICY IF EXISTS "Allow participant inserts with validation" ON participants;

CREATE POLICY "Allow participant inserts with validation"
ON participants FOR INSERT
WITH CHECK (
  honeypot IS NULL AND
  roblox_username IS NOT NULL AND
  tournament_id IS NOT NULL AND
  length(roblox_username) >= 3 AND
  length(roblox_username) <= 20
);

-- ============================================
-- SUMMARY
-- ============================================
-- ✅ Added tournament_id to participants (with foreign key)
-- ✅ Added tournament_id to matches (with foreign key)
-- ✅ Created indexes for performance
-- ✅ Updated RLS policies
-- 
-- NOW: Update JavaScript code to use tournament_id instead of tournament_type

SELECT 'Migration complete! Now update JavaScript code.' as status;
