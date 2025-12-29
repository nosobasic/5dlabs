import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import { fetchOrderById } from '../../utils/adminSupabase'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const data = await fetchOrderById(id)
      setOrder(data)
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="admin-loading">
            <div className="loading-spinner" />
            <p>Loading order...</p>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  if (!order) {
    return (
      <AdminProtected>
        <AdminLayout>
          <div className="admin-error">
            <p>Order not found</p>
            <button onClick={() => navigate('/admin/orders')}>Back to Orders</button>
          </div>
        </AdminLayout>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-page-header">
            <motion.button
              className="admin-button secondary"
              onClick={() => navigate('/admin/orders')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>
            <motion.h1
              className="admin-page-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Order Details
            </motion.h1>
          </div>

          <div className="admin-detail-card">
            <h2>Order Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Order ID</label>
                <p>{order.id}</p>
              </div>
              <div className="detail-item">
                <label>User ID</label>
                <p>{order.user_id || 'Guest'}</p>
              </div>
              <div className="detail-item">
                <label>Total</label>
                <p>${(order.total_cents / 100).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <p className={`status-badge ${order.status}`}>{order.status}</p>
              </div>
              <div className="detail-item">
                <label>Stripe Checkout ID</label>
                <p>{order.stripe_checkout_id}</p>
              </div>
              <div className="detail-item">
                <label>Created At</label>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="admin-detail-card">
              <h2>Order Items</h2>
              {order.order_items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <h3>{item.beats?.title || 'Unknown Beat'}</h3>
                    <p>Price: ${(item.price_cents / 100).toFixed(2)}</p>
                    {item.license_type && <p>License: {item.license_type}</p>}
                  </div>
                  {item.licenses && item.licenses.length > 0 && (
                    <div className="order-item-licenses">
                      <h4>Licenses:</h4>
                      {item.licenses.map((license) => (
                        <div key={license.id} className="license-item">
                          <p>Type: {license.license_type}</p>
                          <p>URL: <a href={license.license_url} target="_blank" rel="noopener noreferrer">{license.license_url}</a></p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default OrderDetail

