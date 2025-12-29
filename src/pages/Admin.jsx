import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, ShoppingCart, FileText, Webhook, DollarSign } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { fetchAllBeats, fetchAllOrders, fetchAllLicenses, fetchWebhookEvents } from '../utils/adminSupabase'

const Admin = () => {
  const [stats, setStats] = useState({
    totalBeats: 0,
    activeBeats: 0,
    totalOrders: 0,
    totalLicenses: 0,
    webhookEvents: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [beats, orders, licenses, webhooks] = await Promise.all([
          fetchAllBeats(),
          fetchAllOrders(),
          fetchAllLicenses(),
          fetchWebhookEvents()
        ])

        const activeBeats = beats.filter(b => b.is_active).length
        const revenue = orders.reduce((sum, order) => sum + (order.total_cents || 0), 0) / 100

        setStats({
          totalBeats: beats.length,
          activeBeats,
          totalOrders: orders.length,
          totalLicenses: licenses.length,
          webhookEvents: webhooks.length,
          revenue
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total Beats',
      value: stats.totalBeats,
      subtitle: `${stats.activeBeats} active`,
      icon: Music,
      color: 'purple'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: 'All time',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Licenses',
      value: stats.totalLicenses,
      subtitle: 'Issued',
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      subtitle: 'Total sales',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Webhook Events',
      value: stats.webhookEvents,
      subtitle: 'Recent',
      icon: Webhook,
      color: 'pink'
    }
  ]

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-dashboard">
          <motion.h1
            className="admin-page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Dashboard
          </motion.h1>

          {loading ? (
            <div className="admin-loading">
              <div className="loading-spinner" />
              <p>Loading statistics...</p>
            </div>
          ) : (
            <div className="admin-stats-grid">
              {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    className={`admin-stat-card ${card.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="admin-stat-icon">
                      <Icon size={32} />
                    </div>
                    <div className="admin-stat-content">
                      <h3 className="admin-stat-title">{card.title}</h3>
                      <p className="admin-stat-value">{card.value}</p>
                      <p className="admin-stat-subtitle">{card.subtitle}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Admin

