import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiDollarSign, FiAlertCircle, FiCheckCircle,
  FiTrendingUp, FiPieChart, FiShield, FiDownload
} from 'react-icons/fi'
import { STORAGE_KEYS, DEFAULT_BUDGETS } from '../utils/constants'
import { getInitials } from '../utils/helpers'

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 6)            score++
  if (password.length >= 10)           score++
  if (/[A-Z]/.test(password))          score++
  if (/[0-9]/.test(password))          score++
  if (/[^A-Za-z0-9]/.test(password))  score++

  if (score <= 1) return { score: 20,  label: 'Weak',        color: '#ef4444' }
  if (score === 2) return { score: 40, label: 'Fair',        color: '#f59e0b' }
  if (score === 3) return { score: 60, label: 'Good',        color: '#3b82f6' }
  if (score === 4) return { score: 80, label: 'Strong',      color: '#8b5cf6' }
  return              { score: 100,    label: 'Very Strong', color: '#10b981' }
}

function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:           '',
    email:          '',
    password:       '',
    confirmPassword:'',
    monthlyBudget:  ''
  })

  const [errors, setErrors]             = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)

  const strength = getPasswordStrength(formData.password)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}

    if (!formData.name.trim())
      e.name = 'Full name is required'
    else if (formData.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters'

    if (!formData.email.trim())
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = 'Enter a valid email address'

    if (!formData.password)
      e.password = 'Password is required'
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters'

    if (!formData.confirmPassword)
      e.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match'

    if (!formData.monthlyBudget)
      e.monthlyBudget = 'Monthly budget is required'
    else if (Number(formData.monthlyBudget) < 100)
      e.monthlyBudget = 'Budget must be at least ₹100'

    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      const existing = localStorage.getItem(STORAGE_KEYS.USER)
      if (existing) {
        const user = JSON.parse(existing)
        if (user.email === formData.email.trim().toLowerCase()) {
          setErrors({ email: 'This email is already registered' })
          setLoading(false)
          return
        }
      }

      const newUser = {
        name:          formData.name.trim(),
        email:         formData.email.trim().toLowerCase(),
        password:      formData.password,
        monthlyBudget: Number(formData.monthlyBudget),
        avatar:        getInitials(formData.name),
        joinedDate:    new Date().toISOString().slice(0, 10)
      }

      localStorage.setItem(STORAGE_KEYS.USER,     JSON.stringify(newUser))
      localStorage.setItem(STORAGE_KEYS.BUDGETS,  JSON.stringify(DEFAULT_BUDGETS))
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]))

      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    }, 800)
  }

  // ── Success screen ──
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-logo">
              <div className="brand-logo-icon">
                <FiTrendingUp size={22} color="white" />
              </div>
              <span className="brand-name">BudgetWise</span>
            </div>
            <h2 className="auth-tagline">
              Start your financial<br />journey today
            </h2>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card success-card">
            <div className="success-icon-wrap">
              <FiCheckCircle size={48} color="#7C3AED" />
            </div>
            <h2 className="success-title">Account created!</h2>
            <p className="success-sub">
              Welcome to BudgetWise, {formData.name.split(' ')[0]}!<br />
              Redirecting you to login...
            </p>
            <div className="success-spinner">
              <span className="spinner" style={{
                borderColor: '#EDE9FE',
                borderTopColor: '#7C3AED',
                width: 24,
                height: 24
              }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-brand">

          <div className="brand-logo">
            <div className="brand-logo-icon">
              <FiTrendingUp size={22} color="white" />
            </div>
            <span className="brand-name">BudgetWise</span>
          </div>

          <h2 className="auth-tagline">
            Start your financial<br />journey today
          </h2>
          <p className="auth-tagline-sub">
            Join BudgetWise and take the first step
            towards smarter spending habits.
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <FiShield size={16} className="feature-icon" />
              Free forever — no credit card
            </div>
            <div className="auth-feature-item">
              <FiLock size={16} className="feature-icon" />
              Your data stays on your device
            </div>
            <div className="auth-feature-item">
              <FiPieChart size={16} className="feature-icon" />
              Beautiful charts and analytics
            </div>
            <div className="auth-feature-item">
              <FiDownload size={16} className="feature-icon" />
              Export your data anytime
            </div>
          </div>

        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-header">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Start tracking your expenses today</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <div className={`auth-input-wrap ${errors.name ? 'has-error' : ''}`}>
                <FiUser className="field-icon" size={16} />
                <input
                  name="name"
                  type="text"
                  placeholder="Tanushree C P"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              {errors.name && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {errors.name}
                </span>
              )}
            </div>

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
                />
              </div>
              {errors.email && (
                <span className="field-error">
                  <FiAlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password + Confirm side by side */}
            <div className="auth-row">

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className={`auth-input-wrap ${errors.password ? 'has-error' : ''}`}>
                  <FiLock className="field-icon" size={16} />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    {showPassword
                      ? <FiEyeOff size={14} />
                      : <FiEye size={14} />
                    }
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error">
                    <FiAlertCircle size={12} /> {errors.password}
                  </span>
                )}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width:      strength.score + '%',
                          background: strength.color
                        }}
                      />
                    </div>
                    <span
                      className="strength-text"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className={`auth-input-wrap ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <FiLock className="field-icon" size={16} />
                  <input
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirm(p => !p)}
                  >
                    {showConfirm
                      ? <FiEyeOff size={14} />
                      : <FiEye size={14} />
                    }
                  </button>
                </div>
                {errors.confirmPassword
                  ? <span className="field-error">
                      <FiAlertCircle size={12} /> {errors.confirmPassword}
                    </span>
                  : formData.confirmPassword &&
                    formData.password === formData.confirmPassword
                    ? <span className="field-success">
                        <FiCheckCircle size={12} /> Passwords match
                      </span>
                    : null
                }
              </div>

            </div>

            {/* Monthly budget */}
            <div className="auth-field">
              <label className="auth-label">Monthly budget (₹)</label>
              <div className={`auth-input-wrap ${errors.monthlyBudget ? 'has-error' : ''}`}>
                <FiDollarSign className="field-icon" size={16} />
                <input
                  name="monthlyBudget"
                  type="number"
                  placeholder="e.g. 10000"
                  min="100"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              {errors.monthlyBudget
                ? <span className="field-error">
                    <FiAlertCircle size={12} /> {errors.monthlyBudget}
                  </span>
                : <span className="field-hint">
                    Your overall spending limit for each month
                  </span>
              }
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? <span className="btn-loading">
                    <span className="spinner" /> Creating account...
                  </span>
                : 'Create account'
              }
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Signup