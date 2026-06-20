import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiTrendingUp, FiPieChart,
  FiShield, FiCheckCircle
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { STORAGE_KEYS } from '../utils/constants'

function Login() {
  const navigate = useNavigate()
  const { login } = useApp()

  const [formData, setFormData]         = useState({ email: '', password: '' })
  const [errors, setErrors]             = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [loginError, setLoginError]     = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setLoginError('')
  }

  function validate() {
    const e = {}
    if (!formData.email.trim())
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = 'Enter a valid email address'
    if (!formData.password)
      e.password = 'Password is required'
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (!savedUser) {
        setLoginError('No account found. Please sign up first.')
        setLoading(false); return
      }
      const user = JSON.parse(savedUser)
      if (user.email !== formData.email) {
        setLoginError('Email not found. Please check and try again.')
        setLoading(false); return
      }
      if (user.password !== formData.password) {
        setLoginError('Incorrect password. Please try again.')
        setLoading(false); return
      }
      login(user)
      navigate('/')
    }, 800)
  }

  return (
    <div className="auth-page">

      {/* ── Left branding panel ── */}
      <div className="auth-left">
        <div className="auth-brand">

          <div className="brand-logo">
            <div className="brand-logo-icon">
              <FiTrendingUp size={22} color="white" />
            </div>
            <span className="brand-name">BudgetWise</span>
          </div>

          <h2 className="auth-tagline">
            Take control of<br />your finances
          </h2>
          <p className="auth-tagline-sub">
            Track expenses, set budgets, and understand
            your spending habits — all in one place.
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <FiCheckCircle size={16} className="feature-icon" />
              Track daily expenses
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={16} className="feature-icon" />
              Set category budgets
            </div>
            <div className="auth-feature-item">
              <FiPieChart size={16} className="feature-icon" />
              View spending analytics
            </div>
            <div className="auth-feature-item">
              <FiShield size={16} className="feature-icon" />
              Your data stays private
            </div>
          </div>

        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your BudgetWise account</p>
          </div>

          {loginError && (
            <div className="auth-error-banner">
              <FiAlertCircle size={16} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className={`auth-input-wrap ${errors.email ? 'has-error' : ''}`}>
                <FiMail className="field-icon" size={16} />
                <input
                  name="email"
                  type="email"
                  placeholder="tanushree@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className={`auth-input-wrap ${errors.password ? 'has-error' : ''}`}>
                <FiLock className="field-icon" size={16} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword
                    ? <FiEyeOff size={16} />
                    : <FiEye size={16} />
                  }
                </button>
              </div>
              {errors.password && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? <span className="btn-loading">
                    <span className="spinner" /> Signing in...
                  </span>
                : 'Sign in'
              }
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Create one free</Link>
          </p>

          <div className="demo-hint">
            <FiShield size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            New here?{' '}
            <Link to="/signup" className="auth-link">Sign up first</Link>
            {' '}— it's free!
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login