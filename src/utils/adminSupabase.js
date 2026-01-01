import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Admin Supabase client: Missing environment variables. Admin operations may not work correctly.')
}

// Initialize Supabase client with service role key for admin operations
// This bypasses RLS and should only be used in admin context
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey)

// #region agent log
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'adminSupabase.js:12',message:'adminSupabase client initialized',data:{hasUrl:!!supabaseUrl,urlPrefix:supabaseUrl?.substring(0,30)+'...',hasServiceKey:!!supabaseServiceRoleKey,serviceKeyLength:supabaseServiceRoleKey?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
}
// #endregion

/**
 * Fetch all beats (including inactive) - Admin only
 */
export async function fetchAllBeats() {
  const { data, error } = await adminSupabase
    .from('beats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all beats:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch all orders - Admin only
 */
export async function fetchAllOrders() {
  const { data, error } = await adminSupabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        beats (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch order by ID - Admin only
 */
export async function fetchOrderById(orderId) {
  const { data, error } = await adminSupabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        beats (*),
        licenses (*)
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    throw error
  }

  return data
}

/**
 * Fetch all licenses - Admin only
 */
export async function fetchAllLicenses() {
  const { data, error } = await adminSupabase
    .from('licenses')
    .select(`
      *,
      order_items (
        *,
        beats (*),
        orders (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching licenses:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch all webhook events - Admin only
 */
export async function fetchWebhookEvents() {
  const { data, error } = await adminSupabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching webhook events:', error)
    throw error
  }

  return data || []
}

