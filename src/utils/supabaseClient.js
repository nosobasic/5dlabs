import { createClient } from '@supabase/supabase-js'

// Vite requires VITE_ prefix for environment variables exposed to client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch all active beats
 */
export async function fetchBeats() {
  const { data, error } = await supabase
    .from('beats')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching beats:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch featured beats (first 3 active beats)
 */
export async function fetchFeaturedBeats() {
  const { data, error } = await supabase
    .from('beats')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured beats:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single beat by ID
 */
export async function fetchBeatById(beatId) {
  const { data, error } = await supabase
    .from('beats')
    .select('*')
    .eq('id', beatId)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching beat:', error)
    throw error
  }

  return data
}

