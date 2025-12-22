import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Clock, 
  DollarSign, 
  Music, 
  Camera, 
  Video, 
  Mic,
  CheckCircle,
  Star,
  Users,
  Zap
} from 'lucide-react'

const Services = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)

  const services = [
    {
      name: "Hourly Studio Rental",
      description: "Access to the full studio space with all equipment",
      price: "$75",
      duration: "per hour",
      icon: Clock,
      features: ["Full studio access", "All equipment included", "Professional lighting", "Flexible scheduling"]
    },
    {
      name: "Session with Engineer",
      description: "Book time with our in-house professional engineer",
      price: "$125",
      duration: "per hour",
      icon: Users,
      features: ["Professional engineer", "Full studio access", "Mixing included", "Project consultation"]
    },
    {
      name: "Mixing & Mastering",
      description: "Professional mixing and mastering services",
      price: "$200",
      duration: "per track",
      icon: Music,
      features: ["Professional mixing", "Mastering included", "Multiple revisions", "High-quality output"]
    },
    {
      name: "Beat Sales",
      description: "Purchase exclusive beats from our in-house producers",
      price: "$150",
      duration: "per beat",
      icon: Music,
      features: ["Exclusive rights", "High-quality production", "Custom modifications", "License included"]
    },
    {
      name: "Custom Beat Packs",
      description: "Tailored beat collections for your project",
      price: "$500",
      duration: "per pack",
      icon: Music,
      features: ["10-15 custom beats", "Exclusive rights", "Genre-specific", "Project consultation"]
    },
    {
      name: "Photography Space",
      description: "Rent the studio for professional photography",
      price: "$60",
      duration: "per hour",
      icon: Camera,
      features: ["Professional lighting", "Backdrop system", "Equipment included", "Flexible setup"]
    }
  ]

  const packages = [
    {
      name: "Starter Pack",
      price: "$300",
      duration: "4 hours",
      description: "Perfect for solo artists and small projects",
      features: [
        "4 hours studio time",
        "Basic equipment access",
        "Engineer consultation",
        "1 mixed track"
      ],
      popular: false
    },
    {
      name: "Producer Pack",
      price: "$600",
      duration: "8 hours",
      description: "Ideal for full EP or album projects",
      features: [
        "8 hours studio time",
        "Full equipment access",
        "In-house engineer",
        "3 mixed tracks",
        "Custom beat pack"
      ],
      popular: true
    },
    {
      name: "Creator Pack",
      price: "$1200",
      duration: "16 hours",
      description: "Complete project from start to finish",
      features: [
        "16 hours studio time",
        "Premium equipment access",
        "Dedicated engineer",
        "Full album mixing",
        "Custom beat collection",
        "Photography session"
      ],
      popular: false
    }
  ]

  const addOns = [
    {
      name: "Content Creation Space",
      description: "Access to photography/video area during or after session",
      price: "$25",
      duration: "per hour"
    },
    {
      name: "Professional Mixing",
      description: "Additional mixing and mastering of recorded tracks",
      price: "$150",
      duration: "per track"
    },
    {
      name: "Custom Beat Production",
      description: "Tailored beat creation for your specific project",
      price: "$200",
      duration: "per beat"
    },
    {
      name: "Photography Session",
      description: "Professional photoshoot with our equipment",
      price: "$100",
      duration: "per session"
    }
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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="page-subtitle">
              From hourly rentals to complete production packages, we offer everything you need to bring your creative vision to life.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="service-pricing-card"
              >
                <div className="service-pricing-icon">
                  <service.icon size={24} className="text-white" />
                </div>
                <h3 className="service-pricing-title">{service.name}</h3>
                <p className="service-pricing-description">{service.description}</p>
                <div className="service-pricing-amount">
                  <span className="service-price">{service.price}</span>
                  <span className="service-duration">{service.duration}</span>
                </div>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="service-feature">
                      <CheckCircle size={16} className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
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
              Production <span className="gradient-text">Packages</span>
            </h2>
            <p className="section-subtitle">
              Comprehensive packages designed to take your project from concept to completion.
            </p>
          </motion.div>

          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`package-card ${pkg.popular ? 'popular-package' : ''}`}
              >
                {pkg.popular && (
                  <div className="popular-badge">
                    <div className="popular-badge-content">
                      <Star size={16} className="mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="package-header">
                  <h3 className="package-title">{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-pricing">
                    <span className="package-price">{pkg.price}</span>
                    <span className="package-duration">{pkg.duration}</span>
                  </div>
                </div>

                <ul className="package-features">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="package-feature">
                      <CheckCircle size={18} className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`package-button ${pkg.popular ? 'popular-button' : 'secondary-button'}`}
                >
                  Choose Package
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Additional <span className="gradient-text">Services</span>
            </h2>
            <p className="section-subtitle">
              Enhance your session with these premium add-ons and specialized services.
            </p>
          </motion.div>

          <div className="addons-grid">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="addon-card"
              >
                <div className="addon-content">
                  <div className="addon-info">
                    <h3 className="addon-title">{addon.name}</h3>
                    <p className="addon-description">{addon.description}</p>
                  </div>
                  <div className="addon-pricing">
                    <div className="addon-price">{addon.price}</div>
                    <div className="addon-duration">{addon.duration}</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="addon-button"
                >
                  Add to Session
                </motion.button>
              </motion.div>
            ))}
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
              Ready to <span className="gradient-text">Start</span>?
            </h2>
            <p className="cta-subtitle">
              Book your session today and let's create something legendary together.
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

export default Services 