import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets, validateFormData, trackConversion } from '../utils/googleSheets'
import { 
  Download, 
  Music, 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Play,
  Headphones,
  Zap,
  Gift
} from 'lucide-react'

const BeatPackLanding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form data
    const validation = validateFormData(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Submit to Google Sheets
      await submitToGoogleSheets(formData)
      
      // Track conversion
      trackConversion('lead_generated', {
        firstName: formData.firstName,
        email: formData.email,
        hasPhone: !!formData.phone
      })
      
      // Navigate to thank you page with form data
      navigate('/thank-you', { 
        state: { 
          firstName: formData.firstName,
          email: formData.email 
        } 
      })
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"></div>
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Copy */}
            <div className="space-y-8">
              {/* Urgency Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium"
              >
                <Clock size={16} />
                Limited Time: Free for First 1000 Downloads
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Get Your FREE
                  <span className="block gradient-text">
                    Premium Beat Pack
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                  10 exclusive, royalty-free beats produced in our professional studio. 
                  Perfect for artists, content creators, and music producers.
                </p>
              </motion.div>

              {/* Value Props */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {[
                  { icon: Music, text: "10 Premium Beats" },
                  { icon: Download, text: "Instant Download" },
                  { icon: CheckCircle, text: "Royalty Free" },
                  { icon: Zap, text: "Studio Quality" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <item.icon size={20} className="text-white" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-gray-400">2,847+ downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="text-yellow-400" style={{ fill: '#fbbf24' }} />
                  ))}
                  <span className="text-sm sm:text-base text-gray-400 ml-2">4.9/5 rating</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">Claim Your Free Beats</h3>
                  <p className="text-lg text-gray-400">Enter your details to get instant access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-4 text-lg bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors ${
                          errors.firstName ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-4 text-lg bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors ${
                          errors.lastName ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 text-lg bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 text-lg bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-white py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f97316)' }}
                  >
                    {isSubmitting ? (
                      <div className="loading-dots">Getting Your Beats</div>
                    ) : (
                      <>
                        <Download size={20} />
                        Get Free Beat Pack
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    * Required fields. We respect your privacy and won't spam you.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beat Preview Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What's Inside Your <span className="gradient-text">Beat Pack</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each beat is professionally mixed and mastered, ready for your next project
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Midnight Vibes", genre: "Trap", bpm: "140 BPM" },
              { name: "City Dreams", genre: "Hip-Hop", bpm: "85 BPM" },
              { name: "Neon Nights", genre: "Electronic", bpm: "128 BPM" },
              { name: "Street Symphony", genre: "Drill", bpm: "150 BPM" },
              { name: "Cosmic Flow", genre: "Ambient", bpm: "90 BPM" },
              { name: "Fire Storm", genre: "Trap", bpm: "145 BPM" }
            ].map((beat, index) => (
              <motion.div
                key={beat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={20} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-400">{beat.bpm}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{beat.name}</h3>
                <p className="text-purple-400 text-sm">{beat.genre}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Artists Are <span className="gradient-text">Saying</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcus Johnson",
                role: "Hip-Hop Artist",
                text: "These beats are fire! Used three of them for my latest mixtape. The quality is incredible for free content.",
                rating: 5
              },
              {
                name: "Sarah Chen",
                role: "Content Creator",
                text: "Perfect for my YouTube videos. No copyright issues and they sound professionally produced. Highly recommend!",
                rating: 5
              },
              {
                name: "DJ Mike",
                role: "Music Producer",
                text: "5D Labs consistently delivers quality. This beat pack is no exception. Great variety and clean mixes.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" style={{ fill: '#fbbf24' }} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-purple-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't Miss Out on This <span className="gradient-text">Free Offer</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of creators who have already downloaded our beats. 
              Get yours now before this limited-time offer ends.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
              className="text-white px-10 py-5 rounded-xl font-bold text-xl flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f97316)' }}
            >
              <Headphones size={20} />
              Claim Your Free Beats Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default BeatPackLanding
