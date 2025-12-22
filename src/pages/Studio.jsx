import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Mic, 
  Monitor, 
  Camera, 
  Video, 
  Lightbulb, 
  Settings,
  MapPin,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react'

const Studio = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const equipment = [
    {
      name: "Neumann Microphone",
      description: "Professional-grade condenser microphone for crystal clear vocals",
      icon: Mic
    },
    {
      name: "Adam A7V Monitors",
      description: "High-fidelity studio monitors for accurate sound reproduction",
      icon: Monitor
    },
    {
      name: "Apollo Audio Interface",
      description: "Premium audio interface with real-time processing",
      icon: Settings
    },
    {
      name: "Professional Lighting",
      description: "Full spectrum lighting setup for photography and video",
      icon: Lightbulb
    }
  ]

  const sections = [
    {
      id: 'music',
      name: 'Music Production',
      description: 'Dedicated space with acoustic treatment and professional equipment',
      icon: Mic
    },
    {
      id: 'photo',
      name: 'Photography',
      description: 'Versatile backdrop system with professional lighting',
      icon: Camera
    },
    {
      id: 'video',
      name: 'Videography',
      description: 'Green screen and multi-camera setup for video production',
      icon: Video
    },
    {
      id: 'podcast',
      name: 'Podcast Recording',
      description: 'Isolated recording area with multiple microphone setup',
      icon: Mic
    }
  ]

  const policies = [
    "2-hour minimum for all bookings",
    "1-hour deposit required to secure booking",
    "Cancellations within 24 hours result in forfeit of deposit",
    "Clients are responsible for any damages incurred during session",
    "Outside photographers and engineers are allowed"
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h1 className="page-title">
              The <span className="gradient-text">Studio</span>
            </h1>
            <p className="page-subtitle">
              One large open floor studio designed for maximum creativity and collaboration. 
              Every corner is optimized for your next masterpiece.
            </p>
          </motion.div>

          {/* Studio Layout */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="studio-layout"
          >
            <div className="studio-sections">
              <h2 className="section-heading">Studio Layout</h2>
              <div className="sections-list">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="section-item"
                  >
                    <div className="section-icon">
                      <section.icon size={24} className="text-white" />
                    </div>
                    <div className="section-content">
                      <h3 className="section-name">{section.name}</h3>
                      <p className="section-description">{section.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="studio-visualization">
              <div className="visualization-card">
                <div className="visualization-placeholder">
                  <div className="visualization-content">
                    <MapPin size={48} className="text-purple-400 mx-auto mb-4" />
                    <p className="visualization-text">Studio Layout Visualization</p>
                    <p className="visualization-subtext">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Professional <span className="gradient-text">Equipment</span>
            </h2>
            <p className="section-subtitle">
              State-of-the-art gear to ensure your creative vision is captured with the highest quality.
            </p>
          </motion.div>

          <div className="equipment-grid">
            {equipment.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="equipment-card"
              >
                <div className="equipment-item">
                  <div className="equipment-icon">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="equipment-content">
                    <h3 className="equipment-name">{item.name}</h3>
                    <p className="equipment-description">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Policies */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Studio <span className="gradient-text">Policies</span>
            </h2>
            <p className="section-subtitle">
              Clear guidelines to ensure a smooth and professional experience for everyone.
            </p>
          </motion.div>

          <div className="policies-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="policies-column"
            >
              {policies.slice(0, 3).map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="policy-item"
                >
                  <CheckCircle size={20} className="policy-icon" />
                  <p className="policy-text">{policy}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="policies-column"
            >
              {policies.slice(3).map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="policy-item"
                >
                  <CheckCircle size={20} className="policy-icon" />
                  <p className="policy-text">{policy}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-section"
          >
            <h2 className="cta-title">
              Ready to <span className="gradient-text">Book</span>?
            </h2>
            <p className="cta-subtitle">
              Reserve your time in our studio and start creating your next masterpiece.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Book Your Session
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Studio 