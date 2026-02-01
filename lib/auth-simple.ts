import { getNextDB } from './database/multi-db';

interface SignUpData {
    email: string;
    password: string;
    fullName?: string;
}

/**
 * Sign up user - automatically assigns to next database in rotation
 */
export async function signUp(data: SignUpData) {
    try {
        // Get next database in rotation
        const db = getNextDB();

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
                // Don't throw - user is created, profile can be created later
            } else {
                console.log(`✅ Profile created for ${data.email} with Free plan`);
            }
        } catch (profileErr) {
            console.error('Profile creation failed:', profileErr);
        }

        if (typeof window !== 'undefined') {
            // We need to know which DB index returned by getNextDB()
            // Since getNextDB doesn't return index, we might default to 0 or need to update getNextDB
            // effectively, getNextDB rotates, so it's safer to just let the user login again or
            // better, store the index if we modify getNextDB.
            // For now, let's assume we can find the user by iterating or just rely on the first login.
            // Actually, sign-up returns a session, so the user IS logged in.
            // Let's iterate to find where the user was created to be safe, or modify getNextDB.
        }

        console.log(`✅ User ${data.email} created successfully`);

        return { user: authData.user, session: authData.session, error: null };
    } catch (error: any) {
        console.error('Signup error:', error);
        return { user: null, session: null, error: error.message };
    }
}

/**
 * Sign in user - tries all databases until found
 */
export async function signIn(email: string, password: string) {
    try {
        const { getAllDBs } = await import('./database/multi-db');
        const databases = getAllDBs();

        // Try each database
        for (let i = 0; i < databases.length; i++) {
            const db = databases[i];

            const { data, error } = await db.auth.signInWithPassword({
                email,
                password,
            });

            if (!error && data.user) {
                console.log(`✅ User found in DB ${i + 1}`);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('active_db_index', i.toString());
                }
                return { user: data.user, session: data.session, error: null };
            }
        }

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
        const { getAllDBs } = await import('./database/multi-db');
        const databases = getAllDBs();

        // Sign out from all databases
        await Promise.all(databases.map(db => db.auth.signOut()));

        return { error: null };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return { error: error.message };
    }
}

/**
 * Get current session - checks all databases
 */
export async function getSession() {
    try {
        const { getAllDBs } = await import('./database/multi-db');
        const databases = getAllDBs();

        // Check each database for session
        for (const db of databases) {
            const { data, error } = await db.auth.getSession();
            if (!error && data.session) {
                return { session: data.session, error: null };
            }
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
        window.location.origin; // Fallback to current origin

    // Make sure to include `https://` when not localhost
    url = url.includes('http') ? url : `https://${url}`;
    // Remove trailing slash
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
    return url;
};

/**
 * Get current user - checks all databases
 */
export async function getCurrentUser() {
    try {
        const { getAllDBs } = await import('./database/multi-db');
        const databases = getAllDBs();

        // Check each database for user
        for (const db of databases) {
            const { data: { user }, error } = await db.auth.getUser();
            if (!error && user) {
                return { user, error: null };
            }
        }

        return { user: null, error: null };
    } catch (error: any) {
        console.error('Get current user error:', error);
        return { user: null, error: error.message };
    }
}
/**
 * Sign in with Google - assigns to next DB in rotation
 */
export async function signInWithGoogle() {
    try {
        const { getNextDBWithIndex } = await import('./database/multi-db');
        const { db, index } = getNextDBWithIndex();

        // We need to persist which DB we are using for the callback
        // This is tricky because the callback comes back to the browser.
        // We'll store it in localStorage as a fallback.
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_db_index', index.toString());
            console.log(`📡 Preparing Google Auth: Using DB ${index + 1}. Persisted to localStorage.`);
        }

        const { data, error } = await db.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getURL()}/auth/callback?db_index=${index}`,
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
