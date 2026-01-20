-- ============================================
-- LEADERS CHAT - REACTIONS & REPLIES MIGRATION
-- ============================================
-- Run this SQL after the main leaders-schema.sql
-- This adds support for message reactions and reply functionality

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
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leaders_messages_reply_to_id ON leaders_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_message_id ON leaders_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_user_id ON leaders_message_reactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS for reactions table
ALTER TABLE leaders_message_reactions ENABLE ROW LEVEL SECURITY;

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
-- REALTIME
-- ============================================

-- Enable Realtime for reactions table
ALTER PUBLICATION supabase_realtime ADD TABLE leaders_message_reactions;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Next steps:
-- 1. Run this migration in your Supabase SQL Editor
-- 2. Verify tables and policies are created
-- 3. Test reactions and replies functionality
