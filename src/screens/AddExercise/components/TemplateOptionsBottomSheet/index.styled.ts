import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  exercisesLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.XX_SMALL
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    paddingVertical: Spacing.XX_SMALL
  },
  exerciseIndex: {
    width: 18,
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textFaint
  },
  exerciseName: {
    flex: 1,
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  exerciseBodyPart: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted
  }
})
