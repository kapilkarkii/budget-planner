import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Styles from './Sidebar.module.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'grid_view' },
  { to: '/transactions', label: 'Transactions', icon: 'swap_horiz' },
  { to: '/reports', label: 'Analytics', icon: 'donut_large' },
  { to: '/goals', label: 'Goals', icon: 'adjust' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export const Sidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${Styles.sidebar} ${collapsed ? Styles.collapsed : ''}`}>
      <div>
        <div className={Styles.brand}>
          <span className={Styles.brandMark}>∞</span>
          {!collapsed && <span className={Styles.brandName}>Ledgerly</span>}
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