import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Styles from './Dashboard.module.css'

const currentMonth = () => new Date().toISOString().slice(0, 7)

const monthLabel = (key) => {
  const [y, m] = key.split('-')

  return new Date(y, m - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

const donutColors = [
  '#131b2e',
  '#006c49',
  '#76777d',
  '#c6c6cd',
  '#f59e0b',
  '#ba1a1a',
]

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

export const Dashboard = () => {
  const allTransactions = useSelector(
    (state) => state.budget.transactions
  )

  const goals = useSelector(
    (state) => state.budget.goals
  )

  const [month, setMonth] = useState(currentMonth())

  // Transactions for selected month
  const transactions = allTransactions.filter(
    (t) => t.date && t.date.startsWith(month)
  )

  // Monthly income
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Monthly expenses
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Overall balance
  const balance = allTransactions.reduce(
    (sum, t) =>
      sum +
      (t.type === 'income'
        ? Number(t.amount)
        : -Number(t.amount)),
    0
  )

  // Calculate spending by category
  const categoryTotals = {}

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) +
        Number(t.amount)
    })

  // Data for donut chart
  const donutData = Object.entries(categoryTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  )

  // Recent transactions
  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 3)

  // No transactions state
  if (allTransactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.pageTitle}>
          Overview
        </h1>

        <div className={Styles.emptyState}>
          <p>
            No transactions yet — your financial
            summary will appear here.
          </p>

          <Link
            to="/add"
            className={Styles.emptyLink}
          >
            Add your first transaction
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={Styles.wrapper}>

      {/* Header */}
      <div className={Styles.headerRow}>
        <div>
          <h1 className={Styles.pageTitle}>
            Overview
          </h1>

          <p className={Styles.pageSubtitle}>
            Here's your financial summary for{' '}
            {monthLabel(month)}.
          </p>
        </div>

        <input
          className={Styles.monthInput}
          type="month"
          value={month}
          onChange={(e) =>
            setMonth(e.target.value)
          }
        />
      </div>

      {/* Summary Cards */}
      <div className={Styles.summaryRow}>

        {/* Balance */}
        <div
          className={`${Styles.summaryCard} ${Styles.balanceCard}`}
        >
          <div className={Styles.summaryTop}>
            <span className={Styles.summaryLabel}>
              Total Balance
            </span>

            <span
              className={`icon ${Styles.summaryIcon}`}
            >
              account_balance
            </span>
          </div>

          <p
            className={`${Styles.summaryValue} num`}
          >
            {balance}
          </p>
        </div>

        {/* Income */}
        <div
          className={`${Styles.summaryCard} ${Styles.incomeCard}`}
        >
          <div className={Styles.summaryTop}>
            <span className={Styles.summaryLabel}>
              Monthly Income
            </span>

            <span
              className={`icon ${Styles.summaryIcon}`}
            >
              south
            </span>
          </div>

          <p
            className={`${Styles.summaryValue} num`}
          >
            {income}
          </p>
        </div>

        {/* Expenses */}
        <div
          className={`${Styles.summaryCard} ${Styles.expenseCard}`}
        >
          <div className={Styles.summaryTop}>
            <span className={Styles.summaryLabel}>
              Monthly Expenses
            </span>

            <span
              className={`icon ${Styles.summaryIcon}`}
            >
              north
            </span>
          </div>

          <p
            className={`${Styles.summaryValue} num`}
          >
            {expenses}
          </p>
        </div>

      </div>

      {/* Main Grid */}
      <div className={Styles.grid}>

        {/* Left Column */}
        <div className={Styles.mainCol}>

          {/* Spending Breakdown */}
          <div className={Styles.card}>
            <h2 className={Styles.cardTitle}>
              Spending Breakdown
            </h2>

            {donutData.length === 0 ? (
              <p className={Styles.mutedText}>
                No expenses recorded this month.
              </p>
            ) : (
              <div className={Styles.donutRow}>

                <ResponsiveContainer
                  width={200}
                  height={200}
                >
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      innerRadius={68}
                      outerRadius={92}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {donutData.map(
                        (entry, i) => (
                          <Cell
                            key={entry.name}
                            fill={
                              donutColors[
                                i %
                                  donutColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      {...tooltipStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div
                  className={Styles.donutLegend}
                >
                  <p
                    className={
                      Styles.donutTotalLabel
                    }
                  >
                    Total Spent
                  </p>

                  <p
                    className={`${Styles.donutTotal} num`}
                  >
                    {expenses}
                  </p>

                  <ul
                    className={Styles.legendList}
                  >
                    {donutData.map(
                      (entry, i) => (
                        <li
                          key={entry.name}
                          className={
                            Styles.legendItem
                          }
                        >
                          <span
                            className={
                              Styles.legendDot
                            }
                            style={{
                              background:
                                donutColors[
                                  i %
                                    donutColors.length
                                ],
                            }}
                          />

                          {entry.name}

                          <span
                            className={
                              Styles.legendPct
                            }
                          >
                            {expenses > 0
                              ? Math.round(
                                  (entry.value /
                                    expenses) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className={Styles.card}>

            <div
              className={
                Styles.cardHeaderRow
              }
            >
              <h2
                className={Styles.cardTitle}
              >
                Recent Transactions
              </h2>

              <Link
                to="/transactions"
                className={Styles.viewAll}
              >
                View All
              </Link>
            </div>

            {recent.length === 0 ? (
              <p className={Styles.mutedText}>
                No transactions this month.
              </p>
            ) : (
              <ul className={Styles.txList}>
                {recent.map((t) => (
                  <li
                    key={t.id}
                    className={Styles.txRow}
                  >
                    <span
                      className={`icon ${Styles.txIcon}`}
                    >
                      {t.type === 'income'
                        ? 'work'
                        : 'shopping_cart'}
                    </span>

                    <div
                      className={Styles.txInfo}
                    >
                      <span
                        className={
                          Styles.txTitle
                        }
                      >
                        {t.title}
                      </span>

                      <span
                        className={
                          Styles.txMeta
                        }
                      >
                        {t.date} · {t.category}
                      </span>
                    </div>

                    <span
                      className={`
                        ${Styles.txAmount}
                        num
                        ${
                          t.type === 'income'
                            ? Styles.income
                            : Styles.expense
                        }
                      `}
                    >
                      {t.type === 'income'
                        ? '+'
                        : '-'}
                      {t.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className={Styles.sideCol}>

          {/* Savings Goals */}
          <div className={Styles.card}>

            <div
              className={
                Styles.cardHeaderRow
              }
            >
              <h2
                className={Styles.cardTitle}
              >
                Savings Goals
              </h2>

              <Link
                to="/goals"
                className={Styles.viewAll}
              >
                View All
              </Link>
            </div>

            {goals.length === 0 ? (
              <p className={Styles.mutedText}>
                No savings goals yet.
              </p>
            ) : (
              goals
                .slice(0, 2)
                .map((goal) => {
                  const target =
                    Number(goal.target) || 0

                  const saved =
                    Number(goal.saved) || 0

                  const percent =
                    target > 0
                      ? Math.min(
                          (saved / target) * 100,
                          100
                        )
                      : 0

                  return (
                    <div
                      key={goal.id}
                      className={
                        Styles.goalRow
                      }
                    >
                      <div
                        className={
                          Styles.budgetLabelRow
                        }
                      >
                        <span>
                          {goal.name}
                        </span>

                        <span
                          className={
                            Styles.goalPct
                          }
                        >
                          {Math.round(
                            percent
                          )}
                          %
                        </span>
                      </div>

                      <div
                        className={
                          Styles.progressTrack
                        }
                      >
                        <div
                          className={
                            Styles.progressFill
                          }
                          style={{
                            width: `${percent}%`,
                            background:
                              'var(--secondary)',
                          }}
                        />
                      </div>
                    </div>
                  )
                })
            )}
          </div>

        </div>
      </div>
    </div>
  )
}