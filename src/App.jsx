import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Styles from './App.module.css'
import { supabase } from './lib/supabaseClient'
import { fetchAllData, setUserId, resetBudgetState } from './features/budget/budgetSlice'
import { Sidebar } from './components/Sidebar'
import { BottomNav } from './components/BottomNav'
import { Onboarding } from './components/Onboarding'
import { UpdatePrompt } from './components/UpdatePrompt'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { AddTransaction } from './pages/AddTransaction'
import { Reports } from './pages/Reports'
import { Goals } from './pages/Goals'
import { Settings } from './pages/Settings'

function App() {
  const dispatch = useDispatch()
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarded')
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
      if (session) {
        dispatch(setUserId(session.user.id))
        dispatch(fetchAllData(session.user.id))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        dispatch(setUserId(session.user.id))
        dispatch(fetchAllData(session.user.id))
      } else {
        dispatch(resetBudgetState())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  if (loadingSession) {
    return (
      <div className={Styles.loadingScreen}>
        <div className={Styles.loadingSpinner} />
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  return (
    <BrowserRouter>
      <div className={Styles.layout}>
        <Sidebar />
        <div className={Styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/transactions" element={<Transactions/>}/>
            <Route path="/add" element={<AddTransaction/>}/>
            <Route path="/edit/:id" element={<AddTransaction/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/goals" element={<Goals/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Routes>
        </div>
        <BottomNav />
      </div>
      {showOnboarding && <Onboarding onDismiss={() => setShowOnboarding(false)} />}
      <UpdatePrompt />
    </BrowserRouter>
  )
}

export default App