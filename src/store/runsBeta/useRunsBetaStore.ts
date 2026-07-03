import {zustandAsyncStorage} from '@store/zustandAsyncStorage'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type RunsBetaState = {
  hasSeenRunsBetaWarning: boolean
  markSeen: () => void
}

// Persisted (not in-memory) so the beta warning shows exactly once, not on
// every app launch. Mirrors useRunSessionStore's zustandAsyncStorage pattern.
export const useRunsBetaStore = create<RunsBetaState>()(
  persist(
    set => ({
      hasSeenRunsBetaWarning: false,
      markSeen: () => set({hasSeenRunsBetaWarning: true})
    }),
    {
      name: 'runs-beta-store',
      storage: zustandAsyncStorage
    }
  )
)
