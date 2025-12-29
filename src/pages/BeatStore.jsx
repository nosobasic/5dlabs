import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FeaturedCarousel from '../components/FeaturedCarousel'
import BeatCard from '../components/BeatCard'
import { fetchBeats, fetchFeaturedBeats } from '../utils/supabaseClient'

const BeatStore = () => {
  const [beats, setBeats] = useState([])
  const [featuredBeats, setFeaturedBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBeats = async () => {
      try {
        setLoading(true)
        const [allBeats, featured] = await Promise.all([
          fetchBeats(),
          fetchFeaturedBeats(),
        ])
        setBeats(allBeats)
        setFeaturedBeats(featured)
      } catch (err) {
        console.error('Error loading beats:', err)
        setError('Failed to load beats. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadBeats()
  }, [])

  if (loading) {
    return (
      <div className="beat-store-loading">
        <div className="loading-spinner" />
        <p>Loading beats...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="beat-store-error">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="beat-store">
      {/* Featured Section */}
      <section className="beat-store-featured">
        <FeaturedCarousel beats={featuredBeats} />
      </section>

      {/* All Beats Section */}
      <section className="beat-store-list">
        <div className="container">
          <motion.h2
            className="beat-store-section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            All Beats
          </motion.h2>
          {beats.length === 0 ? (
            <div className="beat-store-empty">
              <p>No beats available at the moment.</p>
            </div>
          ) : (
            <motion.div
              className="beat-store-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {beats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <BeatCard beat={beat} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BeatStore

