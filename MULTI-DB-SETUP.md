# 🚀 Multi-Database Setup Guide

## Quick Start Checklist

- [ ] Create 13 Supabase projects (1 Master + 12 Shards)
- [ ] Run Master DB SQL script
- [ ] Run Shard DB SQL script on all 12 shards
- [ ] Configure environment variables
- [ ] Register shards
- [ ] Test the system

---

## Step 1: Create Supabase Projects

### Create Master Database (DB0)
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `bandhannova-master`
3. Save credentials:
   - Project URL
   - anon public key
   - service_role key

### Create 12 Shard Databases
Repeat for each shard (DB1-DB12):
1. Create new project: `bandhannova-shard-1`, `bandhannova-shard-2`, etc.
2. Save credentials for each

---

## Step 2: Run SQL Scripts

### Master Database
1. Open Master project → SQL Editor
2. Copy contents from `scripts/setup-master-db.sql`
3. Click RUN
4. Verify: Check `shard_registry` table exists

### Each Shard Database
1. Open Shard project → SQL Editor
2. Copy contents from `scripts/setup-shard-db.sql`
3. Click RUN
4. Repeat for all 12 shards

---

## Step 3: Configure Environment

1. Copy `env.template` to `.env.local`
2. Fill in all credentials:

```env
# Master DB
NEXT_PUBLIC_MASTER_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_MASTER_SUPABASE_ANON_KEY=eyJxxx...
MASTER_SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Shard 1
SHARD_1_URL=https://xxxxx.supabase.co
SHARD_1_ANON_KEY=eyJxxx...

# ... repeat for all 12 shards
```

---

## Step 4: Register Shards

Run the registration script:

```bash
npm run register-shards
```

This will:
- ✅ Register all 12 shards in Master DB
- ✅ Set them as 'active'
- ✅ Show summary table

---

## Step 5: Test the System

### Test Signup
1. Start dev server: `npm run dev`
2. Go to `/signup`
3. Create a test account
4. Check console: Should show shard assignment

### Test Login
1. Go to `/login`
2. Login with test account
3. Should redirect to home

### Verify in Supabase
1. Master DB → `user_shard_mapping` table
2. Should see user → shard mapping
3. Check assigned shard → `profiles` table
4. Should see user profile

---

## Step 6: Monitor Health

Run health check:

```bash
npm run health-check
```

This will:
- ✅ Check all shard connections
- ✅ Update metrics
- ✅ Mark full shards
- ✅ Show summary

---

## Troubleshooting

**Error: Missing environment variables**
- Check `.env.local` has all credentials
- Restart dev server

**Error: Shard registration failed**
- Verify SQL scripts ran successfully
- Check Supabase project is active

**Error: User not assigned to shard**
- Check Master DB `shard_registry` has active shards
- Run health check to verify shards

---

## Scaling Guide

### Adding More Shards (Future)

1. Create new Supabase project
2. Run `setup-shard-db.sql`
3. Add to `.env.local`:
   ```env
   SHARD_13_URL=...
   SHARD_13_ANON_KEY=...
   ```
4. Update `scripts/register-shards.ts`
5. Run `npm run register-shards`

**System automatically uses new shard!** 🎉

---

## System Architecture

```
User Signup → Master DB (Auth) → Router (Select Shard) → 
Shard DB (Create Profile) → Success!

User Login → Master DB (Auth + Get Shard) → 
Shard DB (Fetch Data) → Success!
```

---

## Support

Need help? Check:
- `implementation_plan.md` - Full architecture
- `task.md` - Implementation checklist
- SQL files in `scripts/` folder

**You're ready to scale to UNLIMITED users!** 🚀