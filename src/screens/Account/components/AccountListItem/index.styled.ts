import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.hairline
  },
  label: {
    flex: 1,
    fontSize: FontSize.BODY,
    color: Theme.colors.text
  },
  labelDanger: {
    color: Theme.colors.danger
  },
  value: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  }
})
