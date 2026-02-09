import { getDB } from './database/multi-db';

/**
 * SIMPLIFIED SUPABASE CLIENT
 * Always uses DB1 (first database) for consistency
 */

/**
 * Get the Supabase client - ALWAYS returns DB1
 */
export function getSupabase() {
    return getDB(0);
}

/**
 * Legacy export compatibility - points to DB1
 */
export const supabase = getDB(0);

/**
 * Find which database a user exists in - DEPRECATED: Now only checks DB1
 */
export const findUserInAllDBs = async () => {
    const db = getDB(0);
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        return { client: db, index: 0, session };
    }
    return null;
}

/**
 * Get all database clients - Now just the primary one
 */
export function getAllSupabaseClients() {
    return [getDB(0)];
}

// ============================================
// Database Types
// ============================================

export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    created_at: string;
    updated_at: string;
};

export type UserOnboarding = {
    user_id: string;
    profession: string;
    role: string | null;
    goal: string;
    expertise: string;
    interests: string[];
    message_tone: string;
    language: string;
    voice_gender: string | null;
    voice_tone: string | null;
    created_at: string;
    updated_at: string;
};

export type UserPreferences = {
    id: string;
    user_id: string;
    theme: 'light' | 'dark';
    language: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu';
    notifications_enabled: boolean;
    email_notifications: boolean;
    created_at: string;
    updated_at: string;
};

export type Subscription = {
    id: string;
    user_id: string;
    plan_type: 'free' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
};
