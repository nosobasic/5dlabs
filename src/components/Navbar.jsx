import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Instagram, Youtube, Twitch, Settings, ChevronDown } from 'lucide-react'
import { useUser, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import { useIsAdmin } from '../utils/adminAuth'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)
  const location = useLocation()
  const { isSignedIn } = useUser()
  const isAdmin = useIsAdmin()
  const aboutDropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setIsAboutOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const aboutItems = [
    { name: 'Studio', path: '/studio' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' }
  ]

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Contact', path: '/contact' },
    { name: 'Free Beats', path: '/beat-pack', highlight: true },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', admin: true }] : [])
  ]

  const isAboutActive = aboutItems.some(item => location.pathname === item.path)

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
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''} ${
                  item.highlight ? 'bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all' : ''
                }`}
              >
                {item.name}
                {location.pathname === item.path && !item.highlight && (
                  <motion.div
                    layoutId="activeTab"
                    className="nav-link-indicator"
                  />
                )}
              </Link>
            ))}
            
            {/* About Dropdown */}
            <div className="nav-dropdown" ref={aboutDropdownRef}>
              <button
                className={`nav-link nav-dropdown-toggle ${isAboutActive ? 'nav-link-active' : ''}`}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                onMouseEnter={() => setIsAboutOpen(true)}
              >
                About
                <ChevronDown 
                  size={16} 
                  className={`dropdown-chevron ${isAboutOpen ? 'dropdown-chevron-open' : ''}`}
                />
                {isAboutActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="nav-link-indicator"
                  />
                )}
              </button>
              {isAboutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="nav-dropdown-menu"
                  onMouseLeave={() => setIsAboutOpen(false)}
                >
                  {aboutItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`nav-dropdown-item ${location.pathname === item.path ? 'nav-dropdown-item-active' : ''}`}
                      onClick={() => setIsAboutOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
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
          </div>

          {/* Auth Buttons */}
          <div className="navbar-auth desktop-nav">
            {isSignedIn ? (
              <div className="auth-buttons">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="sign-in-button"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            )}
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
              
              {/* Mobile About Dropdown */}
              <div className="mobile-nav-dropdown">
                <button
                  className={`mobile-nav-link mobile-nav-dropdown-toggle ${isAboutActive ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                >
                  About
                  <ChevronDown 
                    size={16} 
                    className={`mobile-dropdown-chevron ${isMobileAboutOpen ? 'mobile-dropdown-chevron-open' : ''}`}
                  />
                </button>
                {isMobileAboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mobile-nav-dropdown-menu"
                  >
                    {aboutItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => {
                          setIsMobileAboutOpen(false)
                          setIsOpen(false)
                        }}
                        className={`mobile-nav-dropdown-item ${location.pathname === item.path ? 'mobile-nav-dropdown-item-active' : ''}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
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
              <div className="mobile-auth">
                {isSignedIn ? (
                  <div className="mobile-auth-buttons">
                    <UserButton afterSignOutUrl="/" />
                    <SignOutButton>
                      <button className="mobile-sign-out-button" onClick={() => setIsOpen(false)}>
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="mobile-sign-in-button" onClick={() => setIsOpen(false)}>
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar 