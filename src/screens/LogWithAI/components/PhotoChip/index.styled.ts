import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SMALL,
    marginTop: Spacing.SMALL,
    padding: Spacing.SMALL,
    borderRadius: BorderRadius.INPUT,
    borderWidth: 1,
    borderColor: Theme.colors.greenTint,
    backgroundColor: Theme.colors.greenTint
  },
  label: {
    flex: 1,
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.greenOnTint
  },
  removeButton: {
    padding: Spacing.XX_SMALL
  }
})
