import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getCurrencySymbol } from '../utils/currency'
import Styles from './Reports.module.css'

const tooltipStyle = {
  contentStyle: {
    background: '#191921',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#f5f5f7',
  },
}

const lineColors = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ef4444']

export const Reports = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  const currency = useSelector((state) => state.budget.currency)
  const sym = getCurrencySymbol(currency)

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <span className={Styles.eyebrow}>ANALYTICS</span>
        <h1 className={Styles.headline}>Spending <span className={Styles.gradientText}>Reports</span></h1>
        <div className={Styles.emptyState}>
          <p>Nothing to report on yet</p>
          <Link to="/add" className={Styles.emptyLink}>Add your first transaction</Link>
        </div>
      </div>
    )
  }

  const monthlyTotals = {}
  transactions.forEach((t) => {
    if (!t.date) return
    const month = t.date.slice(0, 7)
    if (!monthlyTotals[month]) monthlyTotals[month] = { month, income: 0, expenses: 0 }
    if (t.type === 'income') monthlyTotals[month].income += t.amount
    else monthlyTotals[month].expenses += t.amount
  })
  const months = Object.values(monthlyTotals).sort((a, b) => a.month.localeCompare(b.month))

  if (months.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <span className={Styles.eyebrow}>ANALYTICS</span>
        <h1 className={Styles.headline}>Spending <span className={Styles.gradientText}>Reports</span></h1>
        <div className={Styles.emptyState}>
          <p>Your transactions don't have dates yet, so trends can't be calculated.</p>
          <Link to="/transactions" className={Styles.emptyLink}>Edit transactions to add dates</Link>
        </div>
      </div>
    )
  }

  const thisMonth = months[months.length - 1]
  const lastMonth = months.length > 1 ? months[months.length - 2] : null

  const pctChange = (curr, prev) => {
    if (!prev || prev === 0) return null
    return Math.round(((curr - prev) / prev) * 100)
  }

  const expenseChange = lastMonth ? pctChange(thisMonth.expenses, lastMonth.expenses) : null
  const incomeChange = lastMonth ? pctChange(thisMonth.income, lastMonth.income) : null

  const savingsRateData = months.map((m) => ({
    month: m.month,
    rate: m.income > 0 ? Math.round(((m.income - m.expenses) / m.income) * 100) : 0,
  }))

  const categoryAllTime = {}
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    categoryAllTime[t.category] = (categoryAllTime[t.category] || 0) + t.amount
  })
  const topCategories = Object.entries(categoryAllTime)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat]) => cat)

  const categoryTrendData = months.map((m) => {
    const row = { month: m.month }
    topCategories.forEach((cat) => {
      row[cat] = transactions
        .filter((t) => t.type === 'expense' && t.category === cat && t.date && t.date.slice(0, 7) === m.month)
        .reduce((sum, t) => sum + t.amount, 0)
    })
    return row
  })

  const biggest = [...transactions]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  return (
    <div className={Styles.wrapper}>
      <span className={Styles.eyebrow}>ANALYTICS</span>
      <h1 className={Styles.headline}>Spending <span className={Styles.gradientText}>Reports</span></h1>

      <div className={Styles.card}>
        <span className={Styles.cardLabel}>This Month vs Last Month</span>
        {lastMonth ? (
          <div className={Styles.compareRow}>
            <div className={Styles.compareCol}>
              <span className={Styles.compareLabel}>Expenses</span>
              <p className={`${Styles.compareValue} num`}>{sym}{thisMonth.expenses}</p>
              {expenseChange !== null && (
                <span className={`${Styles.trendPill} ${expenseChange > 0 ? Styles.trendDown : Styles.trendUp}`}>
                  <span className="icon">{expenseChange > 0 ? 'trending_up' : 'trending_down'}</span>
                  {Math.abs(expenseChange)}%
                </span>
              )}
            </div>
            <div className={Styles.compareCol}>
              <span className={Styles.compareLabel}>Income</span>
              <p className={`${Styles.compareValue} num`}>{sym}{thisMonth.income}</p>
              {incomeChange !== null && (
                <span className={`${Styles.trendPill} ${incomeChange >= 0 ? Styles.trendUp : Styles.trendDown}`}>
                  <span className="icon">{incomeChange > 0 ? 'trending_up' : 'trending_down'}</span>
                  {Math.abs(incomeChange)}%
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className={Styles.mutedText}>Add data across at least two months to see a comparison.</p>
        )}
      </div>

      <div className={Styles.card}>
        <span className={Styles.cardLabel}>Savings Rate</span>
        <p className={Styles.mutedText}>The share of income you kept each month, after expenses.</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={savingsRateData}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} unit="%" />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} name="Savings rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {topCategories.length > 0 && (
        <div className={Styles.card}>
          <span className={Styles.cardLabel}>Top Categories Over Time</span>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={categoryTrendData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9199a8' }} />
              {topCategories.map((cat, i) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={Styles.card}>
        <span className={Styles.cardLabel}>Biggest Expenses</span>
        <ul className={Styles.rankList}>
          {biggest.map((t, i) => (
            <li key={t.id} className={Styles.rankItem}>
              <span className={Styles.rankNum}>{i + 1}</span>
              <div className={Styles.rankInfo}>
                <span className={Styles.rankTitle}>{t.title}</span>
                <span className={Styles.rankMeta}>{t.category}</span>
              </div>
              <span className={`${Styles.rankAmount} num`}>{sym}{t.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}