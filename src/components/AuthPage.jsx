import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Styles from './AuthPage.module.css'

export const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Enter both email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setMessage('Check your email to confirm your account, then log in.')
        setMode('login')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (signInError) {
        setError(signInError.message)
      }
      // on success, the auth listener in App.jsx will detect the session and redirect
    }
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.card}>
        <div className={Styles.brandMark}>∞</div>
        <h1 className={Styles.title}>Sable Ledger</h1>
        <p className={Styles.subtitle}>
          {mode === 'login' ? 'Log in to your account' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit} className={Styles.form}>
          <div className={Styles.field}>
            <label className={Styles.label}>Email</label>
            <input
              className={Styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className={Styles.field}>
            <label className={Styles.label}>Password</label>
            <input
              className={Styles.input}
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <span className={Styles.error}>{error}</span>}
          {message && <span className={Styles.message}>{message}</span>}

          <button className={Styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <button
          className={Styles.switchBtn}
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError('')
            setMessage('')
          }}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}