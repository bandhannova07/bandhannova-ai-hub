-- Add custom AI instructions column to user_onboarding table
-- This allows users to provide custom instructions for AI behavior

ALTER TABLE user_onboarding 
ADD COLUMN IF NOT EXISTS custom_instructions TEXT DEFAULT NULL;

-- Add constraint to enforce 500 character limit
ALTER TABLE user_onboarding
ADD CONSTRAINT custom_instructions_length 
CHECK (char_length(custom_instructions) <= 500);

-- Add comment for documentation
COMMENT ON COLUMN user_onboarding.custom_instructions IS 'User-defined custom instructions for AI behavior (max 500 characters)';
