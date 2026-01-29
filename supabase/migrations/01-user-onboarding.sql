-- ============================================
-- USER ONBOARDING TABLE
-- Stores personalized user context for AI
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_onboarding (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profession TEXT NOT NULL,
    role TEXT,
    goal TEXT NOT NULL,
    expertise TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}',
    message_tone TEXT NOT NULL, -- Renamed from tone
    language TEXT NOT NULL,
    voice_gender TEXT, -- 'male' | 'female'
    voice_tone TEXT, -- e.g. 'calm', 'energetic'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding(user_id);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER user_onboarding_updated_at
    BEFORE UPDATE ON public.user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- RLS (Disable for now for simplicity, matching other tables)
ALTER TABLE public.user_onboarding DISABLE ROW LEVEL SECURITY;

-- Notify
DO $$
BEGIN
    RAISE NOTICE '✅ Table user_onboarding updated successfully';
END $$;
