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
import Admin from './pages/Admin'
import Beats from './pages/admin/Beats'
import BeatForm from './pages/admin/BeatForm'
import Orders from './pages/admin/Orders'
import OrderDetail from './pages/admin/OrderDetail'
import Licenses from './pages/admin/Licenses'
import Webhooks from './pages/admin/Webhooks'
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/beats" element={<Beats />} />
          <Route path="/admin/beats/new" element={<BeatForm />} />
          <Route path="/admin/beats/:id/edit" element={<BeatForm />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/licenses" element={<Licenses />} />
          <Route path="/admin/webhooks" element={<Webhooks />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
