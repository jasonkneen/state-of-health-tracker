import {create} from 'zustand'

export type ProgressSubTab = 'exercises' | 'volume' | 'body'

// Which sub-tab and exercise the Progress tab is charting — shared between
// the Progress screen and entry points on other screens (Select Exercise
// modal, Add Exercise's View Progression), which is why it lives in a store
// rather than component state.
type ProgressStore = {
  selectedSubTab: ProgressSubTab
  selectedExerciseId: string | undefined
  setSelectedSubTab: (subTab: ProgressSubTab) => void
  setSelectedExerciseId: (exerciseId: string) => void
  reset: () => void
}

const useProgressStore = create<ProgressStore>(set => ({
  selectedSubTab: 'exercises',
  selectedExerciseId: undefined,
  setSelectedSubTab: subTab => set({selectedSubTab: subTab}),
  setSelectedExerciseId: exerciseId => set({selectedExerciseId: exerciseId}),
  reset: () => set({selectedSubTab: 'exercises', selectedExerciseId: undefined})
}))

export default useProgressStore
