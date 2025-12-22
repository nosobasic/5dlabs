import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Play, 
  Pause, 
  Music, 
  Video, 
  Camera, 
  Heart,
  MessageCircle,
  Share,
  Star,
  Quote
} from 'lucide-react'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [playingTrack, setPlayingTrack] = useState(null)

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'music', name: 'Music' },
    { id: 'video', name: 'Video' },
    { id: 'photo', name: 'Photography' }
  ]

  const portfolioItems = [
    {
      id: 1,
      title: "Midnight Vibes",
      artist: "Luna Echo",
      category: "music",
      type: "spotify",
      url: "https://open.spotify.com/track/example1",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Atmospheric R&B track recorded and mixed at 5D Labs"
    },
    {
      id: 2,
      title: "Urban Dreams",
      artist: "The Collective",
      category: "music",
      type: "spotify",
      url: "https://open.spotify.com/track/example2",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
      description: "Hip-hop production featuring local artists"
    },
    {
      id: 3,
      title: "Studio Session BTS",
      artist: "5D Labs",
      category: "video",
      type: "youtube",
      url: "https://youtube.com/watch?v=example1",
      image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&h=400&fit=crop",
      description: "Behind the scenes of a recording session"
    },
    {
      id: 4,
      title: "Artist Portrait Series",
      artist: "Various Artists",
      category: "photo",
      type: "gallery",
      url: "#",
      image: "https://images.unsplash.com/photo-1492546662075-aabebf46dee2?w=400&h=400&fit=crop",
      description: "Professional artist portraits shot in our studio"
    },
    {
      id: 5,
      title: "Live Performance",
      artist: "Sound Collective",
      category: "video",
      type: "youtube",
      url: "https://youtube.com/watch?v=example2",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Live acoustic session recorded in our space"
    },
    {
      id: 6,
      title: "Electronic Dreams",
      artist: "Neon Pulse",
      category: "music",
      type: "spotify",
      url: "https://open.spotify.com/track/example3",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
      description: "Electronic production with custom sound design"
    }
  ]

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Independent Artist",
      content: "5D Labs transformed my music. The atmosphere and equipment quality are unmatched. My EP sounds professional thanks to their expertise.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "The photography space is incredible. I've shot multiple campaigns here and the lighting setup is perfect for any style.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Marcus Johnson",
      role: "Podcast Host",
      content: "Professional setup with great acoustics. My podcast quality improved dramatically after switching to 5D Labs.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

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
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="page-subtitle">
              Discover the incredible work created by artists and creators at 5D Labs. 
              From music to visual content, every piece tells a story.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="category-filters"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-filter ${activeCategory === category.id ? 'active-filter' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Portfolio Grid */}
          <div className="portfolio-grid">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="portfolio-card"
              >
                <div className="portfolio-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="portfolio-image"
                  />
                  <div className="portfolio-overlay">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="play-button"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </motion.button>
                  </div>
                  {item.category === 'music' && (
                    <div className="category-badge music-badge">
                      <Music size={16} className="inline mr-1" />
                      Music
                    </div>
                  )}
                  {item.category === 'video' && (
                    <div className="category-badge video-badge">
                      <Video size={16} className="inline mr-1" />
                      Video
                    </div>
                  )}
                  {item.category === 'photo' && (
                    <div className="category-badge photo-badge">
                      <Camera size={16} className="inline mr-1" />
                      Photo
                    </div>
                  )}
                </div>
                
                <div className="portfolio-content">
                  <h3 className="portfolio-title">{item.title}</h3>
                  <p className="portfolio-artist">{item.artist}</p>
                  <p className="portfolio-description">{item.description}</p>
                  
                  <div className="portfolio-actions">
                    <div className="portfolio-social">
                      <button className="social-button">
                        <Heart size={20} />
                      </button>
                      <button className="social-button">
                        <MessageCircle size={20} />
                      </button>
                      <button className="social-button">
                        <Share size={20} />
                      </button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="portfolio-action-button"
                    >
                      Listen Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              What Our <span className="gradient-text">Clients</span> Say
            </h2>
            <p className="section-subtitle">
              Hear from the artists and creators who've made 5D Labs their creative home.
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="testimonial-card"
              >
                <div className="testimonial-header">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-icon" />
                  ))}
                </div>
                
                <div className="testimonial-content">
                  <Quote size={24} className="quote-icon" />
                  <p className="testimonial-text">{testimonial.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-section"
          >
            <h2 className="cta-title">
              Ready to <span className="gradient-text">Create</span>?
            </h2>
            <p className="cta-subtitle">
              Join the community of creators making legendary content at 5D Labs.
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

export default Portfolio 