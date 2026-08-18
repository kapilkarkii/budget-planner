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

const loadGoals = () => {
  try {
    const saved = localStorage.getItem('goals')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const initialState = {
  transactions: loadTransactions(),
  limits: loadLimits(),
  categories: loadCategories(),
  goals: loadGoals(),
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
} = budgetSlice.actions
export default budgetSlice.reducer