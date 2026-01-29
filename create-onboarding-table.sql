-- First, drop the existing table if it has wrong structure
DROP TABLE IF EXISTS public.user_onboarding CASCADE;

-- Create the table with correct structure
CREATE TABLE public.user_onboarding (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profession TEXT NOT NULL DEFAULT '',
    role TEXT DEFAULT '',
    goal TEXT NOT NULL DEFAULT '',
    expertise TEXT NOT NULL DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    message_tone TEXT NOT NULL DEFAULT '',
    language TEXT NOT NULL DEFAULT 'English',
    voice_gender TEXT DEFAULT 'female',
    voice_tone TEXT DEFAULT 'Friendly',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE public.user_onboarding DISABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding(user_id);

-- Verify table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_onboarding'
ORDER BY ordinal_position;
