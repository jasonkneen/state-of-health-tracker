import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  listContainer: {
    flex: 1
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.X_SMALL,
    ...Shadow.CARD
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '600'
  },
  setCount: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary
  }
})
