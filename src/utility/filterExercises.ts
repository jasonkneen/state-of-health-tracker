import {Exercise} from '@data/models/Exercise'

/**
 * Case-insensitively filters exercises by name, type, or body part.
 * An empty filter returns the list unchanged.
 */
export const filterExercises = (exercises: Exercise[], filter: string): Exercise[] => {
  if (!filter) {
    return exercises
  }

  const lowered = filter.toLowerCase()

  return exercises.filter(
    exercise =>
      exercise.name.toLowerCase().includes(lowered) ||
      exercise.exerciseType.toLowerCase().includes(lowered) ||
      exercise.exerciseBodyPart.toLowerCase().includes(lowered)
  )
}
