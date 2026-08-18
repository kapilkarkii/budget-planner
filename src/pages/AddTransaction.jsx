import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../features/budget/budgetSlice'
import Styles from './AddTransaction.module.css'

export const AddTransaction = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount) return

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
    <form className={Styles.box} onSubmit={handleSubmit}>
      <h1 className={Styles.title}>Add Transaction</h1>

      <input className={Styles.input} type="text" placeholder="Title"
        value={title} onChange={(e) => setTitle(e.target.value)} />

      <input className={Styles.input} type="number" placeholder="Amount"
        value={amount} onChange={(e) => setAmount(e.target.value)} />

      <select className={Styles.input} value={type}
        onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input className={Styles.input} type="text" placeholder="Category"
        value={category} onChange={(e) => setCategory(e.target.value)} />

      <button className={Styles.button} type="submit">Add Transaction</button>
    </form>
  )
}