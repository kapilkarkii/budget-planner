import { createSlice } from '@reduxjs/toolkit'

const loadTransactions = () => {
  try {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const initialState = {
  transactions: loadTransactions(),
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload)
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      )
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },
  },
})

export const { addTransaction, deleteTransaction, updateTransaction } = budgetSlice.actions
export default budgetSlice.reducer