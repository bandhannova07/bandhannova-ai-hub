// Run reset_tokens migration on all databases
// Usage: node scripts/create-reset-tokens-table.js

const { getAllDBs } = require('../lib/database/multi-db');

const SQL = `
CREATE TABLE IF NOT EXISTS reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires_at ON reset_tokens(expires_at);
`;

async function runMigration() {
    console.log('🔧 Creating reset_tokens table in all databases...\n');

    const databases = getAllDBs();

    for (let i = 0; i < databases.length; i++) {
        const db = databases[i];
        console.log(`📊 Database ${i + 1}/${databases.length}: Running migration...`);

        try {
            const { error } = await db.rpc('exec_sql', { sql: SQL });

            if (error) {
                console.error(`❌ Database ${i + 1} error:`, error);
            } else {
                console.log(`✅ Database ${i + 1} complete\n`);
            }
        } catch (err) {
            console.error(`❌ Database ${i + 1} failed:`, err.message);
        }
    }

    console.log('🎉 Migration complete!');
    process.exit(0);
}

runMigration();
