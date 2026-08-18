import { Link, useLocation } from 'react-router-dom'
import Styles from './Navbar.module.css'

export const Navbar = () => {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/add', label: 'Add Transaction' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <nav className={Styles.nav}>
      <Link to="/" className={Styles.brand}>
        <span className={Styles.brandMark}>Rs.</span>
        Ledger
      </Link>

      <div className={Styles.links}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${Styles.link} ${location.pathname === link.to ? Styles.linkActive : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}