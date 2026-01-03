import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import FileUpload from '../../components/admin/FileUpload'
import { createBeat, updateBeat, fetchBeatById } from '../../utils/beatAdmin'
import { uploadAudioFile, uploadPreviewImage } from '../../utils/storage'

const BeatForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    bpm: '',
    key: '',
    genre: '',
    price_cents: '',
    license_type: 'basic',
    audio_url: '',
    preview_url: '',
    producer_name: '',
    licensor_legal_name: ''
  })
  const [audioFile, setAudioFile] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      loadBeat()
    }
  }, [id])

  const loadBeat = async () => {
    try {
      setLoading(true)
      const beat = await fetchBeatById(id)
      setFormData({
        title: beat.title || '',
        bpm: beat.bpm || '',
        key: beat.key || '',
        genre: beat.genre || '',
        price_cents: beat.price_cents || '',
        license_type: beat.license_type || 'basic',
        audio_url: beat.audio_url || '',
        preview_url: beat.preview_url || '',
        producer_name: beat.producer_name || '',
        licensor_legal_name: beat.licensor_legal_name || ''
      })
    } catch (error) {
      console.error('Error loading beat:', error)
      setError('Failed to load beat')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Title is required')
        setSaving(false)
        return
      }

      if (!formData.price_cents || parseInt(formData.price_cents) <= 0) {
        setError('Price must be greater than 0')
        setSaving(false)
        return
      }

      // For new beats, audio file is required
      if (!isEdit && !audioFile) {
        setError('Audio file is required for new beats')
        setSaving(false)
        return
      }

      let audioUrl = formData.audio_url
      let previewUrl = formData.preview_url

      // Upload audio file if new file selected
      if (audioFile) {
        try {
          const beatId = id || crypto.randomUUID()
          audioUrl = await uploadAudioFile(audioFile, beatId)
        } catch (uploadError) {
          setError(uploadError.message || 'Failed to upload audio file')
          setSaving(false)
          return
        }
      }

      // Validate that we have an audio URL
      if (!audioUrl) {
        setError('Audio file is required')
        setSaving(false)
        return
      }

      // Upload preview image if new file selected
      if (previewFile) {
        try {
          const beatId = id || crypto.randomUUID()
          previewUrl = await uploadPreviewImage(previewFile, beatId)
        } catch (uploadError) {
          setError(uploadError.message || 'Failed to upload preview image')
          setSaving(false)
          return
        }
      }

      const beatData = {
        title: formData.title.trim(),
        bpm: formData.bpm ? parseInt(formData.bpm) : null,
        key: formData.key ? formData.key.trim() : null,
        genre: formData.genre ? formData.genre.trim() : null,
        price_cents: parseInt(formData.price_cents),
        license_type: formData.license_type,
        audio_url: audioUrl,
        preview_url: previewUrl || null,
        producer_name: formData.producer_name ? formData.producer_name.trim() : null,
        licensor_legal_name: formData.licensor_legal_name ? formData.licensor_legal_name.trim() : null
      }

      if (isEdit) {
        await updateBeat(id, beatData)
      } else {
        await createBeat(beatData)
      }

      navigate('/admin/beats')
    } catch (error) {
      console.error('Error saving beat:', error)
      // Provide more specific error messages
      if (error.message) {
        setError(error.message)
      } else if (error.code) {
        setError(`Database error: ${error.code}. Please check your connection and try again.`)
      } else {
        setError('Failed to save beat. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="admin-loading">
            <div className="loading-spinner" />
            <p>Loading beat...</p>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-page-header">
            <motion.button
              className="admin-button secondary"
              onClick={() => navigate('/admin/beats')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>
            <motion.h1
              className="admin-page-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isEdit ? 'Edit Beat' : 'Create New Beat'}
            </motion.h1>
          </div>

          {error && (
            <div className="admin-error">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>BPM</label>
                <input
                  type="number"
                  value={formData.bpm}
                  onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g., C Major"
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g., Hip Hop"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Price (cents) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price_cents}
                  onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                  required
                  min="0"
                  placeholder="2999 for $29.99"
                />
              </div>
              <div className="form-group">
                <label>
                  License Type <span className="required">*</span>
                </label>
                <select
                  value={formData.license_type}
                  onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="unlimited">Unlimited</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Producer Name (Optional)</label>
                <input
                  type="text"
                  value={formData.producer_name}
                  onChange={(e) => setFormData({ ...formData, producer_name: e.target.value })}
                  placeholder="Leave empty to use default from environment"
                />
                <p className="form-hint">If not specified, will use PRODUCER_NAME environment variable</p>
              </div>
              <div className="form-group">
                <label>Licensor Legal Name (Optional)</label>
                <input
                  type="text"
                  value={formData.licensor_legal_name}
                  onChange={(e) => setFormData({ ...formData, licensor_legal_name: e.target.value })}
                  placeholder="Leave empty to use default from environment"
                />
                <p className="form-hint">If not specified, will use LICENSOR_LEGAL_NAME environment variable</p>
              </div>
            </div>

            <div className="form-group">
              <FileUpload
                label="Audio File"
                accept="audio/*"
                onFileSelect={setAudioFile}
                currentFile={audioFile}
                maxSizeMB={50}
                required={!isEdit}
              />
              {isEdit && formData.audio_url && !audioFile && (
                <p className="form-hint">Current: {formData.audio_url}</p>
              )}
            </div>

            <div className="form-group">
              <FileUpload
                label="Preview Image (Optional)"
                accept="image/*"
                onFileSelect={setPreviewFile}
                currentFile={previewFile}
                maxSizeMB={5}
              />
              {isEdit && formData.preview_url && !previewFile && (
                <p className="form-hint">Current: {formData.preview_url}</p>
              )}
            </div>

            <div className="form-actions">
              <motion.button
                type="submit"
                className="admin-button primary"
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={20} />
                {saving ? 'Saving...' : isEdit ? 'Update Beat' : 'Create Beat'}
              </motion.button>
              <button
                type="button"
                className="admin-button secondary"
                onClick={() => navigate('/admin/beats')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default BeatForm

