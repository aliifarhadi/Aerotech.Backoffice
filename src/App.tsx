import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import FlightSchedules from './pages/FlightSchedules'
import { useAppSelector, useAppDispatch } from './store'
import { initializeAuth } from './features/auth/authSlice'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/flight-schedules"
        element={
          <RequireAuth>
            <FlightSchedules />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
