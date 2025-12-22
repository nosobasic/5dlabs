import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Instagram, Youtube, Twitch } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Studio', path: '/studio' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="logo-container"
            >
              <img 
                src="/5dlogo.png" 
                alt="5D Labs Logo" 
                className="logo-image"
              />
              <span className="logo-text">5D Labs</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="nav-link-indicator"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="navbar-social desktop-nav">
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="social-link instagram"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="social-link youtube"
            >
              <Youtube size={20} />
            </motion.a>
            <motion.a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="social-link twitch"
            >
              <Twitch size={20} />
            </motion.a>
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="auth-button sign-in-button"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="menu-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav"
          >
            <div className="mobile-nav-content">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Authentication */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-link auth-button"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="mobile-auth-user-button">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <div className="mobile-social-links">
                <a href="https://instagram.com" className="mobile-social-link instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" className="mobile-social-link youtube">
                  <Youtube size={20} />
                </a>
                <a href="https://twitch.tv" className="mobile-social-link twitch">
                  <Twitch size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar 