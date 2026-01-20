-- ============================================
-- TYPING INDICATOR - DATABASE SETUP
-- ============================================

-- Create typing status table
CREATE TABLE IF NOT EXISTS leaders_typing_status (
  user_id UUID REFERENCES leaders_users(id) ON DELETE CASCADE PRIMARY KEY,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leaders_typing_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view typing status"
  ON leaders_typing_status FOR SELECT
  USING (true);

CREATE POLICY "Users can update own typing status"
  ON leaders_typing_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own typing status update"
  ON leaders_typing_status FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE leaders_typing_status;

-- ============================================
-- COMPLETE MIGRATION (Reply + Reactions + Typing)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add reply_to_id if not exists
ALTER TABLE leaders_messages 
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES leaders_messages(id) ON DELETE SET NULL;

-- Create reactions table if not exists
CREATE TABLE IF NOT EXISTS leaders_message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES leaders_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES leaders_users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leaders_messages_reply_to_id ON leaders_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_message_id ON leaders_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_leaders_typing_user_id ON leaders_typing_status(user_id);

-- Enable RLS for reactions
ALTER TABLE leaders_message_reactions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Authenticated users can view all reactions" ON leaders_message_reactions;
DROP POLICY IF EXISTS "Users can insert own reactions" ON leaders_message_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON leaders_message_reactions;

CREATE POLICY "Authenticated users can view all reactions"
  ON leaders_message_reactions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own reactions"
  ON leaders_message_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON leaders_message_reactions FOR DELETE
  USING (auth.uid() = user_id);
