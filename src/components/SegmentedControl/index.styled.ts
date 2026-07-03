import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CHIP,
    padding: Spacing.XX_SMALL / 2
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
