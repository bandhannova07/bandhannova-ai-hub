#!/bin/bash

# Run reset_tokens migration on all Supabase databases
# This creates the table needed for custom forgot password flow

echo "🔧 Running reset_tokens migration on all databases..."

# Read the SQL file
SQL_FILE="supabase/migrations/02-reset-tokens.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Migration file not found: $SQL_FILE"
    exit 1
fi

SQL_CONTENT=$(cat "$SQL_FILE")

echo "📝 Migration SQL loaded"
echo ""

# Database 1
echo "🗄️  Database 1: Running migration..."
curl -X POST "https://gdczwziakbajnvpwugnd.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_DB1_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_DB1_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL_CONTENT\"}" 2>/dev/null

echo "✅ Database 1 complete"
echo ""

# Database 2
echo "🗄️  Database 2: Running migration..."
curl -X POST "https://kqbdmhqyqpnwgqcjpxzg.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_DB2_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_DB2_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL_CONTENT\"}" 2>/dev/null

echo "✅ Database 2 complete"
echo ""

# Database 3
echo "🗄️  Database 3: Running migration..."
curl -X POST "https://qvmfqzxdvdlqmqhqgxqb.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_DB3_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_DB3_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL_CONTENT\"}" 2>/dev/null

echo "✅ Database 3 complete"
echo ""

# Database 4
echo "🗄️  Database 4: Running migration..."
curl -X POST "https://gdczwziakbajnvpwugnd.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $NEXT_PUBLIC_DB4_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_DB4_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL_CONTENT\"}" 2>/dev/null

echo "✅ Database 4 complete"
echo ""

echo "🎉 All migrations complete!"
echo "✅ reset_tokens table created in all databases"
