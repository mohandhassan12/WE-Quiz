-- Supabase Database Schema for Quiz Game
-- Run this SQL in your Supabase SQL Editor

-- Create players table if it doesn't exist
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  branch TEXT,
  avatar_url TEXT DEFAULT 'avatar-1',
  current_level INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  level_scores JSONB DEFAULT '{}'::jsonb,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADD COLUMNS IF THEY DON'T EXIST (for updates)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'avatar_url') THEN
        ALTER TABLE players ADD COLUMN avatar_url TEXT DEFAULT 'avatar-1';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'level_scores') THEN
        ALTER TABLE players ADD COLUMN level_scores JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);

-- Create index on total_score for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_total_score ON players(total_score DESC);

-- Create index on current_level for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_current_level ON players(current_level DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Allow all operations for anon users" ON players;

-- Create policy to allow all operations (since we're using anon key)
-- In production, you might want to restrict this
CREATE POLICY "Allow all operations for anon users" ON players
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for leaderboard
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  id,
  username,
  email,
  branch,
  current_level,
  total_score,
  last_played_at,
  ROW_NUMBER() OVER (ORDER BY total_score DESC, current_level DESC) as rank
FROM players
ORDER BY total_score DESC, current_level DESC;

-- STORAGE SETUP --
-- Create a storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update an avatar." ON storage.objects;

-- Allow public access to avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow authenticated (and anon for this app) uploads
CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );
  
-- Allow updates
CREATE POLICY "Anyone can update an avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' );
