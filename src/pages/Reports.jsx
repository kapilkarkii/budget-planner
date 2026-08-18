import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import Styles from './Reports.module.css'

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

export const Reports = () => {
  const transactions = useSelector((state) => state.budget.transactions)

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.title}>Reports</h1>
        <p className={Styles.subtitle}>Trends across every month</p>
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

  const trendData = Object.values(monthlyTotals).sort((a, b) => a.month.localeCompare(b.month))

  const totalIncome = trendData.reduce((sum, m) => sum + m.income, 0)
  const totalExpenses = trendData.reduce((sum, m) => sum + m.expenses, 0)
  const avgMonthlyExpense = trendData.length > 0 ? Math.round(totalExpenses / trendData.length) : 0

  const bestMonth = [...trendData].sort((a, b) => (b.income - b.expenses) - (a.income - a.expenses))[0]

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Reports</h1>
      <p className={Styles.subtitle}>Trends across every month</p>

      <div className={Styles.statsRow}>
        <div className={Styles.statCard}>
          <p className={Styles.statLabel}>Total Income</p>
          <p className={`${Styles.statValue} ${Styles.income}`}>{totalIncome}</p>
        </div>
        <div className={Styles.statCard}>
          <p className={Styles.statLabel}>Total Expenses</p>
          <p className={`${Styles.statValue} ${Styles.expense}`}>{totalExpenses}</p>
        </div>
        <div className={Styles.statCard}>
          <p className={Styles.statLabel}>Avg. Monthly Spend</p>
          <p className={Styles.statValue}>{avgMonthlyExpense}</p>
        </div>
      </div>

      {bestMonth && (
        <p className={Styles.highlight}>
          Best month: <strong>{bestMonth.month}</strong> with a net of{' '}
          <strong className={Styles.income}>{bestMonth.income - bestMonth.expenses}</strong>
        </p>
      )}

      <h2 className={Styles.sectionTitle}>Income vs Expenses Over Time</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={trendData}>
          <CartesianGrid stroke="#D8D2C4" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#837C6D" fontSize={12} />
          <YAxis stroke="#837C6D" fontSize={12} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="income" stroke="#1B4332" strokeWidth={2} dot={{ r: 3 }} name="Income" />
          <Line type="monotone" dataKey="expenses" stroke="#B33A3A" strokeWidth={2} dot={{ r: 3 }} name="Expenses" />
        </LineChart>
      </ResponsiveContainer>

      <h2 className={Styles.sectionTitle}>Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={trendData}>
          <XAxis dataKey="month" stroke="#837C6D" fontSize={12} />
          <YAxis stroke="#837C6D" fontSize={12} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="expenses" fill="#B33A3A" radius={[3, 3, 0, 0]} background={false} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className={Styles.sectionTitle}>By Month</h2>
      <div className={Styles.receipt}>
        <ul className={Styles.list}>
          {[...trendData].reverse().map((m) => (
            <li key={m.month} className={Styles.item}>
              <span className={Styles.itemTitle}>{m.month}</span>
              <span className={Styles.leader}></span>
              <span className={`${Styles.amount} ${Styles.income}`}>+{m.income}</span>
              <span className={`${Styles.amount} ${Styles.expense}`}>-{m.expenses}</span>
              <span className={Styles.amount}>{m.income - m.expenses}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}