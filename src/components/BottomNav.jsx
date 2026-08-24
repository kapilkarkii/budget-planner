import { Link, useLocation } from 'react-router-dom'
import Styles from './BottomNav.module.css'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const navItems = [
  { to: '/', label: 'Home', icon: 'grid_view' },
  { to: '/transactions', label: 'Activity', icon: 'swap_horiz' },
  { to: '/add', label: 'Add', icon: 'add_circle', isAction: true },
  { to: '/goals', label: 'Goals', icon: 'adjust' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export const BottomNav = () => {
  const location = useLocation()
  const { canInstall, promptInstall } = useInstallPrompt()

 return (
  <>
    {canInstall && (
      <button className={Styles.installBanner} onClick={promptInstall}>
        <span className="icon">download</span>
        Install Sable Ledger
      </button>
    )}
    <nav className={Styles.bottomNav}>
      {navItems.map((item) => {
        const active = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`${Styles.navItem} ${active ? Styles.navItemActive : ''} ${item.isAction ? Styles.actionItem : ''}`}
          >
            <span className={`icon ${Styles.navIcon}`}>{item.icon}</span>
            <span className={Styles.navLabel}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  </>
)
}