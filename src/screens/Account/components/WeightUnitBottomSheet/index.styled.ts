import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: FontSize.H1
  },
  subtitle: {
    fontWeight: '200',
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary
  },
  options: {
    marginTop: Spacing.MEDIUM,
    rowGap: Spacing.X_SMALL
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.SMALL,
    backgroundColor: Theme.colors.tile,
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.MEDIUM,
    paddingHorizontal: Spacing.MEDIUM
  },
  rowSelected: {
    backgroundColor: Theme.colors.greenTint,
    borderColor: Theme.colors.greenTint
  },
  rowLabel: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  rowLabelSelected: {
    color: Theme.colors.greenOnTint
  }
})
