import { useState } from 'react'
import {
  FiTarget, FiSave, FiAlertCircle,
  FiCheckCircle, FiTrendingUp, FiEdit2
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import {
  getCurrentMonthExpenses,
  groupByCategory,
  getPercent,
  formatCurrency
} from '../utils/helpers'
import { CATEGORIES, CATEGORY_CONFIG } from '../utils/constants'

function BudgetBar({ category, spent, limit, config }) {
  const pct         = getPercent(spent, limit)
  const isOver      = spent > limit
  const isNear      = pct >= 80 && !isOver
  const remaining   = limit - spent

  const barColor = isOver ? '#dc2626' : isNear ? '#f59e0b' : config.color

  return (
    <div className="budget-cat-card">

      <div className="budget-cat-header">
        <div className="budget-cat-left">
          <div
            className="budget-cat-icon"
            style={{ background: config.bg }}
          >
            <span style={{
              color:      config.text,
              fontSize:   '0.72rem',
              fontWeight: 700
            }}>
              {category.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="budget-cat-name">{category}</p>
            <p className="budget-cat-spent">
              {formatCurrency(spent)} spent
            </p>
          </div>
        </div>

        <div className="budget-cat-right">
          {isOver && (
            <span className="budget-status over">
              <FiAlertCircle size={12} />
              Over by {formatCurrency(spent - limit)}
            </span>
          )}
          {isNear && (
            <span className="budget-status near">
              <FiAlertCircle size={12} />
              {pct}% used
            </span>
          )}
          {!isOver && !isNear && (
            <span className="budget-status good">
              <FiCheckCircle size={12} />
              {formatCurrency(remaining)} left
            </span>
          )}
        </div>
      </div>

      <div className="budget-cat-track">
        <div
          className="budget-cat-fill"
          style={{
            width:      Math.min(pct, 100) + '%',
            background: barColor
          }}
        />
      </div>

      <div className="budget-cat-footer">
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {pct}%
        </span>
      </div>

    </div>
  )
}

function Budget() {
  const { expenses, budgets, updateBudgets, user } = useApp()

  const currentMonth = getCurrentMonthExpenses(expenses)
  const byCategory   = groupByCategory(currentMonth)

  const [editMode, setEditMode]   = useState(false)
  const [localBudgets, setLocalBudgets] = useState({ ...budgets })
  const [saved, setSaved]         = useState(false)
  const [errors, setErrors]       = useState({})

  function handleChange(cat, value) {
    setLocalBudgets(prev => ({ ...prev, [cat]: value }))
    if (errors[cat]) setErrors(prev => ({ ...prev, [cat]: '' }))
    setSaved(false)
  }

  function validate() {
    const e = {}
    CATEGORIES.forEach(cat => {
      const val = Number(localBudgets[cat])
      if (!localBudgets[cat] || isNaN(val) || val < 0)
        e[cat] = 'Enter a valid amount'
    })
    return e
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const parsed = {}
    CATEGORIES.forEach(cat => {
      parsed[cat] = Number(localBudgets[cat])
    })
    updateBudgets(parsed)
    setEditMode(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleCancel() {
    setLocalBudgets({ ...budgets })
    setErrors({})
    setEditMode(false)
  }

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0)
  const totalSpent  = Object.values(byCategory).reduce((s, v) => s + v, 0)
  const overallPct  = getPercent(totalSpent, user?.monthlyBudget || 10000)

  return (
    <div>

      {/* ── Topbar ── */}
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">Budget</p>
          <p className="topbar-date">
            Manage your category spending limits
          </p>
        </div>
        <div className="topbar-actions">
          {!editMode ? (
            <button
              className="btn-primary"
              onClick={() => { setEditMode(true); setSaved(false) }}
            >
              <FiEdit2 size={15} />
              Edit Budgets
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <FiSave size={15} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-container">

        {/* ── Save success banner ── */}
        {saved && (
          <div className="alert-success">
            <FiCheckCircle size={16} />
            Budget limits saved successfully!
          </div>
        )}

        {/* ── Overall summary ── */}
        <div className="budget-summary-card">
          <div className="budget-summary-left">
            <div className="budget-summary-icon">
              <FiTarget size={22} color="#7C3AED" />
            </div>
            <div>
              <p className="budget-summary-title">Overall Monthly Budget</p>
              <p className="budget-summary-sub">
                {formatCurrency(totalSpent)} spent of{' '}
                {formatCurrency(user?.monthlyBudget || 10000)}
              </p>
            </div>
          </div>
          <div className="budget-summary-right">
            <span
              className="budget-overall-pct"
              style={{
                color: overallPct >= 100
                  ? '#dc2626'
                  : overallPct >= 80 ? '#f59e0b' : '#7C3AED'
              }}
            >
              {overallPct}%
            </span>
            <span className="budget-overall-label">used</span>
          </div>
        </div>

        {/* ── Edit mode form ── */}
        {editMode && (
          <div className="budget-edit-card">
            <p className="budget-edit-title">
              <FiEdit2 size={14} style={{ color: '#7C3AED' }} />
              Set category limits
            </p>
            <div className="budget-edit-grid">
              {CATEGORIES.map(cat => {
                const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other
                return (
                  <div key={cat} className="budget-edit-field">
                    <label className="budget-edit-label">
                      <div
                        className="budget-edit-dot"
                        style={{ background: config.color }}
                      />
                      {cat}
                    </label>
                    <div className="budget-edit-input-wrap">
                      <span className="budget-edit-rupee">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={localBudgets[cat]}
                        onChange={e => handleChange(cat, e.target.value)}
                        className={`budget-edit-input ${errors[cat] ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors[cat] && (
                      <span className="add-field-error">
                        <FiAlertCircle size={11} />
                        {errors[cat]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Category budget bars ── */}
        <div className="budget-cats-grid">
          {CATEGORIES.map(cat => {
            const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other
            const spent  = byCategory[cat] || 0
            const limit  = budgets[cat] || 0
            return (
              <BudgetBar
                key={cat}
                category={cat}
                spent={spent}
                limit={limit}
                config={config}
              />
            )
          })}
        </div>

        {/* ── Tips ── */}
        <div className="budget-tips-card">
          <p className="budget-tips-title">
            <FiTrendingUp size={14} style={{ color: '#7C3AED' }} />
            Budget tips
          </p>
          <div className="budget-tips-grid">
            <div className="budget-tip-item">
              <div className="budget-tip-dot" style={{ background: '#059669' }} />
              <p>Green bar — you are within your budget limit</p>
            </div>
            <div className="budget-tip-item">
              <div className="budget-tip-dot" style={{ background: '#f59e0b' }} />
              <p>Yellow bar — you have used more than 80% of your limit</p>
            </div>
            <div className="budget-tip-item">
              <div className="budget-tip-dot" style={{ background: '#dc2626' }} />
              <p>Red bar — you have exceeded your budget limit</p>
            </div>
            <div className="budget-tip-item">
              <div className="budget-tip-dot" style={{ background: '#7C3AED' }} />
              <p>Click Edit Budgets to adjust your category limits anytime</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Budget