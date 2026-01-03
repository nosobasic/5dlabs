# Environment Variables Setup

This application requires the following environment variables to be set in your Vercel project settings.

## Required Variables for Frontend (Vite)

**Important:** Vite requires the `VITE_` prefix for all environment variables that need to be accessible in client-side code.

### Required Variables

1. **VITE_SUPABASE_URL**
   - Your Supabase project URL
   - Found in: Supabase Dashboard → Settings → API → Project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in: Supabase Dashboard → Settings → API → Project API keys → anon/public
   - This is safe to expose in client-side code

3. **VITE_SUPABASE_SERVICE_ROLE_KEY** (Optional, for admin features)
   - Your Supabase service role key
   - Found in: Supabase Dashboard → Settings → API → Project API keys → service_role
   - **⚠️ WARNING:** This key should only be used server-side, but is included here for admin operations
   - Only set this if you need admin functionality

4. **VITE_CLERK_PUBLISHABLE_KEY** (If using Clerk authentication)
   - Your Clerk publishable key
   - Found in: Clerk Dashboard → API Keys

## How to Set in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the exact name (including `VITE_` prefix)
4. Set the value for each environment (Production, Preview, Development)
5. **Important:** After adding/updating environment variables, you must redeploy your application for changes to take effect

## Example Vercel Environment Variables

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (admin only)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... (if using Clerk)
```

## Backend Environment Variables (for Python backend)

If you're running the Python backend separately (e.g., on Render), you'll need:

- `SUPABASE_URL` (without VITE_ prefix)
- `SUPABASE_SERVICE_ROLE_KEY` (without VITE_ prefix)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

- **App is blank/white screen:** Check browser console for errors. Likely missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`
- **Variables not working:** Make sure you used the `VITE_` prefix and redeployed after setting them
- **Admin features not working:** Check that `VITE_SUPABASE_SERVICE_ROLE_KEY` is set







