import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { setLimit } from '../features/budget/budgetSlice'
import Styles from './Dashboard.module.css'

const currentMonth = () => new Date().toISOString().slice(0, 7)

const tooltipStyle = {
  contentStyle: {
    background: '#FFFDF8',
    border: '1px solid #1F1B16',
    borderRadius: 4,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 13,
  },
  labelStyle: { color: '#1F1B16', fontWeight: 600 },
}

export const Dashboard = () => {
  const allTransactions = useSelector((state) => state.budget.transactions)
  const limits = useSelector((state) => state.budget.limits)
  const categories = useSelector((state) => state.budget.categories)
  const dispatch = useDispatch()

  const [month, setMonth] = useState(currentMonth())
  const [showAll, setShowAll] = useState(false)

  const transactions = showAll
    ? allTransactions
    : allTransactions.filter((t) => t.date && t.date.startsWith(month))

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ]
  const pieColors = ['#1B4332', '#B33A3A']

  const categoryTotals = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })
  const barData = Object.entries(categoryTotals).map(([category, total]) => ({ category, total }))

  const handleSetLimit = (category, value) => {
    dispatch(setLimit({ category, limit: Number(value) }))
  }

  if (allTransactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.title}>Dashboard</h1>
        <p className={Styles.subtitle}>Your ledger at a glance</p>
        <div className={Styles.emptyState}>
          <p>No entries yet — the ledger is blank</p>
          <Link to="/add" className={Styles.emptyLink}>Add your first transaction</Link>
        </div>
      </div>
    )
  }

  const allExpenseCategories = {}
  allTransactions.filter((t) => t.type === 'expense' && t.date).forEach((t) => {
    const key = t.date.slice(0, 7)
    if (!allExpenseCategories[key]) allExpenseCategories[key] = {}
    allExpenseCategories[key][t.category] = (allExpenseCategories[key][t.category] || 0) + t.amount
  })

  const prevMonthKey = (() => {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })()
  const prevMonthCategories = allExpenseCategories[prevMonthKey] || {}

  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : null

  const overBudgetCategories = categories.filter((cat) => {
    const limit = limits[cat] || 0
    const spent = categoryTotals[cat] || 0
    return limit > 0 && spent > limit
  })

  const risingCategories = Object.entries(categoryTotals)
    .filter(([cat, total]) => {
      const prev = prevMonthCategories[cat] || 0
      return prev > 0 && total > prev * 1.2
    })
    .map(([cat]) => cat)

  let healthScore = 60
  if (savingsRate !== null) healthScore += Math.min(Math.max(savingsRate, -30), 30)
  healthScore -= overBudgetCategories.length * 10
  healthScore -= risingCategories.length * 5
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)))

  const feedback = []
  if (savingsRate !== null) {
    if (savingsRate >= 20) feedback.push({ tone: 'good', text: `You're saving ${savingsRate}% of your income this month — solid.` })
    else if (savingsRate >= 0) feedback.push({ tone: 'neutral', text: `You saved ${savingsRate}% of your income this month.` })
    else feedback.push({ tone: 'bad', text: `You spent more than you earned this month, by ${Math.abs(income - expenses)}.` })
  }
  overBudgetCategories.forEach((cat) => {
    feedback.push({ tone: 'bad', text: `${cat} is over its budget limit this month.` })
  })
  risingCategories.forEach((cat) => {
    feedback.push({ tone: 'warn', text: `${cat} spending is up noticeably from last month.` })
  })
  if (feedback.length === 0) {
    feedback.push({ tone: 'good', text: 'Nothing unusual this month — steady as it goes.' })
  }

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Dashboard</h1>
      <p className={Styles.subtitle}>Your ledger at a glance</p>

      <div className={Styles.monthBar}>
        <input
          className={Styles.monthInput}
          type="month"
          value={month}
          onChange={(e) => { setMonth(e.target.value); setShowAll(false) }}
          disabled={showAll}
        />
        <button
          type="button"
          className={`${Styles.allTimeBtn} ${showAll ? Styles.allTimeBtnActive : ''}`}
          onClick={() => setShowAll(!showAll)}
        >
          All Time
        </button>
      </div>

      {transactions.length > 0 && (
      <div className={Styles.healthCard}>
        <div className={Styles.healthScoreRow}>
          <div>
            <p className={Styles.healthLabel}>Financial Health Score</p>
            <p className={Styles.healthScore}>{healthScore}<span className={Styles.healthScoreMax}>/100</span></p>
          </div>
          <div className={Styles.healthBar}>
            <div className={Styles.healthBarFill} style={{ width: `${healthScore}%` }} />
          </div>
        </div>
        <ul className={Styles.feedbackList}>
          {feedback.map((f, i) => (
            <li key={i} className={`${Styles.feedbackItem} ${Styles[f.tone]}`}>{f.text}</li>
          ))}
        </ul>
      </div>
)}

      {transactions.length === 0 ? (
        <div className={Styles.emptyState}>
          <p>No entries for this month</p>
        </div>
      ) : (
        <>
          <div className={Styles.cards}>
            <div className={Styles.card}>
              <p className={Styles.label}>Income</p>
              <p className={`${Styles.value} ${Styles.income}`}>{income}</p>
            </div>
            <div className={Styles.card}>
              <p className={Styles.label}>Expenses</p>
              <p className={`${Styles.value} ${Styles.expense}`}>{expenses}</p>
            </div>
            <div className={Styles.card}>
              <p className={Styles.label}>Balance</p>
              <p className={Styles.value}>{balance}</p>
            </div>
          </div>

          <h2 className={Styles.sectionTitle}>Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index]} stroke="#F7F3EA" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          {barData.length > 0 && (
            <>
              <h2 className={Styles.sectionTitle}>Spending by Category</h2>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" stroke="#837C6D" fontSize={12} />
                  <YAxis stroke="#837C6D" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="total" fill="#1B4332" radius={[3, 3, 0, 0]} background={false} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </>
      )}

      <h2 className={Styles.sectionTitle}>Budget Limits</h2>
      <div className={Styles.limitsList}>
        {categories.map((cat) => {
          const spent = categoryTotals[cat] || 0
          const limit = limits[cat] || 0
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
          const over = limit > 0 && spent > limit

          return (
            <div key={cat} className={Styles.limitRow}>
              <div className={Styles.limitHeader}>
                <span>{cat}</span>
                <input
                  className={Styles.limitInput}
                  type="number"
                  placeholder="limit"
                  value={limits[cat] || ''}
                  onChange={(e) => handleSetLimit(cat, e.target.value)}
                />
              </div>
              {limit > 0 && (
                <>
                  <div className={Styles.progressTrack}>
                    <div
                      className={Styles.progressFill}
                      style={{
                        width: `${percent}%`,
                        background: over ? 'var(--expense)' : 'var(--income)',
                      }}
                    />
                  </div>
                  <span className={Styles.limitText}>
                    {spent} / {limit} {over && '— over budget'}
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}