import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addGoal, deleteGoal, contributeToGoal } from '../features/budget/budgetSlice'
import Styles from './Goals.module.css'

export const Goals = () => {
  const goals = useSelector((state) => state.budget.goals)
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [error, setError] = useState('')
  const [contributions, setContributions] = useState({})

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

  return (
    <div className={Styles.wrapper}>
      <h1 className={Styles.title}>Savings Goals</h1>
      <p className={Styles.subtitle}>Set a target, chip away at it</p>

      <form className={Styles.addForm} onSubmit={handleAddGoal}>
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
          placeholder="Target"
          value={target}
          onChange={(e) => { setTarget(e.target.value); setError('') }}
        />
        <button className={Styles.addBtn} type="submit">Add Goal</button>
      </form>
      {error && <span className={Styles.error}>{error}</span>}

      {goals.length === 0 ? (
        <div className={Styles.emptyState}>
          <p>No savings goals yet — add one above</p>
        </div>
      ) : (
        <div className={Styles.goalsList}>
          {goals.map((goal) => {
            const percent = Math.min((goal.saved / goal.target) * 100, 100)
            const reached = goal.saved >= goal.target

            return (
              <div key={goal.id} className={Styles.goalCard}>
                <div className={Styles.goalHeader}>
                  <span className={Styles.goalName}>{goal.name}</span>
                  <button className={Styles.deleteBtn} onClick={() => dispatch(deleteGoal(goal.id))}>remove</button>
                </div>

                <div className={Styles.progressTrack}>
                  <div
                    className={Styles.progressFill}
                    style={{
                      width: `${percent}%`,
                      background: reached ? 'var(--gold)' : 'var(--income)',
                    }}
                  />
                </div>

                <div className={Styles.goalMeta}>
                  <span className={Styles.goalAmounts}>
                    {goal.saved} / {goal.target} {reached && '— goal reached'}
                  </span>
                  <span className={Styles.goalPercent}>{Math.round(percent)}%</span>
                </div>

                {!reached && (
                  <div className={Styles.contributeRow}>
                    <input
                      className={Styles.contributeInput}
                      type="number"
                      placeholder="Add funds"
                      value={contributions[goal.id] || ''}
                      onChange={(e) => setContributions((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                    />
                    <button className={Styles.contributeBtn} onClick={() => handleContribute(goal.id)}>
                      Add
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}