import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { addCategory, deleteCategory, setLimit, setCurrency } from '../features/budget/budgetSlice'
import { useTheme } from '../hooks/useTheme'
import { CURRENCIES } from '../utils/currency'
import Styles from './Settings.module.css'

export const Settings = () => {
  const categories = useSelector((state) => state.budget.categories)
  const transactions = useSelector((state) => state.budget.transactions)
  const goals = useSelector((state) => state.budget.goals)
  const limits = useSelector((state) => state.budget.limits)
  const currency = useSelector((state) => state.budget.currency)
  const dispatch = useDispatch()
  const location = useLocation()
  const limitsRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')
  const [confirmCat, setConfirmCat] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const highlighted = new URLSearchParams(location.search).get('highlight')
  const highlightedCategories = highlighted ? highlighted.split(',').filter(Boolean) : []

  useEffect(() => {
    if (location.hash === '#budget-limits' && limitsRef.current) {
      limitsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

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

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    localStorage.removeItem('transactions')
    localStorage.removeItem('limits')
    localStorage.removeItem('categories')
    localStorage.removeItem('goals')
    localStorage.removeItem('currency')
    window.location.reload()
  }

  return (
    <div className={Styles.wrapper}>
      <span className={Styles.eyebrow}>PREFERENCES</span>
      <h1 className={Styles.headline}>Manage <span className={Styles.gradientText}>Settings</span></h1>

      <div className={Styles.grid}>
        <div className={Styles.mainCol}>
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

          <h2 id="budget-limits" ref={limitsRef} className={Styles.subHeadline}>
            Budget <span className={Styles.gradientText}>Limits</span>
          </h2>
          <p className={Styles.subNote}>
            Set a monthly spending limit per category — these show up as "over budget" flags on your Dashboard.
          </p>
          <div className={Styles.card}>
            <ul className={Styles.limitList}>
              {categories.map((cat) => {
                const isHighlighted = highlightedCategories.includes(cat)
                return (
                  <li key={cat} className={`${Styles.limitItem} ${isHighlighted ? Styles.limitItemFlagged : ''}`}>
                    <span className={Styles.itemName}>
                      {cat}
                      {isHighlighted && <span className={Styles.flagTag}>over budget</span>}
                    </span>
                    <div className={Styles.limitInputWrap}>
                      <span className={Styles.limitPrefix}>{CURRENCIES[currency]?.symbol || '$'}</span>
                      <input
                        className={Styles.limitInput}
                        type="number"
                        placeholder="No limit"
                        value={limits[cat] || ''}
                        onChange={(e) => handleSetLimit(cat, e.target.value)}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className={Styles.sideCol}>
          <div className={Styles.sideCard}>
            <span className={Styles.sideCardTitle}>Currency</span>
            <select
              className={Styles.input}
              value={currency}
              onChange={(e) => dispatch(setCurrency(e.target.value))}
            >
              {Object.entries(CURRENCIES).map(([code, { label }]) => (
                <option key={code} value={code}>{code} — {label}</option>
              ))}
            </select>
          </div>

          <div className={Styles.sideCard}>
            <span className={Styles.sideCardTitle}>Appearance</span>
            <button className={Styles.themeRow} onClick={toggleTheme}>
              <span className="icon">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
              <span className={Styles.themeText}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className={Styles.themeSwitch} data-active={theme === 'dark'}>
                <span className={Styles.themeSwitchDot} />
              </span>
            </button>
          </div>

          <div className={Styles.sideCard}>
            <span className={Styles.sideCardTitle}>Your Data</span>
            <div className={Styles.dataStatRow}>
              <div>
                <span className={Styles.dataStatValue}>{transactions.length}</span>
                <span className={Styles.dataStatLabel}>Transactions</span>
              </div>
              <div>
                <span className={Styles.dataStatValue}>{categories.length}</span>
                <span className={Styles.dataStatLabel}>Categories</span>
              </div>
              <div>
                <span className={Styles.dataStatValue}>{goals.length}</span>
                <span className={Styles.dataStatLabel}>Goals</span>
              </div>
            </div>
            <p className={Styles.dataNote}>
              All data is stored locally in this browser — nothing is sent to a server.
            </p>
            <button
              className={`${Styles.resetBtn} ${confirmReset ? Styles.resetBtnConfirm : ''}`}
              onClick={handleReset}
            >
              {confirmReset ? 'Click again to confirm — this cannot be undone' : 'Reset All Data'}
            </button>
          </div>

          <div className={Styles.sideCard}>
            <span className={Styles.sideCardTitle}>About</span>
            <p className={Styles.aboutText}>
              Sable Ledger is a personal budgeting tool built with React and Redux. Track income and expenses, set budget limits, and work toward savings goals — all stored privately on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}