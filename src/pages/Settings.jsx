import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCategory, deleteCategory } from '../features/budget/budgetSlice'
import Styles from './Settings.module.css'

export const Settings = () => {
  const categories = useSelector((state) => state.budget.categories)
  const transactions = useSelector((state) => state.budget.transactions)
  const dispatch = useDispatch()

  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')
  const [confirmCat, setConfirmCat] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    const name = newCategory.trim()

    if (!name) {
      setError('Category name cannot be empty')
      return
    }
    if (categories.includes(name)) {
      setError('That category already exists')
      return
    }

    dispatch(addCategory(name))
    setNewCategory('')
    setError('')
  }

  const countInUse = (cat) => transactions.filter((t) => t.category === cat).length

  const handleDelete = (cat) => {
    if (confirmCat === cat) {
      dispatch(deleteCategory(cat))
      setConfirmCat(null)
    } else {
      setConfirmCat(cat)
    }
  }

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.pageTitle}>Settings</h1>
      <p className={Styles.pageSubtitle}>Manage your categories.</p>

      <form className={Styles.addCard} onSubmit={handleAdd}>
        <input
          className={Styles.input}
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => { setNewCategory(e.target.value); setError('') }}
        />
        <button className={Styles.addBtn} type="submit">
          <span className="icon">add</span>
          Add
        </button>
      </form>
      {error && <span className={Styles.error}>{error}</span>}

      <div className={Styles.card}>
        <h2 className={Styles.cardTitle}>Categories</h2>
        <ul className={Styles.list}>
          {categories.map((cat) => {
            const used = countInUse(cat)
            const confirming = confirmCat === cat
            return (
              <li key={cat} className={Styles.item}>
                <span className={Styles.itemName}>{cat}</span>
                <span className={Styles.itemUsage}>
                  {used > 0 ? `${used} transaction${used > 1 ? 's' : ''}` : 'unused'}
                </span>
                <button
                  className={`${Styles.deleteBtn} ${confirming ? Styles.confirmDelete : ''}`}
                  onClick={() => handleDelete(cat)}
                >
                  {confirming ? 'Confirm remove' : 'Remove'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <p className={Styles.note}>
        Removing a category won't change past transactions — they'll keep their original category label.
      </p>
    </div>
  )
}