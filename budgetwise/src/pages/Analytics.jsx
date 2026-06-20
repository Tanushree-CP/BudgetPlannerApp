import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, Title
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import {
  FiPieChart, FiBarChart2, FiTrendingUp,
  FiArrowUp, FiArrowDown, FiCalendar
} from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import {
  formatCurrency, getTotal,
  groupByCategory, getCurrentMonthExpenses
} from '../utils/helpers'
import { CATEGORY_CONFIG, MONTHS } from '../utils/constants'

// register Chart.js components
ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, Title
)

function EmptyChart({ message }) {
  return (
    <div className="chart-empty">
      <FiPieChart size={36} color="#EDE9FE" />
      <p>{message}</p>
    </div>
  )
}

function Analytics() {
  const { expenses } = useApp()

  // ── Current month data ──
  const currentMonth = useMemo(() =>
    getCurrentMonthExpenses(expenses), [expenses])

  const currentTotal  = getTotal(currentMonth)
  const currentByCat  = groupByCategory(currentMonth)

  // ── Previous month data ──
  const prevMonth = useMemo(() => {
    const now   = new Date()
    const month = now.getMonth() - 1
    const year  = month < 0 ? now.getFullYear() - 1 : now.getFullYear()
    const m     = month < 0 ? 11 : month
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === m && d.getFullYear() === year
    })
  }, [expenses])

  const prevTotal = getTotal(prevMonth)

  // month over month change
  const momChange = prevTotal > 0
    ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100)
    : null

  // ── Last 6 months bar chart data ──
  const last6Months = useMemo(() => {
    const now    = new Date()
    const result = []
    for (let i = 5; i >= 0; i--) {
      const date  = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = date.getMonth()
      const year  = date.getFullYear()
      const total = expenses
        .filter(e => {
          const d = new Date(e.date)
          return d.getMonth() === month && d.getFullYear() === year
        })
        .reduce((s, e) => s + e.amount, 0)
      result.push({ label: MONTHS[month].slice(0, 3), total })
    }
    return result
  }, [expenses])

  // ── Top spending category ──
  const topCategory = Object.entries(currentByCat)
    .sort((a, b) => b[1] - a[1])[0]

  // ── Average per transaction ──
  const avgTransaction = currentMonth.length > 0
    ? Math.round(currentTotal / currentMonth.length)
    : 0

  // ── Pie chart data ──
  const pieData = useMemo(() => {
    const labels = Object.keys(currentByCat)
    const data   = Object.values(currentByCat)
    const colors = labels.map(cat =>
      CATEGORY_CONFIG[cat]?.color || '#94a3b8'
    )
    return {
      labels,
      datasets: [{
        data,
        backgroundColor:  colors.map(c => c + 'CC'),
        borderColor:      colors,
        borderWidth:      2,
        hoverOffset:      8
      }]
    }
  }, [currentByCat])

  // ── Bar chart data ──
  const barData = useMemo(() => ({
    labels: last6Months.map(m => m.label),
    datasets: [{
      label: 'Spending (₹)',
      data:  last6Months.map(m => m.total),
      backgroundColor: '#7C3AED33',
      borderColor:     '#7C3AED',
      borderWidth:     2,
      borderRadius:    8,
      borderSkipped:   false
    }]
  }), [last6Months])

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding:   16,
          font:      { size: 12, family: 'system-ui' },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
        }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid:  { color: '#F5F3FF' },
        ticks: {
          font:     { size: 11, family: 'system-ui' },
          color:    '#94a3b8',
          callback: v => '₹' + v.toLocaleString('en-IN')
        }
      },
      x: {
        grid:  { display: false },
        ticks: {
          font:  { size: 11, family: 'system-ui' },
          color: '#94a3b8'
        }
      }
    }
  }

  const currentMonthName = MONTHS[new Date().getMonth()]

  return (
    <div>

      {/* ── Topbar ── */}
      <div className="page-topbar">
        <div>
          <p className="topbar-greeting">Analytics</p>
          <p className="topbar-date">Your spending insights</p>
        </div>
        <div className="topbar-actions">
          <div className="analytics-month-badge">
            <FiCalendar size={14} />
            {currentMonthName} {new Date().getFullYear()}
          </div>
        </div>
      </div>

      <div className="page-container">

        {/* ── Summary stat cards ── */}
        <div className="analytics-stats">

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon purple">
              <FiTrendingUp size={18} />
            </div>
            <div>
              <p className="analytics-stat-val">
                {formatCurrency(currentTotal)}
              </p>
              <p className="analytics-stat-label">This month</p>
            </div>
            {momChange !== null && (
              <span className={`analytics-change ${momChange >= 0 ? 'up' : 'down'}`}>
                {momChange >= 0
                  ? <FiArrowUp size={12} />
                  : <FiArrowDown size={12} />
                }
                {Math.abs(momChange)}% vs last month
              </span>
            )}
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon green">
              <FiBarChart2 size={18} />
            </div>
            <div>
              <p className="analytics-stat-val">
                {formatCurrency(prevTotal)}
              </p>
              <p className="analytics-stat-label">Last month</p>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon amber">
              <FiPieChart size={18} />
            </div>
            <div>
              <p className="analytics-stat-val">
                {topCategory ? topCategory[0] : '—'}
              </p>
              <p className="analytics-stat-label">Top category</p>
            </div>
            {topCategory && (
              <span className="analytics-cat-amt">
                {formatCurrency(topCategory[1])}
              </span>
            )}
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon blue">
              <FiTrendingUp size={18} />
            </div>
            <div>
              <p className="analytics-stat-val">
                {formatCurrency(avgTransaction)}
              </p>
              <p className="analytics-stat-label">Avg per transaction</p>
            </div>
          </div>

        </div>

        {/* ── Charts row ── */}
        <div className="analytics-charts-row">

          {/* Pie chart */}
          <div className="analytics-chart-card">
            <div className="analytics-chart-header">
              <p className="analytics-chart-title">
                <FiPieChart size={15} style={{ color: '#7C3AED' }} />
                Spending by Category
              </p>
              <span className="analytics-chart-sub">
                {currentMonthName}
              </span>
            </div>
            {Object.keys(currentByCat).length === 0 ? (
              <EmptyChart message="No expenses this month yet" />
            ) : (
              <div className="pie-wrap">
                <Pie data={pieData} options={pieOptions} />
              </div>
            )}
          </div>

          {/* Bar chart */}
          <div className="analytics-chart-card">
            <div className="analytics-chart-header">
              <p className="analytics-chart-title">
                <FiBarChart2 size={15} style={{ color: '#7C3AED' }} />
                Monthly Spending Trend
              </p>
              <span className="analytics-chart-sub">Last 6 months</span>
            </div>
            {expenses.length === 0 ? (
              <EmptyChart message="Add expenses to see trends" />
            ) : (
              <div className="bar-wrap">
                <Bar data={barData} options={barOptions} />
              </div>
            )}
          </div>

        </div>

        {/* ── Category breakdown table ── */}
        <div className="analytics-breakdown-card">
          <div className="analytics-chart-header">
            <p className="analytics-chart-title">
              <FiTrendingUp size={15} style={{ color: '#7C3AED' }} />
              Category Breakdown
            </p>
            <span className="analytics-chart-sub">{currentMonthName}</span>
          </div>

          {Object.keys(currentByCat).length === 0 ? (
            <div className="chart-empty" style={{ padding: '1.5rem' }}>
              <FiBarChart2 size={28} color="#EDE9FE" />
              <p>No data to show yet</p>
            </div>
          ) : (
            <div className="analytics-table">
              <div className="analytics-table-head">
                <span>Category</span>
                <span>Transactions</span>
                <span>Amount</span>
                <span>Share</span>
              </div>
              {Object.entries(currentByCat)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => {
                  const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other
                  const count  = currentMonth.filter(e => e.category === cat).length
                  const pct    = currentTotal > 0
                    ? Math.round((amt / currentTotal) * 100) : 0
                  return (
                    <div key={cat} className="analytics-table-row">
                      <div className="analytics-table-cat">
                        <div
                          className="analytics-table-icon"
                          style={{ background: config.bg }}
                        >
                          <span style={{
                            color:      config.text,
                            fontSize:   '0.68rem',
                            fontWeight: 700
                          }}>
                            {cat.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span>{cat}</span>
                      </div>
                      <span className="analytics-table-count">
                        {count} {count === 1 ? 'transaction' : 'transactions'}
                      </span>
                      <span className="analytics-table-amt">
                        {formatCurrency(amt)}
                      </span>
                      <div className="analytics-table-share">
                        <div className="analytics-share-bar">
                          <div
                            className="analytics-share-fill"
                            style={{
                              width:      pct + '%',
                              background: config.color
                            }}
                          />
                        </div>
                        <span className="analytics-share-pct">{pct}%</span>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Analytics