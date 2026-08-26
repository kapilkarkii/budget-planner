import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Styles from './AuthPage.module.css'

export const ResetPassword = ({ onComplete }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => onComplete(), 2000)
    }
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.card}>
        <div className={Styles.brandMark}>∞</div>
        <h1 className={Styles.title}>Sable Ledger</h1>
        <p className={Styles.subtitle}>Set a new password</p>

        {success ? (
          <p className={Styles.message}>Password updated — redirecting you now…</p>
        ) : (
          <form onSubmit={handleSubmit} className={Styles.form}>
            <div className={Styles.field}>
              <label className={Styles.label}>New Password</label>
              <input
                className={Styles.input}
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className={Styles.field}>
              <label className={Styles.label}>Confirm Password</label>
              <input
                className={Styles.input}
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <span className={Styles.error}>{error}</span>}

            <button className={Styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}