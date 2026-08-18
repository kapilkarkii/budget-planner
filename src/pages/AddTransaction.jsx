import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addTransaction, updateTransaction } from '../features/budget/budgetSlice'
import Styles from './AddTransaction.module.css'

const today = () => new Date().toISOString().split('T')[0]

export const AddTransaction = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const transactions = useSelector((state) => state.budget.transactions)
  const categories = useSelector((state) => state.budget.categories)

  const editingTransaction = id ? transactions.find((t) => t.id === Number(id)) : null

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(today())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title)
      setAmount(editingTransaction.amount)
      setType(editingTransaction.type)
      setCategory(editingTransaction.category)
      setDate(editingTransaction.date || today())
    }
  }, [editingTransaction])

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Enter an amount greater than 0'
    if (!category) newErrors.category = 'Select a category'
    if (!date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    if (editingTransaction) {
      dispatch(updateTransaction({
        id: editingTransaction.id,
        title,
        amount: Number(amount),
        type,
        category,
        date,
      }))
      navigate('/transactions')
    } else {
      dispatch(addTransaction({
        id: Date.now(),
        title,
        amount: Number(amount),
        type,
        category,
        date,
      }))
      setTitle('')
      setAmount('')
      setCategory('')
      setDate(today())
      setErrors({})
    }
  }

  return (
    <div className={Styles.wrapper}>
      <form className={Styles.box} onSubmit={handleSubmit} noValidate>
        <h1 className={Styles.title}>{editingTransaction ? 'Edit Entry' : 'New Entry'}</h1>
        <p className={Styles.subtitle}>
          {editingTransaction ? 'Update this ledger line' : 'Record a new line in the ledger'}
        </p>

        <div className={Styles.typeGroup}>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'expense' ? Styles.typeBtnActive : ''}`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'income' ? Styles.typeBtnActive : ''}`}
            onClick={() => setType('income')}
          >
            Income
          </button>
        </div>

        <label className={Styles.label}>Title</label>
        <input
          className={Styles.input}
          type="text"
          placeholder="e.g. Coffee"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className={Styles.error}>{errors.title}</span>}

        <label className={Styles.label}>Amount</label>
        <input
          className={Styles.input}
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errors.amount && <span className={Styles.error}>{errors.amount}</span>}

        <label className={Styles.label}>Category</label>
        <select
          className={Styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className={Styles.error}>{errors.category}</span>}

        <label className={Styles.label}>Date</label>
        <input
          className={Styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <span className={Styles.error}>{errors.date}</span>}

        <button className={Styles.button} type="submit">
          {editingTransaction ? 'Save Changes' : 'Add Entry'}
        </button>
      </form>
    </div>
  )
}