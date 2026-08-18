import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { Dashboard} from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { AddTransaction } from './pages/AddTransaction'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { Goals } from './pages/Goals'

function App() {

  return (
   <BrowserRouter>
   <Navbar/>
   <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/transactions" element={<Transactions/>}/>
      <Route path="/add" element={<AddTransaction/>}/>
      <Route path="/edit/:id" element={<AddTransaction/>}/> 
      <Route path="/reports" element={<Reports/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/goals" element={<Goals/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
