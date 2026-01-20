-- ============================================
-- LEADERS CHAT - REACTIONS & REPLIES MIGRATION (FINAL)
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- This adds support for message reactions and reply functionality

-- ============================================
-- ENABLE UUID EXTENSION (if not already enabled)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- Add reply_to_id column to leaders_messages
ALTER TABLE leaders_messages 
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES leaders_messages(id) ON DELETE SET NULL;

-- ============================================
-- NEW TABLES
-- ============================================

-- Message Reactions Table
CREATE TABLE IF NOT EXISTS leaders_message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES leaders_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES leaders_users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leaders_messages_reply_to_id ON leaders_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_message_id ON leaders_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_user_id ON leaders_message_reactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS for reactions table
ALTER TABLE leaders_message_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can view all reactions" ON leaders_message_reactions;
DROP POLICY IF EXISTS "Users can insert own reactions" ON leaders_message_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON leaders_message_reactions;

-- RLS Policies for leaders_message_reactions
CREATE POLICY "Authenticated users can view all reactions"
  ON leaders_message_reactions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own reactions"
  ON leaders_message_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON leaders_message_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REALTIME (Skip if already added)
-- ============================================

-- If you get error "already member of publication", skip this line
-- The table is already configured for realtime, which is good!
-- ALTER PUBLICATION supabase_realtime ADD TABLE leaders_message_reactions;

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================

-- Refresh your browser and test:
-- 1. Swipe to reply → Send message → Reply should be saved
-- 2. Long-press → React with emoji → Reaction should save and appear
-- 3. Click reaction → Modal shows who reacted
-- 4. Test realtime: Open in two browsers, react in one, see it in other
