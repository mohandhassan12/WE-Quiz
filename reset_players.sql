-- Reset all players to level 1 with 0 scores
-- Run this SQL in your Supabase SQL Editor

-- Reset all players' progress
UPDATE players
SET
  current_level = 1,
  total_score = 0,
  level_scores = '{"1": 0}'::jsonb,
  last_played_at = NOW();

-- Optional: Delete all existing players if you want a fresh start
-- DELETE FROM players;

-- Verify the reset
SELECT
  username,
  current_level,
  total_score,
  level_scores
FROM players
ORDER BY username;
