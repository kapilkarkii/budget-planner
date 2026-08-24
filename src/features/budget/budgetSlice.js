import { createSlice } from '@reduxjs/toolkit'
import { CATEGORIES } from '../../constants/categories'

const loadTransactions = () => {
  try {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const loadLimits = () => {
  try {
    const saved = localStorage.getItem('limits')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const loadCategories = () => {
  try {
    const saved = localStorage.getItem('categories')
    if (!saved) return CATEGORIES
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || parsed.length === 0) return CATEGORIES
    return parsed.map((c) => (typeof c === 'object' && c !== null ? c.name : c))
  } catch {
    return CATEGORIES
  }
}

const loadGoals = () => {
  try {
    const saved = localStorage.getItem('goals')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const loadCurrency = () => {
  try {
    return localStorage.getItem('currency') || 'USD'
  } catch {
    return 'USD'
  }
}

const initialState = {
  transactions: loadTransactions(),
  limits: loadLimits(),
  categories: loadCategories(),
  goals: loadGoals(),
  currency: loadCurrency(),
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload)
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload)
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) state.transactions[index] = action.payload
    },
    setLimit: (state, action) => {
      state.limits[action.payload.category] = action.payload.limit
    },
    addCategory: (state, action) => {
      const name = action.payload.trim()
      if (name && !state.categories.includes(name)) {
        state.categories.push(name)
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c !== action.payload)
    },
    addGoal: (state, action) => {
      state.goals.push({
        id: Date.now(),
        name: action.payload.name,
        target: action.payload.target,
        saved: 0,
      })
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload)
    },
    contributeToGoal: (state, action) => {
      const goal = state.goals.find((g) => g.id === action.payload.id)
      if (goal) goal.saved += action.payload.amount
    },
    withdrawFromGoal: (state, action) => {
      const goal = state.goals.find((g) => g.id === action.payload.id)
      if (goal) {
        goal.saved = Math.max(0, goal.saved - action.payload.amount)
      }
    },
    setCurrency: (state, action) => {
      state.currency = action.payload
    },
  },
})

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  setLimit,
  addCategory,
  deleteCategory,
  addGoal,
  deleteGoal,
  contributeToGoal,
  withdrawFromGoal,
  setCurrency,
} = budgetSlice.actions
export default budgetSlice.reducer