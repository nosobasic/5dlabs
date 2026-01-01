// Backend API URL - use environment variable or default to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://fivedlabs.onrender.com'

/**
 * Create a new beat
 * @param {Object} beatData - Beat data object
 * @returns {Promise<Object>} Created beat
 */
export async function createBeat(beatData) {
  // Ensure is_active is set to true by default for new beats
  const beatDataWithDefaults = {
    ...beatData,
    is_active: beatData.is_active !== undefined ? beatData.is_active : true
  }

  try {
    const response = await fetch(`${API_URL}/api/beats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(beatDataWithDefaults),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create beat')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error creating beat:', error)
    throw error
  }
}

/**
 * Update an existing beat
 * @param {string} beatId - Beat ID
 * @param {Object} beatData - Updated beat data
 * @returns {Promise<Object>} Updated beat
 */
export async function updateBeat(beatId, beatData) {
  try {
    const response = await fetch(`${API_URL}/api/beats/${beatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(beatData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update beat')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error updating beat:', error)
    throw error
  }
}

/**
 * Delete a beat
 * @param {string} beatId - Beat ID
 */
export async function deleteBeat(beatId) {
  try {
    const response = await fetch(`${API_URL}/api/beats/${beatId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete beat')
    }
  } catch (error) {
    console.error('Error deleting beat:', error)
    throw error
  }
}

/**
 * Toggle beat active status
 * @param {string} beatId - Beat ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} Updated beat
 */
export async function toggleBeatActive(beatId, isActive) {
  try {
    const response = await fetch(`${API_URL}/api/beats/${beatId}/toggle-active?is_active=${isActive}`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to toggle beat status')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error toggling beat active status:', error)
    throw error
  }
}

/**
 * Fetch single beat by ID (admin - includes inactive)
 * @param {string} beatId - Beat ID
 * @returns {Promise<Object>} Beat data
 */
export async function fetchBeatById(beatId) {
  try {
    const response = await fetch(`${API_URL}/api/beats/${beatId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch beat')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching beat:', error)
    throw error
  }
}

