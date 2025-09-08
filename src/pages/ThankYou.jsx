import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { 
  Download, 
  CheckCircle, 
  Music, 
  Share2, 
  Instagram, 
  Youtube, 
  Twitch,
  Mail,
  ArrowRight,
  Headphones,
  Star,
  Gift,
  Heart
} from 'lucide-react'

const ThankYou = () => {
  const location = useLocation()
  const [downloadStarted, setDownloadStarted] = useState(false)
  const { firstName, email } = location.state || { firstName: 'Friend', email: '' }

  // Auto-start download after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!downloadStarted) {
        handleDownload()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [downloadStarted])

  const handleDownload = () => {
    setDownloadStarted(true)
    
    // Create download link for the beat pack
    // Make sure to add your actual beat pack ZIP file to the /public folder
    const link = document.createElement('a')
    link.href = '/5d-labs-premium-beat-pack.zip' // Your beat pack file in /public folder
    link.download = '5D-Labs-Premium-Beat-Pack.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Track download event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        event_category: 'Beat Pack',
        event_label: 'Free Beat Pack Download'
      })
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/5dlabs',
      color: 'hover:text-pink-500'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@5dlabs',
      color: 'hover:text-red-500'
    },
    {
      name: 'Twitch',
      icon: Twitch,
      url: 'https://twitch.tv/5dlabs',
      color: 'hover:text-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 px-4">
      {/* Success Animation */}
      <section className="py-8 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2 
            }}
            className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/25"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              🎉 Welcome to the Family, <span className="gradient-text">{firstName}</span>!
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Your premium beat pack is ready! Check your email for additional resources and exclusive offers.
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music size={32} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Beat Pack is Ready!</h2>
              <p className="text-gray-400">
                {downloadStarted 
                  ? "Download started automatically. If it didn't start, click the button below." 
                  : "Click the button below to download your free beats."
                }
              </p>
            </div>

            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all ${
                downloadStarted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/25'
              } hover:shadow-lg`}
            >
              <Download size={24} />
              {downloadStarted ? 'Download Again' : 'Download Beat Pack'}
              <span className="text-sm opacity-75">(ZIP • 45MB)</span>
            </motion.button>

            {/* Download Details */}
            <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <Headphones size={16} className="text-purple-400" />
                <span>10 Premium Beats</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle size={16} className="text-green-400" />
                <span>Royalty Free</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Star size={16} className="text-yellow-400" />
                <span>Studio Quality</span>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6">What's Next?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Check Your Email</h4>
                <p className="text-gray-400 text-sm">
                  We've sent you usage tips, licensing info, and exclusive producer content to {email?.substring(0, 20)}...
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Share2 size={24} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Share Your Creation</h4>
                <p className="text-gray-400 text-sm">
                  Made something amazing? Tag us @5dlabs to be featured on our social media!
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Gift size={24} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Get More Beats</h4>
                <p className="text-gray-400 text-sm">
                  Want more? Check out our premium beat collections and studio services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Follow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 sm:p-8 rounded-2xl border border-purple-500/20 mb-8 sm:mb-12"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              Stay Connected for More <span className="gradient-text">Free Content</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Follow us on social media for behind-the-scenes content, production tips, and exclusive beat releases.
            </p>
            
            <div className="flex justify-center gap-4 mb-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600 transition-all ${social.color}`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              <Heart size={16} className="inline text-red-500" /> Made with love at 5D Labs Studio
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Ready to Take Your Music Further?</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Book a session at our professional studio or explore our premium services to elevate your sound.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/studio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Explore Studio
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-purple-500 text-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/10 transition-all"
                >
                  View Services
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg italic text-gray-300 mb-6">
              "The quality of these free beats is insane! I've used them in multiple projects and they always deliver. 5D Labs knows what they're doing."
            </blockquote>
            <div>
              <p className="font-semibold text-white">Alex Rivera</p>
              <p className="text-purple-400">Independent Artist</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ThankYou
