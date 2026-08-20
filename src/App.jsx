import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { AddTransaction } from './pages/AddTransaction'
import { Reports } from './pages/Reports'
import { Goals } from './pages/Goals'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <Sidebar />
        <div className="mainContent">
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
      </div>
    </BrowserRouter>
  )
}

export default App