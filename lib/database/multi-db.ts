import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Primary database configuration
const DB_CONFIG = {
    url: process.env.NEXT_PUBLIC_DB1_URL || '',
    anonKey: process.env.NEXT_PUBLIC_DB1_ANON_KEY || '',
};

if (!DB_CONFIG.url || !DB_CONFIG.anonKey) {
    console.error('❌ Database 1 (Primary) is not configured! Check .env.local');
}

// Initialize the primary database client
const primaryClient: SupabaseClient = createClient(DB_CONFIG.url, DB_CONFIG.anonKey);

console.log(`✅ Initialized Primary Database (DB1)`);

/**
 * Get primary database
 */
export function getDB(index: number = 0): SupabaseClient {
    // We ignore the index now and always return the primary client
    if (index !== 0) {
        console.warn(`⚠️ Requested DB index ${index}, but multi-db is disabled. Returning DB1.`);
    }
    return primaryClient;
}

/**
 * Get next database - DEPRECATED: Now always returns primary DB
 */
export function getNextDB(): SupabaseClient {
    console.log(`🔄 Multi-db disabled: Returning Primary DB`);
    return primaryClient;
}

/**
 * Get next database with index - DEPRECATED: Always returns index 0
 */
export function getNextDBWithIndex(): { db: SupabaseClient, index: number } {
    return { db: primaryClient, index: 0 };
}

/**
 * Get total number of databases - Now always 1
 */
export function getTotalDBs(): number {
    return 1;
}

/**
 * Get all database clients - Now just an array with the primary client
 */
export function getAllDBs(): SupabaseClient[] {
    return [primaryClient];
}
