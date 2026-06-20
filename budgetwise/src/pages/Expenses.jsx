import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiSearch, FiTrash2, FiEdit2,
  FiCalendar, FiFilter, FiX, FiAlertCircle,
  FiDownload
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate } from '../utils/helpers'
import { CATEGORIES, CATEGORY_CONFIG } from '../utils/constants'
import { exportToCSV } from '../utils/exportCSV'

function Expenses() {
  const { expenses, deleteExpense, showToast } = useApp()

  const [search, setSearch]               = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [monthFilter, setMonthFilter]     = useState('all')
  const [confirmId, setConfirmId]         = useState(null)

  const monthOptions = useMemo(() => {
    const set = new Set()
    expenses.forEach(e => {
      const d = new Date(e.date)
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    })
    return Array.from(set).sort().reverse()
  }, [expenses])

  const filtered = useMemo(() => {
    return expenses
      .filter(e => categoryFilter === 'All' || e.category === categoryFilter)
      .filter(e => {
        if (monthFilter === 'all') return true
        const d   = new Date(e.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        return key === monthFilter
      })
      .filter(e => {
        if (!search.trim()) return true
        return e.description.toLowerCase().includes(search.toLowerCase())
      })
      .sort((a, b) => b.id - a.id)
  }, [expenses, categoryFilter, monthFilter, search])

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0)
  const hasFilters    = search || categoryFilter !== 'All' || monthFilter !== 'all'

  function handleDelete(id) {
    deleteExpense(id)
    setConfirmId(null)
    showToast('Expense deleted', 'error')
  }

  function clearFilters() {
    setSearch('')
    setCategoryFilter('All')
    setMonthFilter('all')
  }

  return (
    <div>
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">Expenses</p>
          <p className="topbar-date">{expenses.length} total transactions</p>
        </div>
        <div className="topbar-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              const ok = exportToCSV(expenses, 'my_expenses')
              if (ok) showToast('Expenses exported to CSV!', 'success')
              else    showToast('No expenses to export', 'info')
            }}
          >
            <FiDownload size={15} />
            Export CSV
          </button>
          <Link to="/add" className="btn-primary">
            <FiPlus size={16} />
            Add Expense
          </Link>
        </div>
      </div>

      <div className="page-container">

        <div className="exp-filter-bar">
          <div className="exp-search-wrap">
            <FiSearch className="exp-search-icon" size={15} />
            <input
              className="exp-search-input"
              placeholder="Search expenses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="exp-search-clear" onClick={() => setSearch('')}>
                <FiX size={14} />
              </button>
            )}
          </div>

          <div className="exp-filter-group">
            <FiFilter size={14} className="exp-filter-icon" />
            <select
              className="exp-filter-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="exp-filter-group">
            <FiCalendar size={14} className="exp-filter-icon" />
            <select
              className="exp-filter-select"
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
            >
              <option value="all">All Months</option>
              {monthOptions.map(m => {
                const [year, month] = m.split('-')
                const label = new Date(year, month - 1)
                  .toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                return <option key={m} value={m}>{label}</option>
              })}
            </select>
          </div>

          {hasFilters && (
            <button className="exp-clear-btn" onClick={clearFilters}>
              <FiX size={14} />
              Clear
            </button>
          )}
        </div>

        {hasFilters && (
          <div className="exp-results-bar">
            <span>
              Showing <strong>{filtered.length}</strong> of{' '}
              <strong>{expenses.length}</strong> expenses
            </span>
            <span className="exp-results-total">
              Total: <strong>{formatCurrency(totalFiltered)}</strong>
            </span>
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">
              <FiAlertCircle size={36} color="#EDE9FE" />
            </div>
            <p className="exp-empty-title">No expenses yet</p>
            <p className="exp-empty-sub">Start tracking by adding your first expense</p>
            <Link to="/add" className="btn-primary">
              <FiPlus size={15} /> Add your first expense
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">
              <FiSearch size={36} color="#EDE9FE" />
            </div>
            <p className="exp-empty-title">No results found</p>
            <p className="exp-empty-sub">Try adjusting your search or filters</p>
            <button className="btn-secondary" onClick={clearFilters}>
              <FiX size={14} /> Clear filters
            </button>
          </div>
        ) : (
          <div className="exp-list">
            {filtered.map(expense => {
              const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.Other
              return (
                <div key={expense.id} className="exp-card">
                  <div className="exp-card-left">
                    <div className="exp-cat-icon" style={{ background: config.bg }}>
                      <span style={{ color: config.text, fontSize: '0.72rem', fontWeight: 700 }}>
                        {expense.category.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="exp-card-info">
                      <p className="exp-card-desc">{expense.description}</p>
                      {expense.note && (
                        <p className="exp-card-note">{expense.note}</p>
                      )}
                      <div className="exp-card-meta">
                        <span className="exp-card-cat"
                          style={{ background: config.bg, color: config.text }}>
                          {expense.category}
                        </span>
                        <span className="exp-card-date">
                          <FiCalendar size={11} />
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="exp-card-right">
                    <p className="exp-card-amt">{formatCurrency(expense.amount)}</p>
                    <div className="exp-card-actions">
                      <Link to={`/edit/${expense.id}`}
                        className="exp-action-btn edit" title="Edit">
                        <FiEdit2 size={15} />
                      </Link>
                      <button className="exp-action-btn delete"
                        onClick={() => setConfirmId(expense.id)} title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">
              <FiTrash2 size={24} color="#dc2626" />
            </div>
            <h3 className="modal-title">Delete expense?</h3>
            <p className="modal-sub">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDelete(confirmId)}>
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Expenses