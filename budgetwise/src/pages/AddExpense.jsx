import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  FiArrowLeft, FiSave, FiDollarSign,
  FiTag, FiCalendar, FiFileText, FiAlertCircle
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CATEGORY_CONFIG, EMPTY_EXPENSE } from '../utils/constants'
import { formatCurrency } from '../utils/helpers'

function AddExpense() {
  const navigate   = useNavigate()
  const { id }     = useParams()
  const isEditMode = Boolean(id)
  const { expenses, addExpense, updateExpense, showToast } = useApp()

  const [formData, setFormData] = useState(EMPTY_EXPENSE)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)

  useEffect(() => {
    if (isEditMode) {
      const existing = expenses.find(e => e.id === Number(id))
      if (existing) {
        setFormData({
          description: existing.description,
          amount:      existing.amount,
          category:    existing.category,
          date:        existing.date,
          note:        existing.note || ''
        })
      } else {
        navigate('/expenses')
      }
    }
  }, [id, expenses, isEditMode, navigate])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!formData.description.trim())
      e.description = 'Description is required'
    if (!formData.amount || Number(formData.amount) <= 0)
      e.amount = 'Please enter a valid amount'
    if (!formData.date)
      e.date = 'Date is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      if (isEditMode) {
        updateExpense(Number(id), {
          ...formData,
          amount: Number(formData.amount)
        })
      } else {
        addExpense({
          ...formData,
          amount: Number(formData.amount),
          id:     Date.now()
        })
      }
      showToast(
        isEditMode ? 'Expense updated!' : 'Expense added!',
        'success'
      )
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/expenses'), 1200)
    }, 600)
  }

  const selectedConfig = CATEGORY_CONFIG[formData.category] || CATEGORY_CONFIG.Other

  return (
    <div>
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">
            {isEditMode ? 'Edit Expense' : 'Add Expense'}
          </p>
          <p className="topbar-date">
            {isEditMode ? 'Update your transaction' : 'Record a new transaction'}
          </p>
        </div>
        <div className="topbar-actions">
          <Link to="/expenses" className="btn-secondary">
            <FiArrowLeft size={15} /> Back
          </Link>
        </div>
      </div>

      <div className="page-container">
        <div className="add-expense-layout">

          <div className="add-expense-form-card">
            {success && (
              <div className="add-success-banner">
                <FiSave size={16} />
                {isEditMode ? 'Expense updated!' : 'Expense added!'} Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              <div className="add-field">
                <label className="add-label">
                  <FiFileText size={13} /> Description *
                </label>
                <input
                  name="description"
                  placeholder="e.g. Swiggy lunch, Ola cab..."
                  value={formData.description}
                  onChange={handleChange}
                  className={`add-input ${errors.description ? 'has-error' : ''}`}
                />
                {errors.description && (
                  <span className="add-field-error">
                    <FiAlertCircle size={12} /> {errors.description}
                  </span>
                )}
              </div>

              <div className="add-row">
                <div className="add-field">
                  <label className="add-label">
                    <FiDollarSign size={13} /> Amount (₹) *
                  </label>
                  <div className="add-amount-wrap">
                    <span className="add-rupee">₹</span>
                    <input
                      name="amount"
                      type="number"
                      placeholder="0"
                      min="1"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`add-input add-amount-input ${errors.amount ? 'has-error' : ''}`}
                    />
                  </div>
                  {errors.amount && (
                    <span className="add-field-error">
                      <FiAlertCircle size={12} /> {errors.amount}
                    </span>
                  )}
                </div>

                <div className="add-field">
                  <label className="add-label">
                    <FiTag size={13} /> Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="add-input"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="add-field">
                <label className="add-label">
                  <FiCalendar size={13} /> Date *
                </label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`add-input ${errors.date ? 'has-error' : ''}`}
                />
                {errors.date && (
                  <span className="add-field-error">
                    <FiAlertCircle size={12} /> {errors.date}
                  </span>
                )}
              </div>

              <div className="add-field">
                <label className="add-label">
                  <FiFileText size={13} /> Note (optional)
                </label>
                <textarea
                  name="note"
                  placeholder="Any extra details..."
                  value={formData.note}
                  onChange={handleChange}
                  className="add-input add-textarea"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="add-submit-btn"
                disabled={loading || success}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  <>
                    <FiSave size={16} />
                    {isEditMode ? 'Update Expense' : 'Add Expense'}
                  </>
                )}
              </button>

            </form>
          </div>

          <div className="add-preview-card">
            <p className="add-preview-title">Preview</p>
            <div className="add-preview-expense">
              <div className="add-preview-icon"
                style={{ background: selectedConfig.bg }}>
                <span style={{
                  color: selectedConfig.text,
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  {formData.category.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="add-preview-info">
                <p className="add-preview-desc">
                  {formData.description || 'Your expense description'}
                </p>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginTop: 5 }}>
                  <span className="exp-card-cat"
                    style={{ background: selectedConfig.bg, color: selectedConfig.text }}>
                    {formData.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCalendar size={11} /> {formData.date || 'No date'}
                  </span>
                </div>
              </div>
              <p className="add-preview-amt">
                {formData.amount ? formatCurrency(Number(formData.amount)) : '₹0'}
              </p>
            </div>

            <div className="add-tips">
              <p className="add-tips-title">Quick tips</p>
              <p className="add-tips-item">
                <FiTag size={12} style={{ color: '#7C3AED' }} />
                Choose the right category for better analytics
              </p>
              <p className="add-tips-item">
                <FiCalendar size={12} style={{ color: '#7C3AED' }} />
                Use today's date for accurate monthly tracking
              </p>
              <p className="add-tips-item">
                <FiFileText size={12} style={{ color: '#7C3AED' }} />
                Add a note for extra context if needed
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AddExpense