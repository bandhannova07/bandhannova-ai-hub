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
