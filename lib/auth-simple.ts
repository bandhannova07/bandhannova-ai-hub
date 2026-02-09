import { getDB } from './database/multi-db';

interface SignUpData {
    email: string;
    password: string;
    fullName?: string;
}

/**
 * Sign up user - Always uses primary database
 */
export async function signUp(data: SignUpData) {
    try {
        const db = getDB(0);

        // Create user
        const { data: authData, error: authError } = await db.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName || '',
                },
            },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // Create profile in profiles table
        try {
            const { error: profileError } = await db.from('profiles').insert({
                id: authData.user.id,
                email: data.email,
                full_name: data.fullName || '',
                plan: 'free', // Default plan
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            if (profileError) {
                console.error('Profile creation error:', profileError);
            } else {
                console.log(`✅ Profile created for ${data.email} with Free plan`);
            }
        } catch (profileErr) {
            console.error('Profile creation failed:', profileErr);
        }

        console.log(`✅ User ${data.email} created successfully in Primary DB`);

        return { user: authData.user, session: authData.session, error: null };
    } catch (error: any) {
        console.error('Signup error:', error);
        return { user: null, session: null, error: error.message };
    }
}

/**
 * Sign in user - Only checks primary database
 */
export async function signIn(email: string, password: string) {
    try {
        const db = getDB(0);

        const { data, error } = await db.auth.signInWithPassword({
            email,
            password,
        });

        if (!error && data.user) {
            console.log(`✅ User found in Primary DB`);
            if (typeof window !== 'undefined') {
                localStorage.setItem('active_db_index', '0');
            }
            return { user: data.user, session: data.session, error: null };
        }

        if (error) throw error;
        throw new Error('Invalid email or password');
    } catch (error: any) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error: error.message };
    }
}

/**
 * Sign out user
 */
export async function signOut() {
    try {
        const db = getDB(0);
        await db.auth.signOut();
        return { error: null };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return { error: error.message };
    }
}

/**
 * Get current session
 */
export async function getSession() {
    try {
        const db = getDB(0);
        const { data, error } = await db.auth.getSession();
        if (!error && data.session) {
            return { session: data.session, error: null };
        }
        return { session: null, error: null };
    } catch (error: any) {
        console.error('Get session error:', error);
        return { session: null, error: error.message };
    }
}

/**
 * Get the base URL for redirects
 */
const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_APP_URL ?? // Use environment variable if set
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    // Make sure to include `https://` when not localhost
    url = url.includes('http') ? url : `https://${url}`;
    // Remove trailing slash
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
    return url;
};

/**
 * Get current user
 */
export async function getCurrentUser() {
    try {
        const db = getDB(0);
        const { data: { user }, error } = await db.auth.getUser();
        if (!error && user) {
            return { user, error: null };
        }
        return { user: null, error: null };
    } catch (error: any) {
        console.error('Get current user error:', error);
        return { user: null, error: error.message };
    }
}

/**
 * Sign in with Google - Always uses primary DB
 */
export async function signInWithGoogle() {
    try {
        const db = getDB(0);

        // We no longer need to persist DB index as it's always 0
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_db_index', '0');
            console.log(`📡 Preparing Google Auth: Using Primary DB.`);
        }

        const { data, error } = await db.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getURL()}/auth/callback`, // Removed db_index query param
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error('Google sign in error:', error);
        return { data: null, error: error.message };
    }
}
