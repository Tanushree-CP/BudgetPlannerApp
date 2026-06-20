export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other"
]

export const CATEGORY_CONFIG = {
  Food:          { color: "#f59e0b", bg: "#fff4e6", text: "#c05621", icon: "🍔" },
  Transport:     { color: "#6c8ef5", bg: "#e6f3ff", text: "#1a56db", icon: "🚗" },
  Shopping:      { color: "#a78bfa", bg: "#f3e6ff", text: "#6b21a8", icon: "🛍️" },
  Bills:         { color: "#f87171", bg: "#fff0f0", text: "#c53030", icon: "📄" },
  Entertainment: { color: "#34d399", bg: "#e6fff0", text: "#276749", icon: "🎬" },
  Health:        { color: "#2dd4bf", bg: "#e6fffa", text: "#285e61", icon: "❤️" },
  Other:         { color: "#94a3b8", bg: "#f7f7f7", text: "#4a5568", icon: "📦" },
}

export const DEFAULT_BUDGETS = {
  Food: 3000,
  Transport: 2000,
  Shopping: 1500,
  Bills: 2500,
  Entertainment: 1000,
  Health: 1000,
  Other: 500
}

export const MONTHS = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
]

export const EMPTY_EXPENSE = {
  description: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: ""
}

export const STORAGE_KEYS = {
  USER:     "bw_user",
  EXPENSES: "bw_expenses",
  BUDGETS:  "bw_budgets",
  LOGGED_IN: "bw_logged_in"
}