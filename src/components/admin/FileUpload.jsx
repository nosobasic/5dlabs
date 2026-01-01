import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { motion } from 'framer-motion'

const FileUpload = ({ 
  label, 
  accept, 
  onFileSelect, 
  currentFile, 
  maxSizeMB = 50,
  required = false 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    setError(null)

    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValidType = acceptedTypes.some(acceptedType => {
        // Handle wildcard patterns like "audio/*" or "image/*"
        if (acceptedType.endsWith('/*')) {
          const baseType = acceptedType.split('/')[0]
          return file.type.startsWith(baseType + '/')
        }
        // Handle specific MIME types like "audio/mpeg" or "image/jpeg"
        return file.type === acceptedType
      })

      if (!isValidType) {
        // Provide more helpful error message
        const allowedTypes = acceptedTypes.map(t => t.replace('/*', ' files')).join(', ')
        setError(`Invalid file type. Please upload ${allowedTypes}.`)
        return
      }
    }

    onFileSelect(file)
  }

  const removeFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="file-upload">
      {label && (
        <label className="file-upload-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${currentFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="file-upload-input"
        />
        {currentFile ? (
          <div className="file-upload-preview">
            <span>{currentFile.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="file-upload-remove"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="file-upload-placeholder">
            <Upload size={32} />
            <p>Click or drag file to upload</p>
            <p className="file-upload-hint">Max size: {maxSizeMB}MB</p>
          </div>
        )}
      </div>
      {error && <p className="file-upload-error">{error}</p>}
    </div>
  )
}

export default FileUpload

