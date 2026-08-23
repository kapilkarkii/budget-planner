import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addTransaction, updateTransaction } from '../features/budget/budgetSlice'
import { CATEGORIES } from '../constants/categories'
import Styles from './AddTransaction.module.css'

const today = () => new Date().toISOString().split('T')[0]

const CATEGORY_TYPE_MAP = {
  Food: 'expense',
  Transport: 'expense',
  Rent: 'expense',
  Utilities: 'expense',
  Entertainment: 'expense',
  Shopping: 'expense',
  'Other Expense': 'expense',
  Salary: 'income',
  Freelance: 'income',
  Gift: 'income',
  'Other Income': 'income',
}

export const AddTransaction = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const transactions = useSelector((state) => state.budget.transactions)

  const editingTransaction = id ? transactions.find((t) => t.id === Number(id)) : null

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(today())
  const [errors, setErrors] = useState({})

  const categoryOptions = CATEGORIES.filter((cat) => CATEGORY_TYPE_MAP[cat] === type)

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title)
      setAmount(editingTransaction.amount)
      setType(editingTransaction.type)
      setCategory(editingTransaction.category)
      setDate(editingTransaction.date || today())
    }
  }, [editingTransaction])

  const handleTypeChange = (newType) => {
    setType(newType)
    setCategory('')
  }

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
      <span className={Styles.eyebrow}>{editingTransaction ? 'EDIT' : 'NEW'}</span>
      <h1 className={Styles.headline}>
        {editingTransaction ? 'Edit ' : 'Add '}<span className={Styles.gradientText}>Transaction</span>
      </h1>

      <form className={Styles.card} onSubmit={handleSubmit} noValidate>
        <div className={Styles.typeGroup}>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'expense' ? Styles.typeBtnExpenseActive : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            <span className="icon">north</span>
            Expense
          </button>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'income' ? Styles.typeBtnIncomeActive : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            <span className="icon">south</span>
            Income
          </button>
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Title</label>
          <input
            className={Styles.input}
            type="text"
            placeholder="e.g. Whole Foods Market"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <span className={Styles.error}>{errors.title}</span>}
        </div>

        <div className={Styles.row}>
          <div className={Styles.field}>
            <label className={Styles.label}>Amount</label>
            <input
              className={Styles.input}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <span className={Styles.error}>{errors.amount}</span>}
          </div>

          <div className={Styles.field}>
            <label className={Styles.label}>Date</label>
            <input
              className={Styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <span className={Styles.error}>{errors.date}</span>}
          </div>
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Category</label>
          <select
            className={Styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className={Styles.error}>{errors.category}</span>}
        </div>

        <button className={Styles.submitBtn} type="submit">
          {editingTransaction ? 'Save Changes' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </button>
      </form>
    </div>
  )
}