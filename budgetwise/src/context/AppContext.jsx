import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS, DEFAULT_BUDGETS } from '../utils/constants'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER)
    return saved ? JSON.parse(saved) : null
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    return saved ? JSON.parse(saved) : []
  })

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS)
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS
  })

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true'
  })

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  }, [budgets])

  function login(userData) {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true')
  }

  function logout() {
    setIsLoggedIn(false)
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'false')
  }

  function addExpense(expense) {
    setExpenses(prev => [expense, ...prev])
  }

  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  function updateExpense(id, updated) {
    setExpenses(prev =>
      prev.map(e => e.id === id ? { ...e, ...updated } : e)
    )
  }

  function updateBudgets(newBudgets) {
    setBudgets(newBudgets)
  }

  function updateUser(updates) {
    setUser(prev => ({ ...prev, ...updates }))
  }

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function hideToast() {
    setToast(null)
  }

  return (
    <AppContext.Provider value={{
      user, isLoggedIn,
      expenses, budgets,
      toast, showToast, hideToast,
      login, logout,
      addExpense, deleteExpense, updateExpense,
      updateBudgets, updateUser
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}