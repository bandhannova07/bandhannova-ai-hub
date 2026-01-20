-- ============================================
-- LEADERS CHAT DATABASE SCHEMA
-- ============================================
-- Run this SQL in your dedicated Leaders Supabase project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Leaders Users Table
CREATE TABLE IF NOT EXISTS leaders_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS leaders_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES leaders_users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'video')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  reply_to_id UUID REFERENCES leaders_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Read Receipts Table (Optional - for future enhancement)
CREATE TABLE IF NOT EXISTS leaders_read_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES leaders_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES leaders_users(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

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

CREATE INDEX IF NOT EXISTS idx_leaders_messages_user_id ON leaders_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_leaders_messages_created_at ON leaders_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaders_messages_reply_to_id ON leaders_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_leaders_read_receipts_message_id ON leaders_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_leaders_read_receipts_user_id ON leaders_read_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_message_id ON leaders_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_leaders_reactions_user_id ON leaders_message_reactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE leaders_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders_message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leaders_users
CREATE POLICY "Authenticated users can view all users"
  ON leaders_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON leaders_users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON leaders_users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for leaders_messages
CREATE POLICY "Authenticated users can view all messages"
  ON leaders_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert messages"
  ON leaders_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON leaders_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON leaders_messages FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for leaders_read_receipts
CREATE POLICY "Authenticated users can view all receipts"
  ON leaders_read_receipts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own receipts"
  ON leaders_read_receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
-- FUNCTIONS
-- ============================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_leaders_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.leaders_users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_leaders_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on messages
DROP TRIGGER IF EXISTS on_leaders_message_updated ON leaders_messages;
CREATE TRIGGER on_leaders_message_updated
  BEFORE UPDATE ON leaders_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- REALTIME
-- ============================================

-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE leaders_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE leaders_users;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- Create these buckets manually:
-- 1. leaders-images (for image uploads)
-- 2. leaders-videos (for video uploads)

-- Storage RLS Policies (run after creating buckets)
-- For leaders-images bucket:
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'leaders-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'leaders-images');

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'leaders-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- For leaders-videos bucket:
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'leaders-videos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'leaders-videos');

CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'leaders-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Next steps:
-- 1. Create storage buckets 'leaders-images' and 'leaders-videos' in Supabase Dashboard
-- 2. Set bucket policies to public for reading
-- 3. Create admin users via Supabase Auth Dashboard
-- 4. Add environment variables to .env.local
