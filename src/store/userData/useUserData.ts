import {zustandAsyncStorage} from '@store/zustandAsyncStorage'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type UserDataStore = {
  goalWeight: number | null
  targetWorkouts: number
  targetCalories: number
  setGoalWeight: (weight: number) => void
  setTargetWorkouts: (value: number) => void
  setTargetCalories: (value: number) => void
}

const useUserDataStore = create<UserDataStore>()(
  persist(
    set => ({
      goalWeight: null,
      targetWorkouts: 5,
      targetCalories: 1800,
      setGoalWeight: weight => set({goalWeight: weight}),
      setTargetWorkouts: value => set({targetWorkouts: value}),
      setTargetCalories: value => set({targetCalories: value})
    }),
    {
      name: 'user-data-store',
      storage: zustandAsyncStorage
    }
  )
)

export default useUserDataStore
