import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useOffline } from '@/context/useOfflineContext'

/**
 * Hook to guard mutations when offline.
 * Wraps a mutation function and blocks execution if offline.
 * Shows a warning toast instead of attempting the mutation.
 */
export function useOfflineMutationGuard() {
  const { isOffline } = useOffline()

  const guardMutation = useCallback(
    <T extends (...args: unknown[]) => unknown>(
      mutationFn: T,
      actionName: string = 'This action'
    ): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
      return (...args: Parameters<T>) => {
        if (isOffline) {
          toast.warn(
            `${actionName} requires an internet connection. Please reconnect and try again.`,
            {
              position: 'top-right',
              autoClose: 4000,
            }
          )
          return undefined
        }
        return mutationFn(...args) as ReturnType<T>
      }
    },
    [isOffline]
  )

  return { guardMutation, isOffline }
}
