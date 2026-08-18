import { useSelector } from 'react-redux'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Styles from './Dashboard.module.css'

export const Dashboard = () => {
  const transactions = useSelector((state) => state.budget.transactions)

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

      {transactions.length > 0 && (
        <>
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
        </>
      )}
    </div>
  )
}