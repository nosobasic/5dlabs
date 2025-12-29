import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Music, 
  ShoppingCart, 
  FileText, 
  Webhook,
  Plus,
  List
} from 'lucide-react'

const AdminLayout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Beats', path: '/admin/beats', icon: Music },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Licenses', path: '/admin/licenses', icon: FileText },
    { name: 'Webhooks', path: '/admin/webhooks', icon: Webhook },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

