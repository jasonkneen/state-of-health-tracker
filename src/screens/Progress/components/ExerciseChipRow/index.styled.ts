import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  row: {
    marginTop: Spacing.MEDIUM
  },
  rowContent: {
    columnGap: Spacing.X_SMALL,
    paddingRight: Spacing.GUTTER
  },
  chip: {
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CHIP,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM
  },
  chipSelected: {
    backgroundColor: Theme.colors.white
  },
  label: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  },
  labelSelected: {
    color: Theme.colors.primary
  }
})
