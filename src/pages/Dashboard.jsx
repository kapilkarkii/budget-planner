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