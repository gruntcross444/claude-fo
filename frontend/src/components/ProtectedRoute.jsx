import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function ProtectedRoute() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/auth/me').catch(() => {
      logout()
      navigate('/register', { replace: true })
    })
  }, [isAuthenticated, logout, navigate])

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />
  }

  return <Outlet />
}
