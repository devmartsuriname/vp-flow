import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/useAuthContext'
import { LayoutProvider } from '@/context/useLayoutContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import { ChildrenType } from '@/types/component-props'
import { HelmetProvider } from 'react-helmet-async'

import { ToastContainer } from 'react-toastify'

// Create a stable QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <LayoutProvider>
              <NotificationProvider>
                {children}
                <ToastContainer theme="colored" />
              </NotificationProvider>
            </LayoutProvider>
          </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </>
  )
}
export default AppProvidersWrapper
