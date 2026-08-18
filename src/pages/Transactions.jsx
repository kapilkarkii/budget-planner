import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteTransaction } from '../features/budget/budgetSlice'
import { CATEGORIES } from '../constants/categories'
import Styles from './Transactions.module.css'

export const Transactions = () => {
  const transactions = useSelector((state) => state.budget.transactions)
  const dispatch = useDispatch()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  if (transactions.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <h1>Transactions</h1>
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
    return matchesCategory && matchesType
  })

  return (
    <div className={Styles.wrapper}>
      <h1>Transactions</h1>

      <div className={Styles.filters}>
        <select className={Styles.input} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className={Styles.input} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={Styles.emptyState}>
          <p>No transactions match these filters</p>
        </div>
      ) : (
        <ul className={Styles.list}>
          {filtered.map((t) => (
            <li key={t.id} className={Styles.item}>
              <div className={Styles.info}>
                <span>{t.title}</span>
                <span className={Styles.category}>{t.category}</span>
              </div>
              <span className={`${Styles.amount} ${Styles[t.type]}`}>
                {t.type === 'expense' ? '-' : '+'}{t.amount}
              </span>
              <Link to={`/edit/${t.id}`} className={Styles.editBtn}>Edit</Link>
              <button className={Styles.deleteBtn} onClick={() => dispatch(deleteTransaction(t.id))}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}