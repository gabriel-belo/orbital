import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import { logSecurityEvent } from './security/auditLogger'
import ErrorBoundary from './components/ErrorBoundary'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ActiveAlerts from './pages/ActiveAlerts'
import AlertDetails from './pages/AlertDetails'
import EmergencyAction from './pages/EmergencyAction'
import AIAnalysis from './pages/AIAnalysis'
import SensorNetwork from './pages/SensorNetwork'
import SensorDetails from './pages/SensorDetails'
import MonitoredRegions from './pages/MonitoredRegions'
import RegionDetails from './pages/RegionDetails'
import RadarMap from './pages/RadarMap'
import SystemLogs from './pages/SystemLogs'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import OperatorProfile from './pages/OperatorProfile'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    if (!isAuthenticated) {
      logSecurityEvent('acesso_negado', 'Tentativa de acesso a rota interna sem usuario autenticado.')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/regions" element={<ProtectedRoute><MonitoredRegions /></ProtectedRoute>} />
      <Route path="/regions/:id" element={<ProtectedRoute><RegionDetails /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><ActiveAlerts /></ProtectedRoute>} />
      <Route path="/alerts/:id" element={<ProtectedRoute><AlertDetails /></ProtectedRoute>} />
      <Route path="/sensors" element={<ProtectedRoute><SensorNetwork /></ProtectedRoute>} />
      <Route path="/sensors/:id" element={<ProtectedRoute><SensorDetails /></ProtectedRoute>} />
      <Route path="/ai-analysis" element={<ProtectedRoute><AIAnalysis /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><SystemLogs /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><OperatorProfile /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><EmergencyAction /></ProtectedRoute>} />
      <Route path="/radar" element={<ProtectedRoute><RadarMap /></ProtectedRoute>} />
      <Route path="/logs" element={<Navigate to="/history" replace />} />
      <Route path="/reports" element={<Navigate to="/recommendations" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppDataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
