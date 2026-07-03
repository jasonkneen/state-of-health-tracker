import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.CARD_LG,
    overflow: 'hidden'
  },
  map: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CARD_LG
  },
  emptyText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted
  }
})
