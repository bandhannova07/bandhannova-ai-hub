import { supabase } from './supabase';
import type { Profile } from './supabase';

export type AuthUser = {
    id: string;
    email: string;
    full_name?: string;
};

export type SignUpData = {
    email: string;
    password: string;
    full_name: string;
};

export type SignInData = {
    email: string;
    password: string;
};

/**
 * Get the base URL for redirects
 */
const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_APP_URL ?? // Use environment variable if set
        (typeof window !== 'undefined' ? window.location.origin : ''); // Fallback to current origin

    // Make sure to include `https://` when not localhost
    url = url.includes('http') ? url : `https://${url}`;
    // Remove trailing slash
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
    return url;
};

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
    try {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.full_name,
                },
            },
        });

        if (error) throw error;

        return { user: authData.user, error: null };
    } catch (error: any) {
        console.error('Sign up error:', error);
        return { user: null, error: error.message };
    }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
    try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw error;

        return { user: authData.user, session: authData.session, error: null };
    } catch (error: any) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error: error.message };
    }
}

/**
 * Sign out the current user
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return { error: error.message };
    }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
    } catch (error: any) {
        console.error('Get user error:', error);
        return { user: null, error: error.message };
    }
}

/**
 * Get the current session
 */
export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session, error: null };
    } catch (error: any) {
        console.error('Get session error:', error);
        return { session: null, error: error.message };
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return { profile: data, error: null };
    } catch (error: any) {
        console.error('Get profile error:', error);
        return { profile: null, error: error.message };
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<Profile>) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return { profile: data, error: null };
    } catch (error: any) {
        console.error('Update profile error:', error);
        return { profile: null, error: error.message };
    }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${getURL()}/reset-password`,
        });

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Reset password error:', error);
        return { error: error.message };
    }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Update password error:', error);
        return { error: error.message };
    }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}
