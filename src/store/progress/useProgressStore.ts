import {create} from 'zustand'

// Which exercise the Progress tab is charting — shared between the Progress
// screen and the Select Exercise modal, which is why it lives in a store
// rather than component state.
type ProgressStore = {
  selectedExerciseId: string | undefined
  setSelectedExerciseId: (exerciseId: string) => void
  reset: () => void
}

const useProgressStore = create<ProgressStore>(set => ({
  selectedExerciseId: undefined,
  setSelectedExerciseId: exerciseId => set({selectedExerciseId: exerciseId}),
  reset: () => set({selectedExerciseId: undefined})
}))

export default useProgressStore
