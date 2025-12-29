import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useIsAdmin } from '../utils/adminAuth'

const AdminProtected = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser()
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        navigate('/')
        return
      }
      if (!isAdmin) {
        navigate('/')
        return
      }
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate])

  if (!isLoaded) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!isSignedIn || !isAdmin) {
    return null
  }

  return <>{children}</>
}

export default AdminProtected

