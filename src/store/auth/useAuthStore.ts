import {queryClient} from '@queries/queryClient'
import authService from '@service/auth/AuthService'
import offlineWorkoutStorageService from '@service/workouts/OfflineWorkoutStorageService'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {create} from 'zustand'

export type AuthState = {
  userId: string | null
  userEmail: string | null
  isAuthed: boolean
  isAttemptingAuth: boolean
  initAuth: () => boolean
  loginUser: (email: string, password: string) => Promise<void>
  registerUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  deleteUser: () => Promise<void>
}

// Clears everything owned by the previous account so a different login never
// sees stale data: server cache, unsynced workouts, and the in-progress workout.
const clearUserSession = async () => {
  await offlineWorkoutStorageService.clear()
  queryClient.clear()
  useDailyWorkoutEntryStore.getState().reset()
}

const useAuthStore = create<AuthState>()(set => ({
  userId: null,
  userEmail: null,
  isAuthed: false,
  isAttemptingAuth: false,
  initAuth: () => {
    const user = authService.getCurrentUser()
    const isAuthed = user !== null

    set({
      userId: user?.uid ?? null,
      userEmail: user?.email ?? null,
      isAuthed
    })

    return isAuthed
  },
  loginUser: async (email, password) => {
    set({isAttemptingAuth: true})
    try {
      const user = await authService.logInUser(email, password)

      set({
        userId: user.id,
        userEmail: user.email,
        isAuthed: true
      })
    } catch (error) {
      set({isAuthed: false})
      throw error
    } finally {
      set({isAttemptingAuth: false})
    }
  },
  registerUser: async (email, password) => {
    set({isAttemptingAuth: true})
    try {
      const account = await authService.registerUser(email, password)

      set({
        userId: account.id,
        userEmail: account.email,
        isAuthed: true
      })
    } catch (error) {
      set({isAuthed: false})
      throw error
    } finally {
      set({isAttemptingAuth: false})
    }
  },
  logoutUser: async () => {
    await authService.logOutUser()
    await clearUserSession()

    set({
      userId: null,
      userEmail: null,
      isAuthed: false
    })
  },
  deleteUser: async () => {
    await authService.deleteCurrentUser()
    await clearUserSession()

    set({
      userId: null,
      userEmail: null,
      isAuthed: false
    })
  }
}))

export default useAuthStore
