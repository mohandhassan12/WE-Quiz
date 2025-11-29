-- Supabase Database Schema for Quiz Game
-- Run this SQL in your Supabase SQL Editor

-- Create players table if it doesn't exist
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  branch TEXT,
  current_level INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  level_scores JSONB DEFAULT '{}'::jsonb,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);

-- Create index on total_score for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_total_score ON players(total_score DESC);

-- Create index on current_level for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_current_level ON players(current_level DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

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

