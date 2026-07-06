import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const TRACK_PADDING = Spacing.XX_SMALL / 2

export const indicatorWidth = (width: number): ViewStyle => ({
  width
})

export default StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CHIP,
    padding: TRACK_PADDING
  },
  indicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: BorderRadius.CHIP,
    backgroundColor: Theme.colors.card
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.X_SMALL,
    borderRadius: BorderRadius.CHIP,
    alignItems: 'center'
  },
  segmentSelected: {
    backgroundColor: Theme.colors.card
  },
  label: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textMuted
  },
  labelSelected: {
    color: Theme.colors.text
  }
})
