import { useRegisterSW } from 'virtual:pwa-register/react'
import Styles from './UpdatePrompt.module.css'

export const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  const handleUpdate = () => {
    updateServiceWorker(true)
  }

  const handleDismiss = () => {
    setNeedRefresh(false)
  }

  return (
    <div className={Styles.toast}>
      <div className={Styles.iconWrap}>
        <span className="icon">system_update</span>
      </div>
      <div className={Styles.textWrap}>
        <span className={Styles.title}>Update available</span>
        <span className={Styles.subtitle}>A new version of Sable Ledger is ready.</span>
      </div>
      <button className={Styles.updateBtn} onClick={handleUpdate}>Update</button>
      <button className={Styles.dismissBtn} onClick={handleDismiss} aria-label="Dismiss">
        <span className="icon">close</span>
      </button>
    </div>
  )
}