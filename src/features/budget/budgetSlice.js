import { createSlice } from '@reduxjs/toolkit'

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

const initialState = {
  transactions: loadTransactions(),
  limits: loadLimits(),
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
  },
})

export const { addTransaction, deleteTransaction, updateTransaction, setLimit } = budgetSlice.actions
export default budgetSlice.reducer