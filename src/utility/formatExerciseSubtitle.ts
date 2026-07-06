import {ExerciseBodyPartEnum, ExerciseTypeEnum} from '@data/models/Exercise'

export function formatExerciseSubtitle(
  exerciseType: ExerciseTypeEnum | string,
  exerciseBodyPart: ExerciseBodyPartEnum | string
): string | undefined {
  const parts = [
    exerciseType !== ExerciseTypeEnum.OTHER ? exerciseType : undefined,
    exerciseBodyPart !== ExerciseBodyPartEnum.OTHER ? exerciseBodyPart : undefined
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' · ') : undefined
}
