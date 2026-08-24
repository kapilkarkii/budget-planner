import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteTransaction } from '../features/budget/budgetSlice'
import { CATEGORIES } from '../constants/categories'
import { getCurrencySymbol } from '../utils/currency'
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
  const currency = useSelector((state) => state.budget.currency)
  const sym = getCurrencySymbol(currency)
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
            <span className={Styles.eyebrow}>ACTIVITY</span>
            <h1 className={Styles.headline}>All <span className={Styles.gradientText}>Transactions</span></h1>
          </div>
        </div>
        <div className={Styles.emptyState}>
          <p>No transactions yet</p>
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
    return 0
  })

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.headerRow}>
        <div>
          <span className={Styles.eyebrow}>ACTIVITY</span>
          <h1 className={Styles.headline}>All <span className={Styles.gradientText}>Transactions</span></h1>
        </div>
        <Link to="/add" className={Styles.addBtn}>
          <span className="icon">add</span>
          New Transaction
        </Link>
      </div>

      <div className={Styles.filterBar}>
        <div className={Styles.searchBox}>
          <span className={`icon ${Styles.searchIcon}`}>search</span>
          <input
            className={Styles.searchInput}
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={Styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={Styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select className={Styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amountHigh">Amount: High to Low</option>
          <option value="amountLow">Amount: Low to High</option>
        </select>
      </div>

      <div className={Styles.card}>
        {sorted.length === 0 ? (
          <div className={Styles.emptyState}>
            <p>No transactions match your search or filters</p>
          </div>
        ) : (
          <ul className={Styles.txList}>
            {sorted.map((t, i) => (
              <li key={t.id} className={`${Styles.txRow} staggerItem`} style={{ animationDelay: `${i * 0.04}s` }}>
                <span className={Styles.txIcon}>
                  <span className="icon">{t.type === 'income' ? 'work' : (categoryIcons[t.category] || 'shopping_bag')}</span>
                </span>
                <div className={Styles.txInfo}>
                  <span className={Styles.txTitle}>{t.title}</span>
                  <span className={Styles.txMeta}>{t.category} · {t.date}</span>
                </div>
                <span className={`${Styles.txAmount} num ${t.type === 'income' ? Styles.income : ''}`}>
                  {t.type === 'income' ? '+' : '-'}{sym}{t.amount}
                </span>
                <div className={Styles.actions}>
                  <Link to={`/edit/${t.id}`} className={Styles.iconBtn} aria-label={`Edit ${t.title}`}>
                    <span className="icon">edit</span>
                  </Link>
                  <button
                    className={`${Styles.iconBtn} ${confirmId === t.id ? Styles.confirmDelete : ''}`}
                    onClick={() => handleDelete(t.id)}
                    aria-label={confirmId === t.id ? `Confirm delete ${t.title}` : `Delete ${t.title}`}
                  >
                    <span className="icon">{confirmId === t.id ? 'check' : 'delete'}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}