import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'

const AudioPreview = ({ audioUrl, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  return (
    <div className={`audio-preview ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        preload="metadata"
      />
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="audio-play-button"
      >
        {isPlaying ? (
          <Pause size={24} className="text-white" />
        ) : (
          <Play size={24} className="text-white" />
        )}
      </motion.button>
      <div className="audio-progress-container">
        <div className="audio-progress-bar">
          <motion.div
            className="audio-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  )
}

export default AudioPreview

