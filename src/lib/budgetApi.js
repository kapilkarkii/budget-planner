import { supabase } from './supabaseClient'

// Transactions
export const fetchTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data.map((t) => ({ ...t, amount: Number(t.amount) }))
}

export const insertTransaction = async (userId, transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...transaction, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return { ...data, amount: Number(data.amount) }
}

export const updateTransactionRow = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', transaction.id)
    .select()
    .single()
  if (error) throw error
  return { ...data, amount: Number(data.amount) }
}

export const deleteTransactionRow = async (id) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
  return id
}

// Goals
export const fetchGoals = async (userId) => {
  const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId)
  if (error) throw error
  return data.map((g) => ({ ...g, target: Number(g.target), saved: Number(g.saved) }))
}

export const insertGoal = async (userId, name, target) => {
  const { data, error } = await supabase
    .from('goals')
    .insert({ user_id: userId, name, target, saved: 0 })
    .select()
    .single()
  if (error) throw error
  return { ...data, target: Number(data.target), saved: Number(data.saved) }
}

export const deleteGoalRow = async (id) => {
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) throw error
  return id
}

export const updateGoalSaved = async (id, newSaved) => {
  const { data, error } = await supabase
    .from('goals')
    .update({ saved: newSaved })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return { ...data, target: Number(data.target), saved: Number(data.saved) }
}

// Budget limits
export const fetchLimits = async (userId) => {
  const { data, error } = await supabase.from('budget_limits').select('*').eq('user_id', userId)
  if (error) throw error
  const limitsObj = {}
  data.forEach((row) => { limitsObj[row.category] = Number(row.limit_amount) })
  return limitsObj
}

export const upsertLimit = async (userId, category, limit) => {
  const { error } = await supabase
    .from('budget_limits')
    .upsert({ user_id: userId, category, limit_amount: limit }, { onConflict: 'user_id,category' })
  if (error) throw error
  return { category, limit }
}

// Categories
const DEFAULT_CATEGORY_NAMES = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping',
  'Other Expense', 'Salary', 'Freelance', 'Gift', 'Other Income',
]

export const fetchCategories = async (userId) => {
  const { data, error } = await supabase.from('categories').select('*').eq('user_id', userId)
  if (error) throw error
  if (data.length === 0) {
    // seed defaults for a brand-new user
    const seeded = await Promise.all(
      DEFAULT_CATEGORY_NAMES.map((name) => insertCategory(userId, name))
    )
    return seeded.map((c) => c.name)
  }
  return data.map((c) => c.name)
}

export const insertCategory = async (userId, name) => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, name })
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteCategoryRow = async (userId, name) => {
  const { error } = await supabase.from('categories').delete().eq('user_id', userId).eq('name', name)
  if (error) throw error
  return name
}