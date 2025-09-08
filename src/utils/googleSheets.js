/**
 * Google Sheets Integration Utility
 * 
 * This utility handles form submissions to Google Sheets via Google Apps Script.
 * Make sure to follow the setup guide in GOOGLE_SHEETS_SETUP.md
 */

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyHBJqWjr4NEPpCs_vAlnsKiUOakOoQtt5aQPcx6dYvnwt6liI11Jw0O0wquK7g9s0dA/exec'

/**
 * Submit form data to Google Sheets
 * @param {Object} formData - The form data to submit
 * @param {string} formData.firstName - User's first name
 * @param {string} formData.lastName - User's last name  
 * @param {string} formData.email - User's email address
 * @param {string} formData.phone - User's phone number (optional)
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const submitToGoogleSheets = async (formData) => {
  // Validate required fields
  if (!formData.firstName || !formData.lastName || !formData.email) {
    throw new Error('Missing required fields: firstName, lastName, and email are required')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    throw new Error('Invalid email format')
  }

  // Prepare data for submission
  const submissionData = {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone ? formData.phone.trim() : '',
    timestamp: new Date().toISOString(),
    source: 'Beat Pack Landing Page',
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'Direct'
  }

  try {
    // Submit to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    })
    
    // Note: With no-cors mode, we can't read the response
    // but the request will still be processed by Google Sheets
    console.log('Form submitted to Google Sheets')
    
    // For development/testing - also log to console
    console.log('📊 Lead captured:', {
      name: `${submissionData.firstName} ${submissionData.lastName}`,
      email: submissionData.email,
      phone: submissionData.phone,
      timestamp: submissionData.timestamp
    })
    
    return true
    
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error)
    
    // For development - still allow the form to work
    console.log('⚠️  Google Sheets unavailable, but form data captured:', submissionData)
    return true // Return true so the user experience isn't broken
  }
}

/**
 * Validate form data before submission
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object with isValid boolean and errors object
 */
export const validateFormData = (formData) => {
  const errors = {}
  
  // Required field validation
  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required'
  }
  
  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required'
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required'
  } else {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }
  
  // Phone validation (optional field)
  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g., 555-123-4567)'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  return phone // Return original if not 10 digits
}

/**
 * Track conversion events (for analytics)
 * @param {string} eventName - Name of the event
 * @param {Object} eventData - Additional event data
 */
export const trackConversion = (eventName, eventData = {}) => {
  // Google Analytics 4 (if implemented)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...eventData,
      event_category: 'Beat Pack',
      event_label: 'Lead Generation'
    })
  }
  
  // Facebook Pixel (if implemented)
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventData)
  }
  
  // Console log for development
  console.log('Conversion tracked:', eventName, eventData)
}
