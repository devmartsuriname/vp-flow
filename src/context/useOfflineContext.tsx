import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type OfflineContextType = {
  isOffline: boolean
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Sync initial state
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      {children}
    </OfflineContext.Provider>
  )
}

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
