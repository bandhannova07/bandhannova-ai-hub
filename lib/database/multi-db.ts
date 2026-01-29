import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded database configs - Next.js will replace these at build time
const DB_CONFIGS = [
    {
        url: process.env.NEXT_PUBLIC_DB1_URL || '',
        anonKey: process.env.NEXT_PUBLIC_DB1_ANON_KEY || '',
    },
    {
        url: process.env.NEXT_PUBLIC_DB2_URL || '',
        anonKey: process.env.NEXT_PUBLIC_DB2_ANON_KEY || '',
    },
    {
        url: process.env.NEXT_PUBLIC_DB3_URL || '',
        anonKey: process.env.NEXT_PUBLIC_DB3_ANON_KEY || '',
    },
    {
        url: process.env.NEXT_PUBLIC_DB4_URL || '',
        anonKey: process.env.NEXT_PUBLIC_DB4_ANON_KEY || '',
    },
].filter(config => config.url && config.anonKey); // Remove empty configs

// Initialize all database clients
const dbClients: SupabaseClient[] = DB_CONFIGS.map(config =>
    createClient(config.url, config.anonKey)
);

console.log(`✅ Initialized ${dbClients.length} databases`);

if (dbClients.length === 0) {
    console.error('❌ No databases configured! Check .env.local');
}

// Simple counter for rotation
let currentDBIndex = 0;

/**
 * Get next database in rotation
 */
export function getNextDB(): SupabaseClient {
    if (dbClients.length === 0) {
        throw new Error('No databases configured! Add DB URLs to .env.local');
    }

    const db = dbClients[currentDBIndex];
    const dbNumber = currentDBIndex + 1; // Human-readable (1-indexed)

    console.log(`🔄 Assigning user to DB${dbNumber}/${dbClients.length}`);

    currentDBIndex = (currentDBIndex + 1) % dbClients.length;

    return db;
}

/**
 * Get next database in rotation with its index
 */
export function getNextDBWithIndex(): { db: SupabaseClient, index: number } {
    if (dbClients.length === 0) {
        throw new Error('No databases configured! Add DB URLs to .env.local');
    }

    const index = currentDBIndex;
    const db = dbClients[index];
    const dbNumber = index + 1;

    console.log(`🔄 Assigning user to DB${dbNumber}/${dbClients.length}`);

    currentDBIndex = (currentDBIndex + 1) % dbClients.length;

    return { db, index };
}

/**
 * Get database by index
 */
export function getDB(index: number): SupabaseClient {
    if (index < 0 || index >= dbClients.length) {
        throw new Error(`Invalid DB index: ${index}`);
    }
    return dbClients[index];
}

/**
 * Get total number of databases
 */
export function getTotalDBs(): number {
    return dbClients.length;
}

/**
 * Get all database clients
 */
export function getAllDBs(): SupabaseClient[] {
    return dbClients;
}
