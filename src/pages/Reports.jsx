import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import Styles from './Reports.module.css'

const tooltipStyle = {
  contentStyle: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    boxShadow: '0px 10px 30px rgba(15,23,42,0.12)',
  },
}

const lineColors = ['#131b2e', '#006c49', '#f59e0b', '#76777d', '#ba1a1a']

export const Reports = () => {
  const transactions = useSelector((state) => state.budget.transactions)

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.pageTitle}>Reports</h1>
        <p className={Styles.pageSubtitle}>Patterns and trends over time.</p>
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
        <h1 className={Styles.pageTitle}>Reports</h1>
        <p className={Styles.pageSubtitle}>Patterns and trends over time.</p>
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
      <h1 className={Styles.pageTitle}>Reports</h1>
      <p className={Styles.pageSubtitle}>Patterns and trends over time.</p>

      <div className={Styles.card}>
        <h2 className={Styles.cardTitle}>This Month vs Last Month</h2>
        {lastMonth ? (
          <div className={Styles.compareRow}>
            <div className={Styles.compareCol}>
              <p className={Styles.compareLabel}>Expenses</p>
              <p className={`${Styles.compareValue} num`}>{thisMonth.expenses}</p>
              {expenseChange !== null && (
                <span className={expenseChange > 0 ? Styles.up : Styles.down}>
                  <span className="icon">{expenseChange > 0 ? 'trending_up' : 'trending_down'}</span>
                  {Math.abs(expenseChange)}% vs last month
                </span>
              )}
            </div>
            <div className={Styles.compareCol}>
              <p className={Styles.compareLabel}>Income</p>
              <p className={`${Styles.compareValue} num`}>{thisMonth.income}</p>
              {incomeChange !== null && (
                <span className={incomeChange >= 0 ? Styles.down : Styles.up}>
                  <span className="icon">{incomeChange > 0 ? 'trending_up' : 'trending_down'}</span>
                  {Math.abs(incomeChange)}% vs last month
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className={Styles.mutedText}>Add data across at least two months to see a comparison.</p>
        )}
      </div>

      <div className={Styles.card}>
        <h2 className={Styles.cardTitle}>Savings Rate</h2>
        <p className={Styles.mutedText}>The share of income you kept each month, after expenses.</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={savingsRateData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#76777d" fontSize={12} />
            <YAxis stroke="#76777d" fontSize={12} unit="%" />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="rate" stroke="#006c49" strokeWidth={2} dot={{ r: 3 }} name="Savings rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {topCategories.length > 0 && (
        <div className={Styles.card}>
          <h2 className={Styles.cardTitle}>Top Categories Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={categoryTrendData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#76777d" fontSize={12} />
              <YAxis stroke="#76777d" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
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
        <h2 className={Styles.cardTitle}>Biggest Expenses</h2>
        <ul className={Styles.rankList}>
          {biggest.map((t, i) => (
            <li key={t.id} className={Styles.rankItem}>
              <span className={Styles.rankNum}>{i + 1}</span>
              <div className={Styles.rankInfo}>
                <span className={Styles.rankTitle}>{t.title}</span>
                <span className={Styles.rankMeta}>{t.category}</span>
              </div>
              <span className={`${Styles.rankAmount} num`}>{t.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}