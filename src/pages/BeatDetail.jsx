import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import AudioPreview from '../components/AudioPreview'
import LicenseTierCard from '../components/LicenseTierCard'
import { fetchBeatById } from '../utils/supabaseClient'

const licenseTiers = [
  {
    name: 'Basic Lease',
    format: 'MP3',
    price: '$29.99',
    features: [
      '10k streams',
      '1k sales',
      'MP3 format',
      'Great for demos',
    ],
    paymentLink: 'https://buy.stripe.com/5kQaEX4yp5511w39NQgA800',
  },
  {
    name: 'Premium Lease',
    format: 'WAV',
    price: '$49.99',
    features: [
      '50k streams',
      '5k sales',
      'WAV format',
      'Higher quality',
    ],
    paymentLink: 'https://buy.stripe.com/dRm14n6Gx40XgqX9NQgA801',
  },
  {
    name: 'Unlimited Lease',
    format: 'WAV + Stems',
    price: '$99.99',
    features: [
      'Unlimited streams',
      'Unlimited sales',
      'WAV + Stems',
      'Professional mixing',
    ],
    paymentLink: 'https://buy.stripe.com/9B6cN56Gxbtp7Urd02gA802',
  },
  {
    name: 'Exclusive License',
    format: 'Full Rights',
    price: '$299.99',
    features: [
      'Full ownership',
      'Master rights',
      'Publishing rights',
      'Beat removed from market',
    ],
    paymentLink: 'https://buy.stripe.com/6oUdR92qhbtp3Ebd02gA803',
  },
]

const BeatDetail = () => {
  const { beatId } = useParams()
  const navigate = useNavigate()
  const [beat, setBeat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBeat = async () => {
      try {
        setLoading(true)
        const beatData = await fetchBeatById(beatId)
        setBeat(beatData)
      } catch (err) {
        console.error('Error loading beat:', err)
        setError('Beat not found or no longer available.')
      } finally {
        setLoading(false)
      }
    }

    if (beatId) {
      loadBeat()
    }
  }, [beatId])

  const handleCheckout = async (tier, beatId) => {
    // Navigate to Stripe payment link
    // Note: For the webhook to work correctly, each Payment Link in Stripe Dashboard
    // should be configured with metadata: beat_id and license_type
    // Since Payment Links are static, you may need to configure default metadata
    // or use Stripe API to create dynamic checkout sessions
    if (tier.paymentLink) {
      window.location.href = tier.paymentLink
    }
  }

  if (loading) {
    return (
      <div className="beat-detail-loading">
        <div className="loading-spinner" />
        <p>Loading beat...</p>
      </div>
    )
  }

  if (error || !beat) {
    return (
      <div className="beat-detail-error">
        <p>{error || 'Beat not found'}</p>
        <button onClick={() => navigate('/store')} className="back-button">
          Back to Store
        </button>
      </div>
    )
  }

  return (
    <div className="beat-detail">
      <div className="container">
        <motion.button
          className="beat-detail-back"
          onClick={() => navigate('/store')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Store
        </motion.button>

        <div className="beat-detail-content">
          {/* Beat Info Section */}
          <motion.div
            className="beat-detail-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="beat-detail-image">
              {beat.preview_url ? (
                <img src={beat.preview_url} alt={beat.title} />
              ) : (
                <div className="beat-detail-placeholder">
                  <span>{beat.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="beat-detail-main">
              <h1 className="beat-detail-title">{beat.title}</h1>
              <div className="beat-detail-meta">
                {beat.bpm && (
                  <div className="beat-detail-meta-item">
                    <span className="meta-label">BPM</span>
                    <span className="meta-value">{beat.bpm}</span>
                  </div>
                )}
                {beat.key && (
                  <div className="beat-detail-meta-item">
                    <span className="meta-label">Key</span>
                    <span className="meta-value">{beat.key}</span>
                  </div>
                )}
                {beat.genre && (
                  <div className="beat-detail-meta-item">
                    <span className="meta-label">Genre</span>
                    <span className="meta-value">{beat.genre}</span>
                  </div>
                )}
              </div>
              <div className="beat-detail-preview">
                <h3 className="preview-title">Preview</h3>
                <AudioPreview audioUrl={beat.audio_url} />
              </div>
            </div>
          </motion.div>

          {/* License Tiers Section */}
          <motion.div
            className="beat-detail-licenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="licenses-title">Choose Your License</h2>
            <div className="licenses-grid">
              {licenseTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <LicenseTierCard
                    tier={tier}
                    beatId={beat.id}
                    onCheckout={handleCheckout}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BeatDetail

