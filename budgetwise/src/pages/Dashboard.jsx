import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiTrendingUp, FiTrendingDown,
  FiDollarSign, FiActivity, FiArrowRight,
  FiCalendar, FiAlertCircle, FiAward,
  FiCreditCard, FiCheckCircle
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import {
  getCurrentMonthExpenses,
  getTotal,
  groupByCategory,
  getPercent,
  formatCurrency,
  formatDate
} from '../utils/helpers'
import { CATEGORY_CONFIG } from '../utils/constants'

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-top">
        <div
          className="stat-icon-wrap"
          style={{ background: color + '18' }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  )
}

function Dashboard() {
  const { user, expenses, budgets } = useApp()

  const currentMonth = useMemo(() =>
    getCurrentMonthExpenses(expenses), [expenses])

  const total      = getTotal(currentMonth)
  const budget     = user?.monthlyBudget || 10000
  const remaining  = budget - total
  const budgetPct  = getPercent(total, budget)
  const byCategory = groupByCategory(currentMonth)

  const biggestCat = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])[0]

  const recentFive = [...expenses]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  const isOverBudget = total > budget
  const isNearLimit  = budgetPct >= 80 && !isOverBudget

  return (
    <div>

      {/* ── Topbar ── */}
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">
            Good morning, {user?.name?.split(' ')[0]}
          </p>
          <p className="topbar-date">{today}</p>
        </div>
        <div className="topbar-actions">
          <Link to="/add" className="btn-primary">
            <FiPlus size={16} />
            Add Expense
          </Link>
        </div>
      </div>

      <div className="page-container">

        {/* ── Alerts ── */}
        {isOverBudget && (
          <div className="alert alert-danger">
            <FiAlertCircle size={16} />
            You have exceeded your monthly budget by{' '}
            <strong>{formatCurrency(total - budget)}</strong>
          </div>
        )}
        {isNearLimit && (
          <div className="alert alert-warning">
            <FiAlertCircle size={16} />
            You have used <strong>{budgetPct}%</strong> of your
            monthly budget.{' '}
            {formatCurrency(remaining)} remaining.
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="stats-grid">
          <StatCard
            label="Total Spent"
            value={formatCurrency(total)}
            sub="This month"
            icon={FiCreditCard}
            color="#7C3AED"
          />
          <StatCard
            label="Remaining"
            value={formatCurrency(Math.max(0, remaining))}
            sub={`of ${formatCurrency(budget)} budget`}
            icon={FiDollarSign}
            color={remaining < 0 ? '#dc2626' : '#059669'}
          />
          <StatCard
            label="Transactions"
            value={currentMonth.length}
            sub="This month"
            icon={FiActivity}
            color="#3b82f6"
          />
          <StatCard
            label="Biggest Category"
            value={biggestCat ? formatCurrency(biggestCat[1]) : '₹0'}
            sub={biggestCat ? biggestCat[0] : 'No expenses yet'}
            icon={FiAward}
            color="#f59e0b"
          />
        </div>

        {/* ── Two column section ── */}
        <div className="dash-section">

          {/* Budget progress + category breakdown */}
          <div className="dash-card">
            <div className="dash-card-header">
              <p className="dash-card-title">
                <FiCheckCircle
                  size={14}
                  style={{ color: '#7C3AED', marginRight: 6 }}
                />
                Monthly Budget
              </p>
              <span
                className="budget-pct-badge"
                style={{
                  background: isOverBudget ? '#FEF2F2' : '#F5F3FF',
                  color:      isOverBudget ? '#dc2626' : '#7C3AED'
                }}
              >
                {budgetPct}% used
              </span>
            </div>

            <div className="budget-track">
              <div
                className="budget-fill"
                style={{
                  width: Math.min(budgetPct, 100) + '%',
                  background: isOverBudget
                    ? '#dc2626'
                    : budgetPct >= 80 ? '#f59e0b' : '#7C3AED'
                }}
              />
            </div>
            <div className="budget-row">
              <span>{formatCurrency(total)} spent</span>
              <span>{formatCurrency(budget)} limit</span>
            </div>

            {Object.entries(byCategory).length === 0 ? (
              <div className="dash-empty-small">
                <FiActivity size={20} color="#EDE9FE" />
                <p>No spending data yet</p>
              </div>
            ) : (
              Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, amt]) => {
                  const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other
                  const pct    = getPercent(amt, total)
                  return (
                    <div key={cat} className="cat-breakdown-row">
                      <div className="cat-breakdown-left">
                        <span
                          className="cat-dot"
                          style={{ background: config.color }}
                        />
                        <span className="cat-breakdown-name">{cat}</span>
                      </div>
                      <div className="cat-breakdown-bar">
                        <div
                          className="cat-breakdown-fill"
                          style={{
                            width:      pct + '%',
                            background: config.color
                          }}
                        />
                      </div>
                      <span className="cat-breakdown-amt">
                        {formatCurrency(amt)}
                      </span>
                    </div>
                  )
                })
            )}
          </div>

          {/* Recent expenses */}
          <div className="dash-card">
            <div className="dash-card-header">
              <p className="dash-card-title">
                <FiTrendingUp
                  size={14}
                  style={{ color: '#7C3AED', marginRight: 6 }}
                />
                Recent Expenses
              </p>
              <Link to="/expenses" className="dash-card-link">
                View all
                <FiArrowRight size={13} />
              </Link>
            </div>

            {recentFive.length === 0 ? (
              <div className="dash-empty">
                <FiActivity size={32} color="#EDE9FE" />
                <p>No expenses yet</p>
                <Link
                  to="/add"
                  className="btn-primary"
                  style={{ marginTop: 10, fontSize: '0.8rem', padding: '8px 14px' }}
                >
                  <FiPlus size={14} />
                  Add your first expense
                </Link>
              </div>
            ) : (
              <div className="recent-list">
                {recentFive.map(expense => {
                  const config = CATEGORY_CONFIG[expense.category]
                    || CATEGORY_CONFIG.Other
                  return (
                    <div key={expense.id} className="recent-item">

                      <div
                        className="recent-icon"
                        style={{ background: config.bg }}
                      >
                        <span style={{
                          color:      config.text,
                          fontSize:   '0.68rem',
                          fontWeight: 700
                        }}>
                          {expense.category.slice(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div className="recent-info">
                        <p className="recent-desc">
                          {expense.description}
                        </p>
                        <p className="recent-meta">
                          <span
                            className="recent-cat"
                            style={{
                              background: config.bg,
                              color:      config.text
                            }}
                          >
                            {expense.category}
                          </span>
                          <FiCalendar size={10} />
                          {formatDate(expense.date)}
                        </p>
                      </div>

                      <p className="recent-amt">
                        {formatCurrency(expense.amount)}
                      </p>

                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard