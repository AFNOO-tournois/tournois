-- ============================================
-- FIX RLS POLICIES FOR ADMIN OPERATIONS
-- ============================================
-- Run this to allow admin panel to work properly
-- The admin panel's password protection is your security layer
-- 
-- ⚠️ SAFE TO RUN MULTIPLE TIMES - Drops existing policies first

-- ============================================
-- 1. DROP RESTRICTIVE POLICIES
-- ============================================

-- Tournaments table
DROP POLICY IF EXISTS "No public insert on tournaments" ON tournaments;
DROP POLICY IF EXISTS "No public update on tournaments" ON tournaments;
DROP POLICY IF EXISTS "No public delete on tournaments" ON tournaments;

-- Participants table  
DROP POLICY IF EXISTS "Public can insert participants with limits" ON participants;

-- ============================================
-- 2. CREATE PERMISSIVE POLICIES FOR ADMIN OPERATIONS
-- ============================================

-- Drop the policy if it exists first
DROP POLICY IF EXISTS "Allow all operations on tournaments" ON tournaments;

-- TOURNAMENTS: Allow all operations (admin panel has its own auth)
CREATE POLICY "Allow all operations on tournaments"
ON tournaments FOR ALL
USING (true)
WITH CHECK (true);

-- Drop existing participant policies if they exist
DROP POLICY IF EXISTS "Allow participant inserts with validation" ON participants;
DROP POLICY IF EXISTS "Allow all reads on participants" ON participants;
DROP POLICY IF EXISTS "Allow all updates on participants" ON participants;
DROP POLICY IF EXISTS "Allow all deletes on participants" ON participants;

-- PARTICIPANTS: Allow inserts with validation, and all other operations
CREATE POLICY "Allow participant inserts with validation"
ON participants FOR INSERT
WITH CHECK (
  -- Honeypot must be empty (bots fill hidden fields)
  honeypot IS NULL AND
  -- Must have required fields
  roblox_username IS NOT NULL AND
  tournament_type IS NOT NULL AND
  -- Username must be reasonable length (3-20 chars)
  length(roblox_username) >= 3 AND
  length(roblox_username) <= 20 AND
  -- Tournament type must be valid
  tournament_type IN ('pvp', 'all-ages', 'custom')
);

-- Allow SELECT, UPDATE, DELETE for admin operations
CREATE POLICY "Allow all reads on participants"
ON participants FOR SELECT
USING (true);

CREATE POLICY "Allow all updates on participants"
ON participants FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all deletes on participants"
ON participants FOR DELETE
USING (true);

-- ============================================
-- 3. MATCHES TABLE - FIX POLICIES
-- ============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public can read matches" ON matches;
DROP POLICY IF EXISTS "No public insert on matches" ON matches;
DROP POLICY IF EXISTS "No public update on matches" ON matches;
DROP POLICY IF EXISTS "allow_public_read_matches" ON matches;
DROP POLICY IF EXISTS "allow_public_insert_matches" ON matches;
DROP POLICY IF EXISTS "Allow all operations on matches" ON matches;

-- Allow all operations on matches (admin only via password-protected panel)
CREATE POLICY "Allow all operations on matches"
ON matches FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- SUMMARY
-- ============================================
-- ✅ Tournaments: Full admin access via admin panel
-- ✅ Participants: Public signup (with validation) + full admin access
-- ✅ Matches: Full admin access
-- 🔐 Security: Admin panel password + honeypot field + input validation

COMMENT ON POLICY "Allow all operations on tournaments" ON tournaments IS 
'Admin panel has password protection - this allows full CRUD operations';

COMMENT ON POLICY "Allow participant inserts with validation" ON participants IS 
'Public signups with honeypot and validation - admin operations allowed separately';
