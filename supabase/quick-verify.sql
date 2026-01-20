-- ============================================
-- QUICK VERIFICATION - Run these ONE BY ONE
-- ============================================

-- 1. Check if reply_to_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leaders_messages' 
AND column_name = 'reply_to_id';
-- Expected: Should return 1 row
-- If NO rows: Column doesn't exist, migration failed

-- 2. Check if reactions table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'leaders_message_reactions';
-- Expected: Should return 1 row
-- If NO rows: Table doesn't exist, migration failed

-- 3. If both exist, test a manual insert
-- First, get a message ID:
SELECT id, content FROM leaders_messages ORDER BY created_at DESC LIMIT 1;

-- Copy the ID from above, then test insert reply:
-- (Replace YOUR_MESSAGE_ID with actual ID from above query)
-- INSERT INTO leaders_messages (user_id, content, reply_to_id) 
-- VALUES (auth.uid(), 'Test reply', 'YOUR_MESSAGE_ID');

-- 4. Check if the reply was saved:
SELECT id, content, reply_to_id FROM leaders_messages WHERE content = 'Test reply';
-- Expected: Should show reply_to_id with the message ID you used

-- 5. If insert worked, delete the test:
-- DELETE FROM leaders_messages WHERE content = 'Test reply';
