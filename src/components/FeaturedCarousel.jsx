import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AudioPreview from './AudioPreview'

const FeaturedCarousel = ({ beats }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (beats.length === 0) return

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % beats.length)
      }, 5000) // Auto-advance every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [beats.length, isPaused])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + beats.length) % beats.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % beats.length)
  }

  const handleBeatClick = () => {
    navigate(`/store/${beats[currentIndex].id}`)
  }

  if (beats.length === 0) {
    return null
  }

  const currentBeat = beats[currentIndex]

  return (
    <div
      className="featured-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="featured-carousel-slide"
          onClick={handleBeatClick}
        >
          <div
            className="featured-carousel-background"
            style={{
              backgroundImage: currentBeat.preview_url
                ? `url(${currentBeat.preview_url})`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="featured-carousel-overlay" />
          </div>
          <div className="featured-carousel-content">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="featured-carousel-info"
            >
              <h2 className="featured-carousel-title">{currentBeat.title}</h2>
              <div className="featured-carousel-meta">
                {currentBeat.bpm && (
                  <span className="featured-meta-item">{currentBeat.bpm} BPM</span>
                )}
                {currentBeat.key && (
                  <span className="featured-meta-item">{currentBeat.key}</span>
                )}
                {currentBeat.genre && (
                  <span className="featured-meta-item">{currentBeat.genre}</span>
                )}
              </div>
              <div className="featured-carousel-preview">
                <AudioPreview audioUrl={currentBeat.audio_url} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        className="featured-carousel-nav featured-carousel-nav-prev"
        onClick={goToPrevious}
        aria-label="Previous beat"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        className="featured-carousel-nav featured-carousel-nav-next"
        onClick={goToNext}
        aria-label="Next beat"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots Indicator */}
      <div className="featured-carousel-dots">
        {beats.map((_, index) => (
          <button
            key={index}
            className={`featured-carousel-dot ${
              index === currentIndex ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedCarousel

