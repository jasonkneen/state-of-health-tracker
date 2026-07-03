import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const ICON_TILE_SIZE = 40

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.SMALL,
    marginBottom: Spacing.X_SMALL,
    borderRadius: BorderRadius.ITEM,
    backgroundColor: Theme.colors.card
  },
  iconTile: {
    width: ICON_TILE_SIZE,
    height: ICON_TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.TILE,
    backgroundColor: Theme.colors.greenTint
  },
  textColumn: {
    flex: 1,
    marginLeft: Spacing.SMALL,
    marginRight: Spacing.SMALL
  },
  name: {
    fontSize: FontSize.BODY,
    fontWeight: 'bold'
  },
  quantity: {
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  },
  calorieChip: {
    paddingHorizontal: Spacing.SMALL,
    paddingVertical: Spacing.X_SMALL,
    borderRadius: BorderRadius.TILE,
    backgroundColor: Theme.colors.inset
  },
  calorieText: {
    fontSize: FontSize.BODY,
    fontWeight: 'bold'
  }
})
