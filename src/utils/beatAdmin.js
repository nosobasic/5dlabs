import { adminSupabase } from './adminSupabase'

/**
 * Create a new beat
 * @param {Object} beatData - Beat data object
 * @returns {Promise<Object>} Created beat
 */
export async function createBeat(beatData) {
  const { data, error } = await adminSupabase
    .from('beats')
    .insert([beatData])
    .select()
    .single()

  if (error) {
    console.error('Error creating beat:', error)
    throw error
  }

  return data
}

/**
 * Update an existing beat
 * @param {string} beatId - Beat ID
 * @param {Object} beatData - Updated beat data
 * @returns {Promise<Object>} Updated beat
 */
export async function updateBeat(beatId, beatData) {
  const { data, error } = await adminSupabase
    .from('beats')
    .update({
      ...beatData,
      updated_at: new Date().toISOString()
    })
    .eq('id', beatId)
    .select()
    .single()

  if (error) {
    console.error('Error updating beat:', error)
    throw error
  }

  return data
}

/**
 * Delete a beat
 * @param {string} beatId - Beat ID
 */
export async function deleteBeat(beatId) {
  const { error } = await adminSupabase
    .from('beats')
    .delete()
    .eq('id', beatId)

  if (error) {
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
  const { data, error } = await adminSupabase
    .from('beats')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', beatId)
    .select()
    .single()

  if (error) {
    console.error('Error toggling beat active status:', error)
    throw error
  }

  return data
}

/**
 * Fetch single beat by ID (admin - includes inactive)
 * @param {string} beatId - Beat ID
 * @returns {Promise<Object>} Beat data
 */
export async function fetchBeatById(beatId) {
  const { data, error } = await adminSupabase
    .from('beats')
    .select('*')
    .eq('id', beatId)
    .single()

  if (error) {
    console.error('Error fetching beat:', error)
    throw error
  }

  return data
}

