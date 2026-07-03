import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    marginTop: Spacing.MEDIUM
  },
  label: {
    fontSize: FontSize.CAPTION,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: Spacing.XX_SMALL,
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CHIP,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginTop: Spacing.X_SMALL
  },
  chipLabel: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    flexShrink: 1
  }
})
