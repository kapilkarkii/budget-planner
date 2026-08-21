import { useState } from 'react'
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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${Styles.sidebar} ${collapsed ? Styles.collapsed : ''}`}>
      <div>
        <div className={Styles.brand}>
          <span className={`icon ${Styles.brandMark}`}>savings</span>
          {!collapsed && (
            <div>
              <div className={Styles.brandName}>Ledgerly</div>
              <div className={Styles.brandTag}>Budget Planner</div>
            </div>
          )}
          <button
            className={Styles.collapseBtn}
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="icon">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>

        <nav className={Styles.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${Styles.navItem} ${active ? Styles.navItemActive : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`icon ${Styles.navIcon}`}>{item.icon}</span>
                {!collapsed && <span className={Styles.navLabel}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <Link to="/add" className={Styles.addBtn} title={collapsed ? 'Add Transaction' : undefined}>
        <span className="icon">add</span>
        {!collapsed && <span className={Styles.navLabel}>Add Transaction</span>}
      </Link>
    </aside>
  )
}