import { adminSupabase } from './adminSupabase'

const AUDIO_BUCKET = 'beats'
const PREVIEW_BUCKET = 'beats'

/**
 * Upload audio file to Supabase Storage
 * @param {File} file - Audio file to upload
 * @param {string} beatId - Beat ID (UUID)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadAudioFile(file, beatId) {
  // Validate file type
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload MP3, WAV, or M4A files.')
  }

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 50MB limit.')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${beatId}/${Date.now()}.${fileExt}`
  const filePath = `audio/${fileName}`

  const { data, error } = await adminSupabase.storage
    .from(AUDIO_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading audio file:', error)
    throw error
  }

  // Get public URL
  const { data: urlData } = adminSupabase.storage
    .from(AUDIO_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Upload preview image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} beatId - Beat ID (UUID)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadPreviewImage(file, beatId) {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Image size exceeds 5MB limit.')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${beatId}/${Date.now()}.${fileExt}`
  const filePath = `previews/${fileName}`

  const { data, error } = await adminSupabase.storage
    .from(PREVIEW_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading preview image:', error)
    throw error
  }

  // Get public URL
  const { data: urlData } = adminSupabase.storage
    .from(PREVIEW_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Path to file in storage
 * @param {string} bucket - Bucket name
 */
export async function deleteFile(filePath, bucket = AUDIO_BUCKET) {
  const { error } = await adminSupabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

