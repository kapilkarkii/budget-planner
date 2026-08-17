import React from 'react'
import {Link} from 'react-router-dom'
export const Navbar = () => {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/add">Add Transaction</Link>
    </nav>
  )
}
