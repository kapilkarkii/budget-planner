import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'
import Styles from './UpdatePrompt.module.css'

const CHECK_INTERVAL = 60 * 1000 // check every 60 seconds

export const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return
      // actively poll for updates instead of waiting on browser defaults
      setInterval(() => {
        registration.update()
      }, CHECK_INTERVAL)
    },
  })

  // also check the instant the app becomes visible again (e.g. reopened from background)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker?.getRegistration()?.then((reg) => reg?.update())
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

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