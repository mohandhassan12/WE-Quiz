ngrok service stop --all
# Quiz Game Modifications TODO

## Phase 1: Setup and Dependencies
- [ ] Add @supabase/supabase-js to package.json
- [ ] Create Supabase configuration file
- [ ] Install dependencies

## Phase 2: Database Schema
- [ ] Create players table in Supabase (email, username, current_level, total_score, level_scores, last_played_at)
- [ ] Create questions table with field grouping (field, question, options, answer)

## Phase 3: Authentication & Registration
- [ ] Modify PlayerRegistration component to include email and username fields
- [ ] Add uniqueness validation for usernames
- [ ] Update registration flow to use Supabase

## Phase 4: Game Logic Updates
- [ ] Update useQuizGame hook to use Supabase instead of localStorage
- [ ] Modify question loading to group by fields (S1, S2, etc.)
- [ ] Add field-based leveling system

## Phase 5: UI Components
- [ ] Create Leaderboard component for player rankings
- [ ] Update Home page to include leaderboard navigation
- [ ] Modify question display to show field information

## Phase 6: Deployment
- [ ] Configure for Vercel deployment
- [ ] Test deployment
- [ ] Verify all features work on hosted version
