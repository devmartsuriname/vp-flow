import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/useAuthContext'
import { LayoutProvider } from '@/context/useLayoutContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import { OfflineProvider } from '@/context/useOfflineContext'
import { ChildrenType } from '@/types/component-props'
import { HelmetProvider } from 'react-helmet-async'

import { ToastContainer } from 'react-toastify'
import OfflineBanner from '@/components/OfflineBanner'

// Create a stable QueryClient instance outside the component
// C3: Enhanced with offline-aware configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount) => {
        // Don't retry if offline
        if (!navigator.onLine) return false
        return failureCount < 1
      },
      // C3: Fail queries when offline (read-only enforcement)
      networkMode: 'online',
    },
    mutations: {
      // C3: Fail mutations immediately when offline
      networkMode: 'online',
    },
  },
})

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <OfflineProvider>
            <AuthProvider>
              <LayoutProvider>
                <NotificationProvider>
                  <OfflineBanner />
                  {children}
                  <ToastContainer theme="colored" />
                </NotificationProvider>
              </LayoutProvider>
            </AuthProvider>
          </OfflineProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </>
  )
}
export default AppProvidersWrapper
