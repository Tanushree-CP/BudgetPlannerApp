import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/layouts/Layout'

import Login      from './pages/Login'
import Signup     from './pages/SignUp'
import Dashboard  from './pages/Dashboard'
import Expenses   from './pages/Expenses'
import AddExpense from './pages/AddExpense'
import Analytics  from './pages/Analytics'
import Budget     from './pages/Budget'
import Profile    from './pages/Profile'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"  element={<Login />}  />
      <Route path="/signup" element={<Signup />} />

      {/* Protected — all wrapped in Layout with Sidebar */}
      <Route path="/" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute><Expenses /></ProtectedRoute>
      } />
      <Route path="/add" element={
        <ProtectedRoute><AddExpense /></ProtectedRoute>
      } />
      <Route path="/edit/:id" element={
        <ProtectedRoute><AddExpense /></ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute><Analytics /></ProtectedRoute>
      } />
      <Route path="/budget" element={
        <ProtectedRoute><Budget /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App