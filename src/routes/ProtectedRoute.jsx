import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Wrap any route element with this to require a session, and optionally
 * a specific set of roles. Role checks depend on `profile.role`, which
 * Sprint 2 populates from the `profiles` table after login.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()

  if (loading) return null // could render a splash/spinner here

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
