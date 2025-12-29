import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import BeatPackLanding from './pages/BeatPackLanding'
import ThankYou from './pages/ThankYou'
import BeatStore from './pages/BeatStore'
import BeatDetail from './pages/BeatDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/beat-pack" element={<BeatPackLanding />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/store" element={<BeatStore />} />
          <Route path="/store/:beatId" element={<BeatDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
