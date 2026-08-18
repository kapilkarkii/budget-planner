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

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Settings</h1>
      <p className={Styles.subtitle}>Manage your categories</p>

      <form className={Styles.addForm} onSubmit={handleAdd}>
        <input
          className={Styles.input}
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => { setNewCategory(e.target.value); setError('') }}
        />
        <button className={Styles.addBtn} type="submit">Add</button>
      </form>
      {error && <span className={Styles.error}>{error}</span>}

      <div className={Styles.receipt}>
        <ul className={Styles.list}>
          {categories.map((cat) => {
            const used = countInUse(cat)
            return (
              <li key={cat} className={Styles.item}>
                <span className={Styles.itemTitle}>{cat}</span>
                <span className={Styles.leader}></span>
                <span className={Styles.usage}>
                  {used > 0 ? `${used} transaction${used > 1 ? 's' : ''}` : 'unused'}
                </span>
                <button
                  className={Styles.deleteBtn}
                  onClick={() => dispatch(deleteCategory(cat))}
                >
                  remove
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