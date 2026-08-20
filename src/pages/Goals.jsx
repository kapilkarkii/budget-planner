import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addGoal, deleteGoal, contributeToGoal, withdrawFromGoal } from '../features/budget/budgetSlice'
import Styles from './Goals.module.css'

const goalIcons = ['flag', 'savings', 'flight', 'home', 'school', 'medical_services', 'redeem', 'directions_car']

export const Goals = () => {
  const goals = useSelector((state) => state.budget.goals)
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [error, setError] = useState('')
  const [contributions, setContributions] = useState({})
  const [confirmId, setConfirmId] = useState(null)

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Goal name is required')
      return
    }
    if (!target || Number(target) <= 0) {
      setError('Enter a target amount greater than 0')
      return
    }
    dispatch(addGoal({ name: name.trim(), target: Number(target) }))
    setName('')
    setTarget('')
    setError('')
  }

  const handleContribute = (id) => {
    const amount = Number(contributions[id])
    if (!amount || amount <= 0) return
    dispatch(contributeToGoal({ id, amount }))
    setContributions((prev) => ({ ...prev, [id]: '' }))
  }

  const handleWithdraw = (id) => {
    const amount = Number(contributions[id])
    if (!amount || amount <= 0) return
    dispatch(withdrawFromGoal({ id, amount }))
    setContributions((prev) => ({ ...prev, [id]: '' }))
  }

  const handleDelete = (id) => {
    if (confirmId === id) {
      dispatch(deleteGoal(id))
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.headerRow}>
        <div>
          <h1 className={Styles.pageTitle}>Savings Goals</h1>
          <p className={Styles.pageSubtitle}>Track your progress and celebrate milestones.</p>
        </div>
      </div>

      <form className={Styles.addCard} onSubmit={handleAddGoal}>
        <input
          className={Styles.input}
          type="text"
          placeholder="Goal name, e.g. Emergency Fund"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
        />
        <input
          className={Styles.inputSmall}
          type="number"
          placeholder="Target amount"
          value={target}
          onChange={(e) => { setTarget(e.target.value); setError('') }}
        />
        <button className={Styles.addBtn} type="submit">
          <span className="icon">add</span>
          Add Goal
        </button>
      </form>
      {error && <span className={Styles.error}>{error}</span>}

      {goals.length === 0 ? (
        <div className={Styles.emptyState}>
          <p>No savings goals yet — add one above to get started.</p>
        </div>
      ) : (
        <div className={Styles.goalsGrid}>
          {goals.map((goal, i) => {
            const percent = Math.min((goal.saved / goal.target) * 100, 100)
            const reached = goal.saved >= goal.target

            return (
              <div key={goal.id} className={`${Styles.goalCard} ${reached ? Styles.goalCardReached : ''}`}>
                <div className={Styles.goalHeader}>
                  <span className={`icon ${Styles.goalIcon}`}>{goalIcons[i % goalIcons.length]}</span>
                  <div className={Styles.goalHeaderText}>
                    <span className={Styles.goalName}>{goal.name}</span>
                    {reached && <span className={Styles.reachedTag}>Goal reached</span>}
                  </div>
                  <button
                    className={`${Styles.deleteBtn} ${confirmId === goal.id ? Styles.confirmDelete : ''}`}
                    onClick={() => handleDelete(goal.id)}
                    aria-label={confirmId === goal.id ? `Confirm delete ${goal.name}` : `Delete ${goal.name}`}
                  >
                    <span className="icon">{confirmId === goal.id ? 'check' : 'close'}</span>
                  </button>
                </div>

                <div className={Styles.progressTrack}>
                  <div
                    className={Styles.progressFill}
                    style={{
                      width: `${percent}%`,
                      background: reached ? 'var(--warn)' : 'var(--secondary)',
                    }}
                  />
                </div>

                <div className={Styles.goalMeta}>
                  <span className={`num ${Styles.goalAmounts}`}>{goal.saved} of {goal.target}</span>
                  <span className={Styles.goalPercent}>{Math.round(percent)}%</span>
                </div>

                <div className={Styles.contributeRow}>
                  <input
                    className={Styles.contributeInput}
                    type="number"
                    placeholder="Amount"
                    value={contributions[goal.id] || ''}
                    onChange={(e) => setContributions((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                  />
                  <button className={Styles.contributeBtn} onClick={() => handleContribute(goal.id)}>
                    Add
                  </button>
                  <button className={Styles.withdrawBtn} onClick={() => handleWithdraw(goal.id)}>
                    Withdraw
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}