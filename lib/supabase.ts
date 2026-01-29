import { getDB, getAllDBs } from './database/multi-db';

/**
 * SIMPLIFIED SUPABASE CLIENT
 * Always uses DB1 (first database) for consistency
 * Multi-database rotation is handled by auth-simple.ts during signup
 */

/**
 * Get the Supabase client - ALWAYS returns DB1
 * This ensures all operations use the same database
 */
export function getSupabase() {
    return getDB(0); // Always use first database
}

/**
 * Legacy export compatibility - points to DB1
 */
export const supabase = getDB(0);

/**
 * Find which database a user exists in (for migration/recovery)
 * This is expensive - only use when absolutely necessary
 */
export const findUserInAllDBs = async () => {
    const dbs = getAllDBs();
    for (let i = 0; i < dbs.length; i++) {
        const { data: { session } } = await dbs[i].auth.getSession();
        if (session) {
            console.log(`✅ User found in DB${i + 1}`);
            if (typeof window !== 'undefined') {
                localStorage.setItem('active_db_index', i.toString());
            }
            return { client: dbs[i], index: i, session };
        }
    }
    return null;
}

/**
 * Get all database clients
 */
export function getAllSupabaseClients() {
    return getAllDBs();
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
