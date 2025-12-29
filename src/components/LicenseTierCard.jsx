import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { Check, Lock } from 'lucide-react'

const LicenseTierCard = ({ tier, beatId, onCheckout }) => {
  const { isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!isSignedIn) {
      return // SignInButton will handle the modal
    }

    if (!tier.paymentLink) {
      console.warn('Payment link not configured for this tier')
      return
    }

    setIsLoading(true)
    try {
      if (onCheckout) {
        await onCheckout(tier, beatId)
      } else {
        // Navigate to Stripe payment link
        window.location.href = tier.paymentLink
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isExclusive = tier.name === 'Exclusive License'
  const hasPaymentLink = !!tier.paymentLink

  return (
    <motion.div
      className={`license-tier-card ${isExclusive ? 'exclusive' : ''}`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {isExclusive && (
        <div className="license-tier-badge">EXCLUSIVE</div>
      )}
      <div className="license-tier-header">
        <h3 className="license-tier-name">{tier.name}</h3>
        <div className="license-tier-format">{tier.format}</div>
      </div>
      <div className="license-tier-price">{tier.price}</div>
      <ul className="license-tier-features">
        {tier.features.map((feature, index) => (
          <li key={index} className="license-tier-feature">
            <Check size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {isSignedIn ? (
        <motion.button
          className={`license-tier-button ${!hasPaymentLink ? 'disabled' : ''}`}
          onClick={handleCheckout}
          disabled={!hasPaymentLink || isLoading}
          whileHover={hasPaymentLink ? { scale: 1.05 } : {}}
          whileTap={hasPaymentLink ? { scale: 0.95 } : {}}
        >
          {isLoading ? 'Processing...' : hasPaymentLink ? 'Purchase' : 'Coming Soon'}
        </motion.button>
      ) : (
        <SignInButton mode="modal">
          <motion.button
            className="license-tier-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lock size={16} />
            Sign In to Purchase
          </motion.button>
        </SignInButton>
      )}
    </motion.div>
  )
}

export default LicenseTierCard

