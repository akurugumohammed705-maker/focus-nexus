import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import Wallet from '../pages/Wallet/Wallet'
import Services from '../pages/Services/Services'
import Academy from '../pages/Academy/Academy'
import Community from '../pages/Community/Community'
import Marketplace from '../pages/Marketplace/Marketplace'
import AgentPortal from '../pages/Agent/Agent'
import AdminCommandCenter from '../pages/Admin/Admin'
import Business from '../pages/Business/Business'
import ProtectedRoute from './ProtectedRoute'
import { ROLES } from '../utils/constants'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/academy" element={<Academy />} />
      <Route path="/community" element={<Community />} />

      {/* Authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AGENT, ROLES.SUB_AGENT]}>
            <AgentPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business"
        element={
          <ProtectedRoute allowedRoles={[ROLES.BUSINESS]}>
            <Business />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.STAFF]}>
            <AdminCommandCenter />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
