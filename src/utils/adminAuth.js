import { useUser } from '@clerk/clerk-react'

const ADMIN_EMAILS = [
  'rashawnm09@gmail.com',
  'wdonte97@gmail.com'
]

/**
 * Check if the current user is an admin
 * @returns {boolean} True if user is admin
 */
export function useIsAdmin() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded || !user) {
    return false
  }
  
  const userEmail = user.primaryEmailAddress?.emailAddress
  return ADMIN_EMAILS.includes(userEmail)
}

/**
 * Get admin status (non-hook version for use outside components)
 * @param {Object} user - Clerk user object
 * @returns {boolean} True if user is admin
 */
export function isAdmin(user) {
  if (!user) {
    return false
  }
  
  const userEmail = user.primaryEmailAddress?.emailAddress
  return ADMIN_EMAILS.includes(userEmail)
}

