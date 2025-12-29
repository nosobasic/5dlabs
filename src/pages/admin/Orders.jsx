import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import DataTable from '../../components/admin/DataTable'
import { fetchAllOrders } from '../../utils/adminSupabase'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchAllOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { 
      key: 'id', 
      label: 'Order ID',
      render: (value) => value.substring(0, 8) + '...'
    },
    { 
      key: 'user_id', 
      label: 'User',
      render: (value) => value ? value.substring(0, 8) + '...' : 'Guest'
    },
    { 
      key: 'total_cents', 
      label: 'Total',
      render: (value) => `$${(value / 100).toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'stripe_checkout_id', 
      label: 'Stripe ID',
      render: (value) => value ? value.substring(0, 20) + '...' : '-'
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleString()
    }
  ]

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <motion.h1
            className="admin-page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Orders
          </motion.h1>

          <DataTable
            columns={columns}
            data={orders}
            loading={loading}
            onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
          />
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Orders

