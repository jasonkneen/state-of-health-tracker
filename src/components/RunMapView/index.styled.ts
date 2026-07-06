import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  containerRounded: {
    borderRadius: BorderRadius.CARD_LG
  },
  map: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.tile
  },
  emptyText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted
  }
})
