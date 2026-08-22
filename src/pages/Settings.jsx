import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCategory, deleteCategory, setLimit } from '../features/budget/budgetSlice'
import Styles from './Settings.module.css'

export const Settings = () => {
  const categories = useSelector((state) => state.budget.categories)
  const transactions = useSelector((state) => state.budget.transactions)
  const limits = useSelector((state) => state.budget.limits)
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

  const handleSetLimit = (category, value) => {
    dispatch(setLimit({ category, limit: Number(value) }))
  }

  return (
    <div className={Styles.wrapper}>
      <span className={Styles.eyebrow}>PREFERENCES</span>
      <h1 className={Styles.headline}>Manage <span className={Styles.gradientText}>Categories</span></h1>

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
        <span className={Styles.sectionLabel}>Categories</span>
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

      <h2 className={Styles.subHeadline}>Budget <span className={Styles.gradientText}>Limits</span></h2>
      <p className={Styles.subNote}>
        Set a monthly spending limit per category — these show up as "over budget" flags on your Dashboard.
      </p>
      <div className={Styles.card}>
        <ul className={Styles.limitList}>
          {categories.map((cat) => (
            <li key={cat} className={Styles.limitItem}>
              <span className={Styles.itemName}>{cat}</span>
              <div className={Styles.limitInputWrap}>
                <span className={Styles.limitPrefix}>$</span>
                <input
                  className={Styles.limitInput}
                  type="number"
                  placeholder="No limit"
                  value={limits[cat] || ''}
                  onChange={(e) => handleSetLimit(cat, e.target.value)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}