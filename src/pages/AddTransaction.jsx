import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../features/budget/budgetSlice'
import Styles from './AddTransaction.module.css'

const expenseCategories = ['Food', 'Coffee', 'Transport', 'Rent', 'Entertainment', 'Shopping', 'Other']
const incomeCategories = ['Salary', 'Freelance', 'Gift', 'Investment', 'Other']

export const AddTransaction = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')

  const categoryOptions = type === 'expense' ? expenseCategories : incomeCategories

  const handleTypeChange = (e) => {
    setType(e.target.value)
    setCategory('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount || !category) return

    dispatch(addTransaction({
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString(),
    }))

    setTitle('')
    setAmount('')
    setCategory('')
  }

  return (
    <div className={Styles.wrapper}>
      <form className={Styles.box} onSubmit={handleSubmit}>
        <h1 className={Styles.title}>Add Transaction</h1>
        <p className={Styles.subtitle}>Record a new income or expense</p>

        {/* Type toggle */}
        <div className={Styles.typeToggle}>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'expense' ? Styles.typeBtnActiveExpense : ''}`}
            onClick={() => handleTypeChange({ target: { value: 'expense' } })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`${Styles.typeBtn} ${type === 'income' ? Styles.typeBtnActiveIncome : ''}`}
            onClick={() => handleTypeChange({ target: { value: 'income' } })}
          >
            Income
          </button>
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Title</label>
          <input
            className={Styles.input}
            type="text"
            placeholder="e.g. Grocery shopping"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          </div>

          <div className={Styles.field}>
            <label className={Styles.label}>Category</label>
            <select
              className={Styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button className={Styles.button} type="submit">
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  )
}