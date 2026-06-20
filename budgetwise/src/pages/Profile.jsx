import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser, FiMail, FiDollarSign, FiSave,
  FiLogOut, FiAlertCircle, FiCheckCircle,
  FiEdit2, FiTrash2, FiShield, FiCalendar
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { STORAGE_KEYS } from '../utils/constants'
import { formatCurrency, getInitials } from '../utils/helpers'

function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUser, expenses } = useApp()

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name:          user?.name || '',
    email:         user?.email || '',
    monthlyBudget: user?.monthlyBudget || 10000
  })
  const [errors, setErrors]   = useState({})
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const totalSpent   = expenses.reduce((s, e) => s + e.amount, 0)
  const joinedDate   = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'Unknown'

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  function validate() {
    const e = {}
    if (!formData.name.trim())
      e.name = 'Name is required'
    if (!formData.email.trim())
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = 'Enter a valid email'
    if (!formData.monthlyBudget || Number(formData.monthlyBudget) < 100)
      e.monthlyBudget = 'Budget must be at least ₹100'
    return e
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      const updated = {
        ...user,
        name:          formData.name.trim(),
        email:         formData.email.trim().toLowerCase(),
        monthlyBudget: Number(formData.monthlyBudget),
        avatar:        getInitials(formData.name)
      }
      updateUser(updated)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))
      setLoading(false)
      setEditMode(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 600)
  }

  function handleCancel() {
    setFormData({
      name:          user?.name || '',
      email:         user?.email || '',
      monthlyBudget: user?.monthlyBudget || 10000
    })
    setErrors({})
    setEditMode(false)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleDeleteAccount() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    logout()
    navigate('/signup')
  }

  return (
    <div>

      {/* ── Topbar ── */}
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">Profile</p>
          <p className="topbar-date">Manage your account settings</p>
        </div>
        <div className="topbar-actions">
          {!editMode ? (
            <button
              className="btn-primary"
              onClick={() => { setEditMode(true); setSaved(false) }}
            >
              <FiEdit2 size={15} />
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading
                  ? <span className="btn-loading"><span className="spinner" /> Saving...</span>
                  : <><FiSave size={15} /> Save Changes</>
                }
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-container">

        {/* ── Success banner ── */}
        {saved && (
          <div className="alert-success">
            <FiCheckCircle size={16} />
            Profile updated successfully!
          </div>
        )}

        <div className="profile-layout">

          {/* ── Left: avatar + stats ── */}
          <div className="profile-left">

            {/* Avatar card */}
            <div className="profile-avatar-card">
              <div className="profile-avatar-circle">
                <span className="profile-avatar-text">
                  {user?.avatar || 'U'}
                </span>
              </div>
              <p className="profile-avatar-name">{user?.name}</p>
              <p className="profile-avatar-email">{user?.email}</p>
              <div className="profile-avatar-badge">
                <FiCalendar size={12} />
                Joined {joinedDate}
              </div>
            </div>

            {/* Stats card */}
            <div className="profile-stats-card">
              <p className="profile-stats-title">
                <FiShield size={14} style={{ color: '#7C3AED' }} />
                Account Stats
              </p>
              <div className="profile-stat-row">
                <span className="profile-stat-label">Total expenses</span>
                <span className="profile-stat-val">{expenses.length}</span>
              </div>
              <div className="profile-stat-row">
                <span className="profile-stat-label">Total spent</span>
                <span className="profile-stat-val purple">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="profile-stat-row">
                <span className="profile-stat-label">Monthly budget</span>
                <span className="profile-stat-val">
                  {formatCurrency(user?.monthlyBudget || 0)}
                </span>
              </div>
            </div>

          </div>

          {/* ── Right: edit form ── */}
          <div className="profile-right">

            {/* Personal info */}
            <div className="profile-section-card">
              <p className="profile-section-title">
                <FiUser size={15} style={{ color: '#7C3AED' }} />
                Personal Information
              </p>

              <div className="profile-field">
                <label className="profile-label">
                  <FiUser size={13} /> Full Name
                </label>
                {editMode ? (
                  <>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`profile-input ${errors.name ? 'has-error' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <span className="add-field-error">
                        <FiAlertCircle size={12} /> {errors.name}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="profile-value">{user?.name}</p>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-label">
                  <FiMail size={13} /> Email Address
                </label>
                {editMode ? (
                  <>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`profile-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <span className="add-field-error">
                        <FiAlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="profile-value">{user?.email}</p>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-label">
                  <FiDollarSign size={13} /> Monthly Budget (₹)
                </label>
                {editMode ? (
                  <>
                    <div className="add-amount-wrap">
                      <span className="add-rupee">₹</span>
                      <input
                        name="monthlyBudget"
                        type="number"
                        min="100"
                        value={formData.monthlyBudget}
                        onChange={handleChange}
                        className={`profile-input add-amount-input ${errors.monthlyBudget ? 'has-error' : ''}`}
                        placeholder="10000"
                      />
                    </div>
                    {errors.monthlyBudget && (
                      <span className="add-field-error">
                        <FiAlertCircle size={12} /> {errors.monthlyBudget}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="profile-value">
                    {formatCurrency(user?.monthlyBudget || 0)}
                  </p>
                )}
              </div>
            </div>

            {/* Account actions */}
            <div className="profile-section-card">
              <p className="profile-section-title">
                <FiShield size={15} style={{ color: '#7C3AED' }} />
                Account Actions
              </p>

              <div className="profile-action-row">
                <div>
                  <p className="profile-action-title">Sign out</p>
                  <p className="profile-action-sub">
                    Sign out of your BudgetWise account
                  </p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>

              <div className="profile-action-row danger">
                <div>
                  <p className="profile-action-title danger">Delete account</p>
                  <p className="profile-action-sub">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FiTrash2 size={15} />
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">
              <FiTrash2 size={24} color="#dc2626" />
            </div>
            <h3 className="modal-title">Delete account?</h3>
            <p className="modal-sub">
              This will permanently delete your account and all
              your expense data. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
              >
                <FiTrash2 size={14} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile