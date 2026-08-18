import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  transactions: [],
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
  },
})

export const { addTransaction, deleteTransaction } = budgetSlice.actions
export default budgetSlice.reducer