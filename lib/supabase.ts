import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_MASTER_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_MASTER_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables! Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

// Database Types
export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
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
