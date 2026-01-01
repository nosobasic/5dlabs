import { createClient } from '@supabase/supabase-js'

// Backend API URL - use environment variable or default to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://fivedlabs.onrender.com'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// ⚠️ WARNING: This file previously used the service role key which should NOT be exposed in the browser
// All admin operations now go through the backend API for security
// The adminSupabase client below is kept for backward compatibility but is no longer used

// Initialize Supabase client conditionally - only if service role key exists
// If key is missing, adminSupabase will be null and functions will throw helpful errors
let adminSupabase = null

if (supabaseUrl && supabaseServiceRoleKey) {
  adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey)
} else {
  console.warn('Admin Supabase client: Service role key not found. Admin read operations will fail.')
  console.warn('⚠️ SECURITY: This is expected - VITE_SUPABASE_SERVICE_ROLE_KEY should NOT be in frontend.')
  console.warn('Admin operations should use backend API endpoints instead.')
}

// #region agent log
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'adminSupabase.js:12',message:'adminSupabase client initialized',data:{hasUrl:!!supabaseUrl,urlPrefix:supabaseUrl?.substring(0,30)+'...',hasServiceKey:!!supabaseServiceRoleKey,serviceKeyLength:supabaseServiceRoleKey?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
}
// #endregion

/**
 * Fetch all beats (including inactive) - Admin only
 * Uses backend API instead of direct Supabase access
 */
export async function fetchAllBeats() {
  try {
    const response = await fetch(`${API_URL}/api/beats/`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch beats')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching all beats:', error)
    throw error
  }
}

/**
 * Fetch all orders - Admin only
 * Uses backend API instead of direct Supabase access
 */
export async function fetchAllOrders() {
  try {
    const response = await fetch(`${API_URL}/api/orders/`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch orders')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

/**
 * Fetch order by ID - Admin only
 * Uses backend API instead of direct Supabase access
 */
export async function fetchOrderById(orderId) {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch order')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

/**
 * Fetch all licenses - Admin only
 * Uses backend API instead of direct Supabase access
 */
export async function fetchAllLicenses() {
  try {
    const response = await fetch(`${API_URL}/api/licenses/`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch licenses')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching licenses:', error)
    throw error
  }
}

/**
 * Fetch all webhook events - Admin only
 * Uses backend API instead of direct Supabase access
 */
export async function fetchWebhookEvents() {
  try {
    const response = await fetch(`${API_URL}/api/webhooks/`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch webhook events')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching webhook events:', error)
    throw error
  }
}

