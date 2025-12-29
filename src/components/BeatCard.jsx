import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AudioPreview from './AudioPreview'

const BeatCard = ({ beat }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/store/${beat.id}`)
  }

  return (
    <motion.div
      className="beat-card"
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="beat-card-image">
        {beat.preview_url ? (
          <img src={beat.preview_url} alt={beat.title} />
        ) : (
          <div className="beat-card-placeholder">
            <span>{beat.title.charAt(0)}</span>
          </div>
        )}
        <div className="beat-card-overlay" onClick={(e) => e.stopPropagation()}>
          <AudioPreview audioUrl={beat.audio_url} />
        </div>
      </div>
      <div className="beat-card-content">
        <h3 className="beat-card-title">{beat.title}</h3>
        <div className="beat-card-meta">
          {beat.bpm && <span className="beat-meta-item">{beat.bpm} BPM</span>}
          {beat.key && <span className="beat-meta-item">{beat.key}</span>}
          {beat.genre && <span className="beat-meta-item">{beat.genre}</span>}
        </div>
      </div>
    </motion.div>
  )
}

export default BeatCard

