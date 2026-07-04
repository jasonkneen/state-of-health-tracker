import {WeightUnit} from '@data/models/WeightUnit'
import {zustandAsyncStorage} from '@store/zustandAsyncStorage'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type UserDataStore = {
  goalWeight: number | null
  targetWorkouts: number
  targetCalories: number
  stepGoal: number
  weightUnit: WeightUnit
  setGoalWeight: (weight: number) => void
  setTargetWorkouts: (value: number) => void
  setTargetCalories: (value: number) => void
  setStepGoal: (value: number) => void
  setWeightUnit: (unit: WeightUnit) => void
}

const useUserDataStore = create<UserDataStore>()(
  persist(
    set => ({
      goalWeight: null,
      targetWorkouts: 5,
      targetCalories: 1800,
      stepGoal: 10000,
      weightUnit: 'lbs',
      setGoalWeight: weight => set({goalWeight: weight}),
      setTargetWorkouts: value => set({targetWorkouts: value}),
      setTargetCalories: value => set({targetCalories: value}),
      setStepGoal: value => set({stepGoal: value}),
      setWeightUnit: unit => set({weightUnit: unit})
    }),
    {
      name: 'user-data-store',
      storage: zustandAsyncStorage
    }
  )
)

export default useUserDataStore
