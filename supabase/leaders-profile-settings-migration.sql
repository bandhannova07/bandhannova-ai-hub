-- ============================================
-- LEADERS PROFILE SETTINGS - DATABASE MIGRATION
-- ============================================
-- Add profile fields to leaders_users table

-- Add new columns for profile settings
ALTER TABLE leaders_users 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Update existing users with default values
UPDATE leaders_users 
SET 
  role = COALESCE(role, 'Leader'),
  bio = COALESCE(bio, ''),
  about = COALESCE(about, ''),
  social_links = COALESCE(social_links, '{}'::jsonb)
WHERE role IS NULL OR bio IS NULL OR about IS NULL OR social_links IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaders_users_role ON leaders_users(role);

-- ============================================
-- STORAGE BUCKET FOR PROFILE PICTURES
-- ============================================
-- Note: Create 'leaders-profiles' bucket manually in Supabase Dashboard

-- Storage RLS Policies for profile pictures
CREATE POLICY "Authenticated users can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'leaders-profiles' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'leaders-profiles');

CREATE POLICY "Users can update own profile pictures"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'leaders-profiles' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'leaders-profiles' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
