import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { Dashboard} from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { AddTransaction } from './pages/AddTransaction'

function App() {

  return (
   <BrowserRouter>
   <Navbar/>
   <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/transactions" element={<Transactions/>}/>
      <Route path="/add" element={<AddTransaction/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
