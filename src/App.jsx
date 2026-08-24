import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Styles from './App.module.css'
import { Sidebar } from './components/Sidebar'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { AddTransaction } from './pages/AddTransaction'
import { Reports } from './pages/Reports'
import { Goals } from './pages/Goals'
import { Settings } from './pages/Settings'
import { BottomNav } from './components/BottomNav'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarded')
  )

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
        <BottomNav/>
      </div>
      {showOnboarding && <Onboarding onDismiss={() => setShowOnboarding(false)} />}
    </BrowserRouter>
  )
}

export default App