import { supabase } from './supabaseClient'

const AUDIO_BUCKET = 'beats'
const PREVIEW_BUCKET = 'beats'

/**
 * Ensure a storage bucket exists, create it if it doesn't
 * @param {string} bucketName - Name of the bucket
 */
async function ensureBucketExists(bucketName) {
  // Note: Bucket creation requires service role key, so this check is informational only
  // Buckets should be created manually in Supabase dashboard or via backend API
  try {
    // Try to list files in the bucket to check if it exists
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 })
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:ensureBucketExists',message:'Bucket existence check',data:{bucketName,listError:listError?.message||null,bucketAccessible:!listError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion

    if (listError) {
      // If we can't access the bucket, it might not exist or we don't have permissions
      if (listError.message?.includes('not found') || listError.message?.includes('Bucket not found')) {
        throw new Error(
          `Storage bucket "${bucketName}" not found. ` +
          `Please create it in your Supabase dashboard: ` +
          `Storage > New bucket > Name: "${bucketName}" > Public: Yes. ` +
          `Then set up storage policies to allow uploads.`
        )
      }
      // Other errors might be permission-related
      console.warn('Bucket access check failed:', listError.message)
    }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:ensureBucketExists',message:'Bucket check exception',data:{bucketName,error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
    // #endregion

    // Re-throw with more context if it's not already a helpful error
    if (error.message?.includes('Storage bucket')) {
      throw error
    }
    throw new Error(
      `Failed to access storage bucket "${bucketName}". ` +
      `Please ensure the bucket exists in your Supabase project. ` +
      `Original error: ${error.message}`
    )
  }
}

/**
 * Upload audio file to Supabase Storage
 * @param {File} file - Audio file to upload
 * @param {string} beatId - Beat ID (UUID)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadAudioFile(file, beatId) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:12',message:'uploadAudioFile entry',data:{fileName:file.name,fileSize:file.size,fileType:file.type,beatId,audioBucket:AUDIO_BUCKET},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion

  // Validate file type - support common audio formats
  const allowedTypes = [
    'audio/mpeg', 
    'audio/mp3', 
    'audio/wav', 
    'audio/wave',
    'audio/x-wav',
    'audio/x-m4a',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
    'audio/flac'
  ]
  
  // Also check file extension as fallback (some browsers don't set MIME type correctly)
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm', 'flac']
  
  const isValidType = allowedTypes.includes(file.type) || 
                      (fileExt && allowedExtensions.includes(fileExt))
  
  if (!isValidType) {
    throw new Error('Invalid file type. Please upload MP3, WAV, M4A, AAC, OGG, WebM, or FLAC files.')
  }

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 50MB limit.')
  }

  // Use the fileExt we already extracted, or get it again if needed
  const finalFileExt = fileExt || file.name.split('.').pop()
  const fileName = `${beatId}/${Date.now()}.${finalFileExt}`
  const filePath = `audio/${fileName}`

  // Ensure bucket exists before uploading
  await ensureBucketExists(AUDIO_BUCKET)

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:48',message:'Before storage upload',data:{filePath,audioBucket:AUDIO_BUCKET},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
  // #endregion

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:60',message:'Upload result',data:{success:!error,errorCode:error?.statusCode,errorMessage:error?.message,errorName:error?.name,hasData:!!data,dataPath:data?.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
  // #endregion

  if (error) {
    console.error('Error uploading audio file:', error)
    
    // Provide more helpful error messages
    if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
      throw new Error(
        `Storage bucket "${AUDIO_BUCKET}" not found. ` +
        `Please create it in your Supabase dashboard: ` +
        `Storage > New bucket > Name: "${AUDIO_BUCKET}" > Public: Yes. ` +
        `The bucket should be public to allow file access.`
      )
    }
    
    throw error
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(AUDIO_BUCKET)
    .getPublicUrl(data.path)

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:70',message:'uploadAudioFile success',data:{publicUrl:urlData?.publicUrl?.substring(0,50)+'...'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

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

  // Ensure bucket exists before uploading
  await ensureBucketExists(PREVIEW_BUCKET)

  const { data, error } = await supabase.storage
    .from(PREVIEW_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading preview image:', error)
    
    // Provide more helpful error messages
    if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
      throw new Error(
        `Storage bucket "${PREVIEW_BUCKET}" not found. ` +
        `Please create it in your Supabase dashboard: ` +
        `Storage > New bucket > Name: "${PREVIEW_BUCKET}" > Public: Yes. ` +
        `The bucket should be public to allow file access.`
      )
    }
    
    throw error
  }

  // Get public URL
  const { data: urlData } = supabase.storage
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
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

