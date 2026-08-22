import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CountUp } from '../components/CountUp'
import Styles from './Dashboard.module.css'

const currentMonth = () => new Date().toISOString().slice(0, 7)
const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()
}

const donutColors = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#6b7280']

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

const categoryIcons = {
  Food: 'restaurant',
  Transport: 'directions_car',
  Rent: 'home',
  Utilities: 'bolt',
  Entertainment: 'movie',
  Shopping: 'shopping_bag',
  Salary: 'work',
  Other: 'category',
}

export const Dashboard = () => {
  const allTransactions = useSelector((state) => state.budget.transactions)
  const limits = useSelector((state) => state.budget.limits)
  const [month] = useState(currentMonth())

  const transactions = allTransactions.filter((t) => t.date && t.date.startsWith(month))

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = allTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0

  const categoryTotals = {}
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  })
  const donutData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  // categories that actually have a limit set
  const limitedCategories = Object.keys(limits).filter((cat) => limits[cat] > 0)
  const budgetRows = limitedCategories.map((cat) => ({
    category: cat,
    spent: categoryTotals[cat] || 0,
    limit: limits[cat],
  }))
  const overBudget = budgetRows.filter((row) => row.spent > row.limit)
  const closeToLimit = budgetRows.filter((row) => row.spent <= row.limit && row.spent / row.limit >= 0.8)

  // build a real insight from actual data, not just a generic savings-rate line
  let insightText
  if (overBudget.length > 0) {
    const names = overBudget.map((r) => r.category).join(', ')
    insightText = `You're over budget in ${overBudget.length === 1 ? 'category' : 'categories'}: ${names}. Consider adjusting your limits or spending less there for the rest of the month.`
  } else if (closeToLimit.length > 0) {
    const names = closeToLimit.map((r) => r.category).join(', ')
    insightText = `${names} ${closeToLimit.length === 1 ? 'is' : 'are'} close to its limit this month — worth keeping an eye on.`
  } else if (budgetRows.length === 0) {
    insightText = `You haven't set any budget limits yet. Set one in Settings to get real tracking here.`
  } else if (savingsRate >= 20) {
    insightText = `You're saving ${savingsRate}% of your income this month and staying within every budget you've set — solid.`
  } else {
    insightText = `You're within all your set budgets this month. Savings rate: ${savingsRate}%.`
  }

  if (allTransactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.headline}>Financial <span className={Styles.gradientText}>Command Center</span></h1>
        <div className={Styles.emptyState}>
          <p>No data yet — add a transaction to activate your dashboard.</p>
          <Link to="/add" className={Styles.emptyLink}>Add your first transaction</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.headerRow}>
        <div>
          <span className={Styles.eyebrow}>{monthLabel(month)} OVERVIEW</span>
          <h1 className={Styles.headline}>Financial <span className={Styles.gradientText}>Command Center</span></h1>
        </div>
        <div className={Styles.headerActions}>
          <button className={Styles.bellBtn} aria-label="Notifications">
            <span className="icon">notifications</span>
          </button>
          <Link to="/add" className={Styles.newTxBtn}>
            <span className="icon">add</span>
            New Transaction
          </Link>
        </div>
      </div>

      <div className={Styles.grid}>
        <div className={Styles.mainCol}>
          <div className={Styles.netWorthCard}>
            <div className={Styles.cardTopRow}>
              <span className={Styles.cardLabel}>Total Net Worth</span>
              <span className={`${Styles.trendPill} ${savingsRate >= 0 ? Styles.trendUp : Styles.trendDown}`}>
                <span className="icon">{savingsRate >= 0 ? 'trending_up' : 'trending_down'}</span>
                {savingsRate}%
              </span>
            </div>
            <p className={`${Styles.netWorthValue} num`}>
              $<CountUp value={balance} />
            </p>

            <div className={Styles.statRow}>
              <div className={Styles.statBlock}>
                <span className={`icon ${Styles.statIcon} ${Styles.statIconIncome}`}>south</span>
                <div>
                  <span className={Styles.statLabel}>Income</span>
                  <p className={`${Styles.statValue} num`}>${income}</p>
                </div>
              </div>
              <div className={Styles.statBlock}>
                <span className={`icon ${Styles.statIcon} ${Styles.statIconExpense}`}>north</span>
                <div>
                  <span className={Styles.statLabel}>Expenses</span>
                  <p className={`${Styles.statValue} num`}>${expenses}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.activityCard}>
            <div className={Styles.cardTopRow}>
              <span className={Styles.cardLabel}>Recent Activity</span>
              <Link to="/transactions" className={Styles.seeAll}>See All</Link>
            </div>
            {recent.length === 0 ? (
              <p className={Styles.mutedText}>No transactions this month.</p>
            ) : (
              <ul className={Styles.txList}>
                {recent.map((t, i) => (
                  <li key={t.id} className={`${Styles.txRow} staggerItem`} style={{ animationDelay: `${i * 0.07}s` }}>
                    <span className={Styles.txIcon}>
                      <span className="icon">{t.type === 'income' ? 'work' : (categoryIcons[t.category] || 'shopping_bag')}</span>
                    </span>
                    <div className={Styles.txInfo}>
                      <span className={Styles.txTitle}>{t.title}</span>
                      <span className={Styles.txMeta}>{t.category} · {t.date}</span>
                    </div>
                    <span className={`${Styles.txAmount} num ${t.type === 'income' ? Styles.income : ''}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {budgetRows.length > 0 && (
            <div className={Styles.activityCard}>
              <div className={Styles.cardTopRow}>
                <span className={Styles.cardLabel}>Budget Health</span>
                <Link to="/settings" className={Styles.seeAll}>Manage limits</Link>
              </div>
              <ul className={Styles.budgetList}>
                {budgetRows.map((row) => {
                  const percent = Math.min((row.spent / row.limit) * 100, 100)
                  const over = row.spent > row.limit
                  return (
                    <li key={row.category} className={Styles.budgetRow}>
                      <div className={Styles.budgetLabelRow}>
                        <span>{row.category}</span>
                        <span className={`num ${Styles.budgetAmounts}`}>${row.spent} / ${row.limit}</span>
                      </div>
                      <div className={Styles.progressTrack}>
                        <div
                          className={Styles.progressFill}
                          style={{ width: `${percent}%`, background: over ? 'var(--danger)' : 'var(--gradient-brand)' }}
                        />
                      </div>
                      {over && <span className={Styles.overLabel}>over budget</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className={Styles.sideCol}>
          <div className={Styles.donutCard}>
            <span className={Styles.cardLabel}>Outflow Analysis</span>
            {donutData.length === 0 ? (
              <p className={Styles.mutedText}>No expenses this month.</p>
            ) : (
              <>
                <div className={Styles.donutWrap}>
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        innerRadius={78}
                        outerRadius={104}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {donutData.map((entry, i) => (
                          <Cell key={entry.name} fill={donutColors[i % donutColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={Styles.donutCenter}>
                    <span className={Styles.donutCenterLabel}>Total</span>
                    <span className={`${Styles.donutCenterValue} num`}>${expenses}</span>
                  </div>
                </div>
                <div className={Styles.legendRow}>
                  {donutData.map((entry, i) => (
                    <span key={entry.name} className={Styles.legendChip}>
                      <span className={Styles.legendDot} style={{ background: donutColors[i % donutColors.length] }} />
                      {entry.name} <strong>{Math.round((entry.value / expenses) * 100)}%</strong>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={Styles.insightsCard}>
            <span className={Styles.insightsLabel}>
              <span className="icon">auto_awesome</span>
              AI Insights
            </span>
            <p className={Styles.insightsText}>{insightText}</p>
           <Link
            to={`/settings?highlight=${overBudget.map((r) => r.category).join(',')}#budget-limits`}
            className={Styles.reviewBtn}
          >
            Review Limits
          </Link>
          </div>
        </div>
      </div>
    </div>
  )
}