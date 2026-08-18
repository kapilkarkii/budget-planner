import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteTransaction } from '../features/budget/budgetSlice'
import Styles from './Transactions.module.css'

export const Transactions = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  const categories = useSelector((state) => state.budget.categories)
  const dispatch = useDispatch()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1 className={Styles.title}>Transactions</h1>
        <p className={Styles.subtitle}>Every entry, in order</p>
        <div className={Styles.emptyState}>
          <p>The ledger is empty</p>
          <Link to="/add" className={Styles.emptyLink}>Add your first transaction</Link>
        </div>
      </div>
    )
  }

  const filtered = transactions.filter((t) => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter
    const matchesType = typeFilter === 'all' || t.type === typeFilter
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
    if (sortBy === 'amountHigh') return b.amount - a.amount
    if (sortBy === 'amountLow') return a.amount - b.amount
    if (sortBy === 'titleAZ') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Transactions</h1>
      <p className={Styles.subtitle}>Every entry, in order</p>

      <input
        className={Styles.searchInput}
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={Styles.filters}>
        <select className={Styles.input} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className={Styles.input} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select className={Styles.input} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amountHigh">Amount: High to Low</option>
          <option value="amountLow">Amount: Low to High</option>
          <option value="titleAZ">Title: A-Z</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className={Styles.emptyState}>
          <p>No entries match your search or filters</p>
        </div>
      ) : (
        <div className={Styles.receipt}>
          <ul className={Styles.list}>
            {sorted.map((t) => (
              <li key={t.id} className={Styles.item}>
                <span className={Styles.itemTitle}>{t.title}</span>
                <span className={Styles.leader}></span>
                <span className={`${Styles.amount} ${Styles[t.type]}`}>
                  {t.type === 'expense' ? '-' : '+'}{t.amount}
                </span>
                <span className={Styles.meta}>
                  <span className={Styles.category}>{t.category}</span>
                  <span className={Styles.date}>{t.date}</span>
                </span>
                <span className={Styles.actions}>
                  <Link to={`/edit/${t.id}`} className={Styles.editBtn}>edit</Link>
                  <button className={Styles.deleteBtn} onClick={() => dispatch(deleteTransaction(t.id))}>delete</button>
                </span>
              </li>
            ))}
          </ul>
          <div className="tornEdge"></div>
        </div>
      )}
    </div>
  )
}