import {v4 as uuidv4} from 'uuid'

import Unique from './Unique'

export interface ExerciseSet extends Unique {
  reps?: number
  weight?: number
  addedWeight?: number | null
  durationSeconds?: number | null
  distanceMeters?: number | null
  rpe?: number | null
  isWarmup?: boolean
  setNumber?: number | null
  completedAt?: string | null
  completed: boolean
}

export function createSet(): ExerciseSet {
  return {
    id: uuidv4(),
    completed: false
  }
}
