"""Database connection module using Supabase client."""
from supabase import create_client, Client

from backend.config import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

# Initialize Supabase client with service role key (bypasses RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

