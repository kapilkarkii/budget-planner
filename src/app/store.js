import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from '../features/budget/budgetSlice'

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
  },
})

store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem('transactions', JSON.stringify(state.budget.transactions))
})