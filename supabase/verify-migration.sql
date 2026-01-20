-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries ONE BY ONE to check migration status

-- 1. Check if reply_to_id column exists in leaders_messages
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leaders_messages' 
AND column_name = 'reply_to_id';
-- Expected: Should return one row with column_name = 'reply_to_id'

-- 2. Check if leaders_message_reactions table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'leaders_message_reactions';
-- Expected: Should return one row with table_name = 'leaders_message_reactions'

-- 3. Check reactions table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leaders_message_reactions';
-- Expected: Should return id, message_id, user_id, emoji, created_at

-- 4. Check RLS policies on reactions table
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'leaders_message_reactions';
-- Expected: Should return 3 policies

-- 5. Test insert a reaction (replace with real IDs)
-- First get a message ID:
SELECT id FROM leaders_messages LIMIT 1;
-- Then try to insert (replace MESSAGE_ID with actual ID):
-- INSERT INTO leaders_message_reactions (message_id, user_id, emoji) 
-- VALUES ('MESSAGE_ID', auth.uid(), '👍');

-- 6. Check if realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'leaders_message_reactions';
-- Expected: Should return one row
