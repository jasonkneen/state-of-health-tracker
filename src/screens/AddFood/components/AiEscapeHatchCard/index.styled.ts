import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingHorizontal: Spacing.SMALL,
    paddingVertical: Spacing.SMALL,
    marginHorizontal: Spacing.MEDIUM
  },
  aiTile: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.TILE
  },
  aiTileGlyph: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.white
  },
  textColumn: {
    flex: 1,
    marginHorizontal: Spacing.SMALL
  },
  prefixText: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary
  },
  boldText: {
    fontWeight: 'bold',
    color: Theme.colors.white
  }
})
