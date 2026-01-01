# Supabase Storage Setup Guide

## Security Fix Applied

The service role key has been removed from frontend code. The application now uses:
- **Anon key** for storage uploads (with proper policies)
- **Backend API** for admin database operations (uses service role key server-side)

## Required Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `beats`
4. **Important:** Set it to **Public** (this allows file access)
5. Click "Create bucket"

### 2. Set Up Storage Policies

To allow uploads with the anon key, you need to create storage policies:

1. Go to Storage → `beats` bucket → Policies
2. Click "New Policy"
3. Create an "INSERT" policy:
   - Policy name: `Allow authenticated uploads`
   - Allowed operation: `INSERT`
   - Policy definition:
   ```sql
   (bucket_id = 'beats'::text) AND (auth.role() = 'authenticated'::text)
   ```
   - Or for public uploads (if you want anyone to upload):
   ```sql
   bucket_id = 'beats'::text
   ```

4. Create a "SELECT" policy (for reading files):
   - Policy name: `Allow public reads`
   - Allowed operation: `SELECT`
   - Policy definition:
   ```sql
   bucket_id = 'beats'::text
   ```

### 3. Environment Variables

**Frontend (Vercel):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_API_URL` (optional) - Your backend API URL (defaults to `https://fivedlabs.onrender.com`)

**Backend (Render):**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep this secret!)

### 4. Remove Service Role Key from Frontend

**IMPORTANT:** Remove `VITE_SUPABASE_SERVICE_ROLE_KEY` from your Vercel environment variables. It should only exist on the backend (Render).

## Testing

After setup:
1. The bucket should be accessible
2. File uploads should work using the anon key
3. Beat creation/updates go through the backend API
4. No service role key is exposed in the browser

