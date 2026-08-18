import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { setLimit } from '../features/budget/budgetSlice'
import { CATEGORIES } from '../constants/categories'
import Styles from './Dashboard.module.css'

export const Dashboard = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  const limits = useSelector((state) => state.budget.limits)
  const dispatch = useDispatch()

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ]
  const pieColors = ['#22c55e', '#ef4444']

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

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.title}>Dashboard</h1>
        <div className={Styles.emptyState}>
          <p>No transactions yet — add one to see your totals here</p>
          <Link to="/add" className={Styles.emptyLink}>Add your first transaction</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Dashboard</h1>

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

      <h2 className={Styles.title}>Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
            {pieData.map((entry, index) => (
              <Cell key={entry.name} fill={pieColors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {barData.length > 0 && (
        <>
          <h2 className={Styles.title}>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="category" stroke="#9a9aab" />
              <YAxis stroke="#9a9aab" />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <h2 className={Styles.title}>Budget Limits</h2>
      <div className={Styles.limitsList}>
        {CATEGORIES.map((cat) => {
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
                  placeholder="Set limit"
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
                        background: over ? 'var(--expense)' : 'var(--primary)',
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