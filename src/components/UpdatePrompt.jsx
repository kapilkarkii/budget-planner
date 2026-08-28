import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect, useState } from 'react'
import Styles from './UpdatePrompt.module.css'

export const UpdatePrompt = () => {
  const [showToast, setShowToast] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return
      setInterval(() => {
        registration.update()
      }, 60 * 1000)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      setShowToast(true)
      updateServiceWorker(true)
      const timer = setTimeout(() => setShowToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [needRefresh, updateServiceWorker])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker?.getRegistration()?.then((reg) => reg?.update())
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  if (!showToast) return null

  return (
    <div className={Styles.toast}>
      <div className={Styles.iconWrap}>
        <span className="icon">system_update</span>
      </div>
      <div className={Styles.textWrap}>
        <span className={Styles.title}>Updating…</span>
        <span className={Styles.subtitle}>Sable Ledger is loading the latest version.</span>
      </div>
    </div>
  )
}