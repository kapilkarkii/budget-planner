import { Link, useLocation } from 'react-router-dom'
import Styles from './Sidebar.module.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/transactions', label: 'Transactions', icon: 'receipt_long' },
  { to: '/reports', label: 'Reports', icon: 'monitoring' },
  { to: '/goals', label: 'Goals', icon: 'flag' },
  { to: '/settings', label: 'Settings', icon: 'tune' },
]

export const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className={Styles.sidebar}>
      <div>
        <div className={Styles.brand}>
          <span className={Styles.brandMark}>P</span>
          <div>
            <div className={Styles.brandName}>PennyWise</div>
            <div className={Styles.brandTag}>Financial Expert</div>
          </div>
        </div>

        <nav className={Styles.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${Styles.navItem} ${active ? Styles.navItemActive : ''}`}
              >
                <span className={`icon ${Styles.navIcon}`}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <Link to="/add" className={Styles.addBtn}>
        <span className="icon">add</span>
        Add Transaction
      </Link>
    </aside>
  )
}