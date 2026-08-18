import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Salary',
  'Other',
]

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
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

const initialState = {
  transactions: loadTransactions(),
  limits: loadLimits(),
  categories: loadCategories(),
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
  },
})

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  setLimit,
  addCategory,
  deleteCategory,
} = budgetSlice.actions
export default budgetSlice.reducer