import useUserData from '@store/userData/useUserData'

import {WEIGHT_UNIT_LABELS} from '@constants/strings'

export const useWeightUnitLabel = (): string => {
  const weightUnit = useUserData(state => state.weightUnit)

  return WEIGHT_UNIT_LABELS[weightUnit]
}
