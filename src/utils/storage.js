import { adminSupabase } from './adminSupabase'

const AUDIO_BUCKET = 'beats'
const PREVIEW_BUCKET = 'beats'

/**
 * Ensure a storage bucket exists, create it if it doesn't
 * @param {string} bucketName - Name of the bucket
 */
async function ensureBucketExists(bucketName) {
  try {
    // Check if bucket exists by listing all buckets
    const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets()
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:ensureBucketExists',message:'Bucket existence check',data:{bucketName,bucketCount:buckets?.length||0,bucketNames:buckets?.map(b=>b.name)||[],bucketExists:buckets?.some(b=>b.name===bucketName),listError:listError?.message||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion

    if (listError) {
      console.error('Error listing buckets:', listError)
      throw new Error(`Failed to check bucket existence: ${listError.message}`)
    }

    const bucketExists = buckets?.some(b => b.name === bucketName) || false

    if (!bucketExists) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:ensureBucketExists',message:'Creating missing bucket',data:{bucketName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Create the bucket if it doesn't exist
      const { data: newBucket, error: createError } = await adminSupabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: null, // Allow all file types
        fileSizeLimit: 52428800 // 50MB in bytes
      })

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:ensureBucketExists',message:'Bucket creation result',data:{bucketName,success:!createError,createError:createError?.message||null,createdBucket:newBucket?.name||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (createError) {
        // If bucket creation fails, provide helpful error message
        if (createError.message?.includes('already exists')) {
          // Bucket was created by another process, continue
          return
        }
        throw new Error(
          `Storage bucket "${bucketName}" does not exist and could not be created. ` +
          `Please create it manually in your Supabase dashboard: ` +
          `Go to Storage > New bucket > Name: "${bucketName}" > Public: Yes. ` +
          `Error: ${createError.message}`
        )
      }
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
  fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:48',message:'Before storage upload',data:{filePath,audioBucket:AUDIO_BUCKET,supabaseUrl:adminSupabase.supabaseUrl?.substring(0,30)+'...',hasServiceKey:!!adminSupabase.supabaseKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
  // #endregion

  // Check if bucket exists by attempting to list it first
  // #region agent log
  try {
    const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets();
    fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:52',message:'Bucket list check',data:{bucketCount:buckets?.length||0,bucketNames:buckets?.map(b=>b.name)||[],targetBucket:AUDIO_BUCKET,bucketExists:buckets?.some(b=>b.name===AUDIO_BUCKET),listError:listError?.message||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
  } catch (err) {
    fetch('http://127.0.0.1:7243/ingest/61ed75b7-8598-4367-92fa-bd31396dda7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.js:54',message:'Bucket list error',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
  }
  // #endregion

  const { data, error } = await adminSupabase.storage
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
  const { data: urlData } = adminSupabase.storage
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

  const { data, error } = await adminSupabase.storage
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

