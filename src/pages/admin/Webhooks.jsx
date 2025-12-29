import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '../../components/AdminLayout'
import AdminProtected from '../../components/AdminProtected'
import DataTable from '../../components/admin/DataTable'
import { fetchWebhookEvents } from '../../utils/adminSupabase'

const Webhooks = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await fetchWebhookEvents()
      setEvents(data)
    } catch (error) {
      console.error('Error loading webhook events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = filter === 'all'
    ? events
    : filter === 'processed'
    ? events.filter(e => e.processed)
    : events.filter(e => !e.processed)

  const columns = [
    { 
      key: 'id', 
      label: 'Event ID',
      render: (value) => value.substring(0, 8) + '...'
    },
    { 
      key: 'source', 
      label: 'Source'
    },
    { 
      key: 'event_type', 
      label: 'Event Type'
    },
    { 
      key: 'processed', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value ? 'processed' : 'pending'}`}>
          {value ? 'Processed' : 'Pending'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleString()
    }
  ]

  const actions = (event) => (
    <button
      className="action-button"
      onClick={() => setSelectedEvent(event)}
    >
      View Details
    </button>
  )

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="admin-page">
          <motion.h1
            className="admin-page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Webhook Events
          </motion.h1>

          <div className="admin-filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({events.length})
            </button>
            <button
              className={`filter-button ${filter === 'processed' ? 'active' : ''}`}
              onClick={() => setFilter('processed')}
            >
              Processed ({events.filter(e => e.processed).length})
            </button>
            <button
              className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({events.filter(e => !e.processed).length})
            </button>
          </div>

          <DataTable
            columns={columns}
            data={filteredEvents}
            loading={loading}
            actions={actions}
          />

          {selectedEvent && (
            <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Webhook Event Details</h2>
                <div className="webhook-details">
                  <div className="detail-item">
                    <label>Event ID</label>
                    <p>{selectedEvent.id}</p>
                  </div>
                  <div className="detail-item">
                    <label>Source</label>
                    <p>{selectedEvent.source}</p>
                  </div>
                  <div className="detail-item">
                    <label>Event Type</label>
                    <p>{selectedEvent.event_type}</p>
                  </div>
                  <div className="detail-item">
                    <label>Processed</label>
                    <p>{selectedEvent.processed ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Created At</label>
                    <p>{new Date(selectedEvent.created_at).toLocaleString()}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Payload</label>
                    <pre className="webhook-payload">
                      {JSON.stringify(selectedEvent.payload, null, 2)}
                    </pre>
                  </div>
                </div>
                <button
                  className="admin-button secondary"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Webhooks

