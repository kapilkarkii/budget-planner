import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addTransaction, addGoal, setLimit } from '../features/budget/budgetSlice'
import Styles from './Onboarding.module.css'

const today = () => new Date().toISOString().split('T')[0]
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

const DEMO_TRANSACTIONS = [
  { title: 'Monthly Salary', amount: 4200, type: 'income', category: 'Salary', date: daysAgo(20) },
  { title: 'Whole Foods Market', amount: 142, type: 'expense', category: 'Food', date: daysAgo(3) },
  { title: 'Uber rides', amount: 68, type: 'expense', category: 'Transport', date: daysAgo(5) },
  { title: 'Apartment Rent', amount: 1500, type: 'expense', category: 'Rent', date: daysAgo(18) },
  { title: 'Electric Bill', amount: 85, type: 'expense', category: 'Utilities', date: daysAgo(10) },
  { title: 'Movie Night', amount: 32, type: 'expense', category: 'Entertainment', date: daysAgo(7) },
  { title: 'New Headphones', amount: 120, type: 'expense', category: 'Shopping', date: daysAgo(2) },
  { title: 'Freelance Project', amount: 600, type: 'income', category: 'Freelance', date: daysAgo(12) },
]

const steps = [
  {
    icon: 'receipt_long',
    title: 'Track every transaction',
    text: 'Log income and expenses in seconds, organized by category and date.',
  },
  {
    icon: 'donut_large',
    title: 'See where money goes',
    text: 'Real-time charts, budget limits, and monthly trends — no spreadsheets.',
  },
  {
    icon: 'adjust',
    title: 'Work toward real goals',
    text: 'Set savings targets and track progress until you hit them.',
  },
]

export const Onboarding = ({ onDismiss }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const finish = () => {
    localStorage.setItem('onboarded', 'true')
    onDismiss()
  }

  const handleLoadDemo = () => {
    DEMO_TRANSACTIONS.forEach((t, i) => {
      dispatch(addTransaction({ id: Date.now() + i, ...t }))
    })
    dispatch(addGoal({ name: 'Emergency Fund', target: 2000 }))
    dispatch(setLimit({ category: 'Food', limit: 300 }))
    dispatch(setLimit({ category: 'Entertainment', limit: 100 }))
    finish()
  }

  const handleStartFresh = () => {
    finish()
    navigate('/add')
  }

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className={Styles.overlay}>
      <div className={Styles.modal}>
        <button className={Styles.skipBtn} onClick={finish}>Skip</button>

        <div className={Styles.iconCircle}>
          <span className="icon">{current.icon}</span>
        </div>

        <span className={Styles.eyebrow}>Welcome to Sable Ledger</span>
        <h2 className={Styles.title}>{current.title}</h2>
        <p className={Styles.text}>{current.text}</p>

        <div className={Styles.dots}>
          {steps.map((_, i) => (
            <span key={i} className={`${Styles.dot} ${i === step ? Styles.dotActive : ''}`} />
          ))}
        </div>

        {!isLast ? (
          <button className={Styles.primaryBtn} onClick={() => setStep((s) => s + 1)}>
            Next
            <span className="icon">arrow_forward</span>
          </button>
        ) : (
          <div className={Styles.finalActions}>
            <button className={Styles.primaryBtn} onClick={handleStartFresh}>
              <span className="icon">add</span>
              Add my first transaction
            </button>
            <button className={Styles.secondaryBtn} onClick={handleLoadDemo}>
              Explore with sample data
            </button>
          </div>
        )}
      </div>
    </div>
  )
}