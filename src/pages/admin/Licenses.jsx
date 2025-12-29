import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import DataTable from '../../components/admin/DataTable'
import { fetchAllLicenses } from '../../utils/adminSupabase'

const Licenses = () => {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadLicenses()
  }, [])

  const loadLicenses = async () => {
    try {
      setLoading(true)
      const data = await fetchAllLicenses()
      setLicenses(data)
    } catch (error) {
      console.error('Error loading licenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLicenses = filter === 'all'
    ? licenses
    : licenses.filter(l => l.license_type === filter)

  const columns = [
    { 
      key: 'id', 
      label: 'License ID',
      render: (value) => value.substring(0, 8) + '...'
    },
    { 
      key: 'license_type', 
      label: 'Type',
      render: (value) => (
        <span className="license-type-badge">{value}</span>
      )
    },
    { 
      key: 'beat_id', 
      label: 'Beat ID',
      render: (value) => value ? value.substring(0, 8) + '...' : '-'
    },
    { 
      key: 'user_id', 
      label: 'User ID',
      render: (value) => value ? value.substring(0, 8) + '...' : 'Guest'
    },
    { 
      key: 'license_url', 
      label: 'License URL',
      render: (value) => (
        <a href={value} target="_blank" rel="noopener noreferrer" className="link">
          View License
        </a>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleString()
    }
  ]

  const licenseTypes = ['all', 'basic', 'premium', 'unlimited', 'exclusive']
  const typeCounts = {
    all: licenses.length,
    basic: licenses.filter(l => l.license_type === 'basic').length,
    premium: licenses.filter(l => l.license_type === 'premium').length,
    unlimited: licenses.filter(l => l.license_type === 'unlimited').length,
    exclusive: licenses.filter(l => l.license_type === 'exclusive').length
  }

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <motion.h1
            className="admin-page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Licenses
          </motion.h1>

          <div className="admin-filters">
            {licenseTypes.map((type) => (
              <button
                key={type}
                className={`filter-button ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} ({typeCounts[type]})
              </button>
            ))}
          </div>

          <DataTable
            columns={columns}
            data={filteredLicenses}
            loading={loading}
          />
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Licenses

