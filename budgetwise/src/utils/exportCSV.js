export function exportToCSV(expenses, filename = 'expenses') {
  if (!expenses || expenses.length === 0) return false

  const headers = ['Description', 'Amount (₹)', 'Category', 'Date', 'Note']

  const rows = expenses.map(e => [
    `"${e.description.replace(/"/g, '""')}"`,
    e.amount,
    e.category,
    e.date,
    `"${(e.note || '').replace(/"/g, '""')}"`
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

export function exportSummaryCSV(expenses, budgets, user) {
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)

  const headers = [
    'Category', 'Amount Spent (₹)',
    'Budget Limit (₹)', 'Remaining (₹)', 'Usage %'
  ]

  const rows = Object.entries(byCategory).map(([cat, amt]) => {
    const limit     = budgets[cat] || 0
    const remaining = limit - amt
    const pct       = limit > 0 ? Math.round((amt / limit) * 100) : 0
    return [cat, amt, limit, remaining, pct + '%']
  })

  rows.push([''])
  rows.push([
    'TOTAL', totalSpent,
    user?.monthlyBudget || 0,
    (user?.monthlyBudget || 0) - totalSpent, ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `budget_summary_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}