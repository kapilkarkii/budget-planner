import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteTransaction } from '../features/budget/budgetSlice'
import { CATEGORIES } from '../constants/categories'
import Styles from './Transactions.module.css'

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

export const Transactions = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  const dispatch = useDispatch()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [confirmId, setConfirmId] = useState(null)

  const handleDelete = (id) => {
    if (confirmId === id) {
      dispatch(deleteTransaction(id))
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <div className={Styles.headerRow}>
          <div>
            <h1 className={Styles.pageTitle}>Transactions</h1>
            <p className={Styles.pageSubtitle}>
              Review and manage your recent activity.
            </p>
          </div>
        </div>

        <div className={Styles.emptyState}>
          <p>No transactions yet</p>

          <Link to="/add" className={Styles.emptyLink}>
            Add your first transaction
          </Link>
        </div>
      </div>
    )
  }

  const filtered = transactions.filter((t) => {
    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter

    const matchesType =
      typeFilter === 'all' || t.type === typeFilter

    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesType && matchesSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date)
    }

    if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date)
    }

    if (sortBy === 'amountHigh') {
      return b.amount - a.amount
    }

    if (sortBy === 'amountLow') {
      return a.amount - b.amount
    }

    return 0
  })

  return (
    <div className={Styles.wrapper}>

      {/* Header */}
      <div className={Styles.headerRow}>
        <div>
          <h1 className={Styles.pageTitle}>Transactions</h1>

          <p className={Styles.pageSubtitle}>
            Review and manage your recent activity.
          </p>
        </div>

        <Link to="/add" className={Styles.addBtn}>
          <span className="icon">add</span>
          Add Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className={Styles.filterBar}>

        {/* Search */}
        <div className={Styles.searchBox}>
          <span className={`icon ${Styles.searchIcon}`}>
            search
          </span>

          <input
            className={Styles.searchInput}
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <select
          className={Styles.select}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)

            // Reset category when changing type
            setCategoryFilter('all')
          }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          className={Styles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>

          {CATEGORIES
            .filter(
              (cat) =>
                typeFilter === 'all' ||
                cat.type === typeFilter
            )
            .map((cat) => (
              <option
                key={cat.name}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
        </select>

        {/* Sort */}
        <select
          className={Styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amountHigh">
            Amount: High to Low
          </option>
          <option value="amountLow">
            Amount: Low to High
          </option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className={Styles.tableCard}>

        {sorted.length === 0 ? (
          <div className={Styles.emptyState}>
            <p>
              No transactions match your search or filters
            </p>
          </div>
        ) : (
          <table className={Styles.table}>

            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className={Styles.amountCol}>
                  Amount
                </th>
                <th className={Styles.actionCol}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((t) => (
                <tr key={t.id}>

                  {/* Date */}
                  <td className={Styles.dateCell}>
                    {t.date}
                  </td>

                  {/* Description */}
                  <td className={Styles.descCell}>
                    {t.title}
                  </td>

                  {/* Category */}
                  <td>
                    <span className={Styles.categoryTag}>

                      <span
                        className={`icon ${Styles.categoryIcon}`}
                      >
                        {categoryIcons[t.category] || 'category'}
                      </span>

                      {t.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`
                      ${Styles.amountCol}
                      num
                      ${
                        t.type === 'income'
                          ? Styles.income
                          : Styles.expense
                      }
                    `}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {t.amount}
                  </td>

                  {/* Actions */}
                  <td className={Styles.actionCol}>
                    <div className={Styles.actions}>

                      {/* Edit */}
                      <Link
                        to={`/edit/${t.id}`}
                        className={Styles.iconBtn}
                        aria-label={`Edit ${t.title}`}
                      >
                        <span className="icon">
                          edit
                        </span>
                      </Link>

                      {/* Delete */}
                      <button
                        className={`
                          ${Styles.iconBtn}
                          ${
                            confirmId === t.id
                              ? Styles.confirmDelete
                              : ''
                          }
                        `}
                        onClick={() => handleDelete(t.id)}
                        aria-label={
                          confirmId === t.id
                            ? `Confirm delete ${t.title}`
                            : `Delete ${t.title}`
                        }
                      >
                        <span className="icon">
                          {confirmId === t.id
                            ? 'check'
                            : 'delete'}
                        </span>
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  )
}