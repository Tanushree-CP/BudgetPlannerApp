// Format number as Indian currency
export function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN")
}

// Get current month expenses only
export function getCurrentMonthExpenses(expenses) {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  return expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === month && d.getFullYear() === year
  })
}

// Group expenses by category
export function groupByCategory(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
}

// Get total of expenses array
export function getTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

// Get percentage — safe division
export function getPercent(value, total) {
  if (!total) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

// Get initials from name
export function getInitials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Format date for display
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}