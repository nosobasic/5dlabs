import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import DataTable from '../../components/admin/DataTable'
import { fetchAllBeats } from '../../utils/adminSupabase'
import { toggleBeatActive, deleteBeat } from '../../utils/beatAdmin'

const Beats = () => {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    loadBeats()
  }, [])

  const loadBeats = async () => {
    try {
      setLoading(true)
      const data = await fetchAllBeats()
      setBeats(data)
    } catch (error) {
      console.error('Error loading beats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (beatId, currentStatus) => {
    try {
      await toggleBeatActive(beatId, !currentStatus)
      await loadBeats()
    } catch (error) {
      console.error('Error toggling beat status:', error)
      alert('Failed to update beat status')
    }
  }

  const handleDelete = async (beatId) => {
    if (!confirm('Are you sure you want to delete this beat? This action cannot be undone.')) {
      return
    }

    try {
      await deleteBeat(beatId)
      await loadBeats()
    } catch (error) {
      console.error('Error deleting beat:', error)
      alert('Failed to delete beat')
    }
  }

  const filteredBeats = filter === 'all' 
    ? beats 
    : filter === 'active' 
    ? beats.filter(b => b.is_active)
    : beats.filter(b => !b.is_active)

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'bpm', 
      label: 'BPM',
      render: (value) => value || '-'
    },
    { 
      key: 'key', 
      label: 'Key',
      render: (value) => value || '-'
    },
    { 
      key: 'genre', 
      label: 'Genre',
      render: (value) => value || '-'
    },
    { 
      key: 'price_cents', 
      label: 'Price',
      render: (value) => `$${(value / 100).toFixed(2)}`
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = (beat) => (
    <div className="table-actions">
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleToggleActive(beat.id, beat.is_active)
        }}
        className="action-button"
        title={beat.is_active ? 'Deactivate' : 'Activate'}
      >
        {beat.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/admin/beats/${beat.id}/edit`)
        }}
        className="action-button"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDelete(beat.id)
        }}
        className="action-button danger"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-page-header">
            <motion.h1
              className="admin-page-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Beat Management
            </motion.h1>
            <motion.button
              className="admin-button primary"
              onClick={() => navigate('/admin/beats/new')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add New Beat
            </motion.button>
          </div>

          <div className="admin-filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({beats.length})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({beats.filter(b => b.is_active).length})
            </button>
            <button
              className={`filter-button ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive ({beats.filter(b => !b.is_active).length})
            </button>
          </div>

          <DataTable
            columns={columns}
            data={filteredBeats}
            loading={loading}
            onRowClick={(beat) => navigate(`/admin/beats/${beat.id}/edit`)}
            actions={actions}
          />
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Beats

