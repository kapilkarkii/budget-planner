import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../lib/budgetApi'

const loadCurrency = () => {
  try {
    return localStorage.getItem('currency') || 'USD'
  } catch {
    return 'USD'
  }
}

const initialState = {
  transactions: [],
  goals: [],
  limits: {},
  categories: [],
  currency: loadCurrency(),
  status: 'idle', // idle | loading | succeeded | failed
  userId: null,
}

export const fetchAllData = createAsyncThunk('budget/fetchAllData', async (userId) => {
  const [transactions, goals, limits, categories] = await Promise.all([
    api.fetchTransactions(userId),
    api.fetchGoals(userId),
    api.fetchLimits(userId),
    api.fetchCategories(userId),
  ])
  return { transactions, goals, limits, categories }
})

export const addTransaction = createAsyncThunk('budget/addTransaction', async (transaction, { getState }) => {
  const { userId } = getState().budget
  return api.insertTransaction(userId, transaction)
})

export const updateTransaction = createAsyncThunk('budget/updateTransaction', async (transaction) => {
  return api.updateTransactionRow(transaction)
})

export const deleteTransaction = createAsyncThunk('budget/deleteTransaction', async (id) => {
  return api.deleteTransactionRow(id)
})

export const addGoal = createAsyncThunk('budget/addGoal', async ({ name, target }, { getState }) => {
  const { userId } = getState().budget
  return api.insertGoal(userId, name, target)
})

export const deleteGoal = createAsyncThunk('budget/deleteGoal', async (id) => {
  return api.deleteGoalRow(id)
})

export const contributeToGoal = createAsyncThunk('budget/contributeToGoal', async ({ id, amount }, { getState }) => {
  const goal = getState().budget.goals.find((g) => g.id === id)
  const newSaved = goal.saved + amount
  return api.updateGoalSaved(id, newSaved)
})

export const withdrawFromGoal = createAsyncThunk('budget/withdrawFromGoal', async ({ id, amount }, { getState }) => {
  const goal = getState().budget.goals.find((g) => g.id === id)
  const newSaved = Math.max(0, goal.saved - amount)
  return api.updateGoalSaved(id, newSaved)
})

export const setLimit = createAsyncThunk('budget/setLimit', async ({ category, limit }, { getState }) => {
  const { userId } = getState().budget
  return api.upsertLimit(userId, category, limit)
})

export const addCategory = createAsyncThunk('budget/addCategory', async (name, { getState }) => {
  const { userId } = getState().budget
  await api.insertCategory(userId, name)
  return name
})

export const deleteCategory = createAsyncThunk('budget/deleteCategory', async (name, { getState }) => {
  const { userId } = getState().budget
  return api.deleteCategoryRow(userId, name)
})

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    setCurrency: (state, action) => {
      state.currency = action.payload
      localStorage.setItem('currency', action.payload)
    },
    resetBudgetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => { state.status = 'loading' })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.transactions = action.payload.transactions
        state.goals = action.payload.goals
        state.limits = action.payload.limits
        state.categories = action.payload.categories
      })
      .addCase(fetchAllData.rejected, (state) => { state.status = 'failed' })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const i = state.transactions.findIndex((t) => t.id === action.payload.id)
        if (i !== -1) state.transactions[i] = action.payload
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload)
      })

      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload)
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload)
      })
      .addCase(contributeToGoal.fulfilled, (state, action) => {
        const i = state.goals.findIndex((g) => g.id === action.payload.id)
        if (i !== -1) state.goals[i] = action.payload
      })
      .addCase(withdrawFromGoal.fulfilled, (state, action) => {
        const i = state.goals.findIndex((g) => g.id === action.payload.id)
        if (i !== -1) state.goals[i] = action.payload
      })

      .addCase(setLimit.fulfilled, (state, action) => {
        state.limits[action.payload.category] = action.payload.limit
      })

      .addCase(addCategory.fulfilled, (state, action) => {
        if (!state.categories.includes(action.payload)) {
          state.categories.push(action.payload)
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c !== action.payload)
      })
  },
})

export const { setUserId, setCurrency, resetBudgetState } = budgetSlice.actions
export default budgetSlice.reducer