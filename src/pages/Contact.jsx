import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Youtube, 
  Twitch,
  Send,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', newsletterEmail)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "dorian@5dlabs.co",
      link: "mailto:dorian@5dlabs.co"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "(555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Downtown Creative District",
      link: "#"
    },
    {
      icon: Clock,
      title: "Hours",
      value: "Mon-Sun: 9AM-10PM",
      link: "#"
    }
  ]

  const services = [
    "Studio Rental",
    "Session with Engineer",
    "Mixing & Mastering",
    "Beat Sales",
    "Photography Space",
    "Custom Beat Pack"
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
            className="text-center mb-16"
          >
            <h1 className="page-title">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="page-subtitle">
              Ready to create something legendary? Book your session or reach out to learn more about our services.
            </p>
          </motion.div>

          <div className="contact-layout">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="contact-form-card"
            >
              <h2 className="contact-form-title">Book Your Session</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">
                      Name *
                    </label>
                    <div className="input-container">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <label className="form-label">
                      Email *
                    </label>
                    <div className="input-container">
                      <Mail size={20} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">
                      Phone
                    </label>
                    <div className="input-container">
                      <Phone size={20} className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <label className="form-label">
                      Service *
                    </label>
                    <div className="input-container">
                      <Calendar size={20} className="input-icon" />
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Preferred Date
                  </label>
                  <div className="input-container">
                    <Calendar size={20} className="input-icon" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Message
                  </label>
                  <div className="input-container">
                    <MessageSquare size={20} className="textarea-icon" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="form-textarea"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="form-submit-button"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="contact-info-section"
            >
              <div className="contact-info">
                <h2 className="contact-info-title">Contact Information</h2>
                <div className="contact-info-list">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.title}
                      href={info.link}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="contact-info-item"
                    >
                      <div className="contact-info-icon">
                        <info.icon size={24} className="text-white" />
                      </div>
                      <div className="contact-info-content">
                        <h3 className="contact-info-name">{info.title}</h3>
                        <p className="contact-info-value">{info.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="social-links">
                <h3 className="social-links-title">Follow Us</h3>
                <div className="social-links-grid">
                  {[
                    { icon: Instagram, href: "https://instagram.com", color: "social-instagram" },
                    { icon: Youtube, href: "https://youtube.com", color: "social-youtube" },
                    { icon: Twitch, href: "https://twitch.tv", color: "social-twitch" }
                  ].map((social, index) => (
                    <motion.a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className={`social-link ${social.color}`}
                    >
                      <social.icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="newsletter-card">
                <h3 className="newsletter-title">Stay Updated</h3>
                <p className="newsletter-description">
                  Get notified about new drops, events, and studio promotions.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="newsletter-button"
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio Policies Reminder */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-section"
          >
            <h2 className="cta-title">
              Studio <span className="gradient-text">Policies</span>
            </h2>
            <div className="policies-grid">
              {[
                "2-hour minimum for all bookings",
                "1-hour deposit required to secure booking",
                "Cancellations within 24 hours result in forfeit of deposit"
              ].map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="policy-card"
                >
                  <p className="policy-text">{policy}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact 