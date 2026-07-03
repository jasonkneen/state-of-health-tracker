import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  header: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: BorderRadius.CARD_LG,
    borderTopRightRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    paddingBottom: Spacing.SMALL,
    marginTop: Spacing.SMALL,
    marginHorizontal: Spacing.GUTTER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleButton: {
    flex: 1
  },
  title: {
    fontWeight: '700',
    fontSize: FontSize.CARD_TITLE,
    marginRight: Spacing.SMALL
  },
  button: {
    alignSelf: 'flex-end'
  },
  footer: {
    backgroundColor: Theme.colors.card,
    borderBottomLeftRadius: BorderRadius.CARD_LG,
    borderBottomRightRadius: BorderRadius.CARD_LG,
    marginHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL
  }
})
