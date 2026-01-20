# Leaders Chat - Setup Instructions

## 1. Supabase Project Setup

### Create Dedicated Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project named "BandhanNova Leaders Chat"
3. Note down your project URL and anon key

### Run Database Schema
1. Open SQL Editor in your Supabase project
2. Copy the contents of `supabase/leaders-schema.sql`
3. Run the SQL script to create all tables, policies, and functions

### Create Storage Buckets
1. Go to Storage section in Supabase Dashboard
2. Create two public buckets:
   - **leaders-images** (for image uploads)
   - **leaders-videos** (for video uploads)
3. Set both buckets to "Public" access

### Enable Realtime
1. Go to Database → Replication
2. Enable replication for:
   - `leaders_messages`
   - `leaders_users`

## 2. Environment Variables

Add these to your `.env.local` file:

```env
# Leaders Supabase Project
NEXT_PUBLIC_LEADERS_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_LEADERS_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Admin Users

### Via Supabase Dashboard
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password for each leader/developer
4. Set user metadata:
   ```json
   {
     "full_name": "Leader Name"
   }
   ```

### Via SQL (Alternative)
```sql
-- This will be handled automatically by the trigger
-- Just create users via Supabase Auth Dashboard
```

## 4. Access the Leaders Chat

1. Navigate to `/leaders/login`
2. Sign in with the email/password you created
3. Start chatting!

## Features

✅ **Text Chat** - Real-time text messaging
✅ **Image Sharing** - Upload and share images with preview
✅ **Video Messages** - Upload and share video messages
✅ **Download** - Save any image or video to your device
✅ **Online Status** - See who's online in real-time
✅ **Dark/Light Mode** - Consistent with your app's theme
✅ **Responsive** - Works on desktop and mobile

## File Size Limits

- **Images**: 10MB max
- **Videos**: 50MB max

## Security

- Email/password authentication required
- Row Level Security (RLS) enabled
- Only authenticated users can access
- Users can only update their own messages
- Automatic online/offline status tracking

## Troubleshooting

### "Supabase credentials not configured" warning
- Make sure you've added the environment variables to `.env.local`
- Restart your development server after adding env vars

### Messages not appearing in real-time
- Check that Realtime is enabled for the tables
- Verify the replication settings in Supabase Dashboard

### Upload fails
- Verify storage buckets are created and set to public
- Check file size limits
- Ensure RLS policies are applied to storage buckets

### Can't sign in
- Verify user exists in Supabase Auth Dashboard
- Check that email/password are correct
- Ensure RLS policies are properly set up
