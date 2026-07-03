import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const DOT_SIZE = 6

export default StyleSheet.create({
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.PILL,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.SMALL
  },
  recordingDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Theme.colors.accentGreen
  },
  timerText: {
    fontSize: FontSize.LABEL,
    fontWeight: '700',
    color: Theme.colors.text,
    fontVariant: ['tabular-nums']
  }
})
