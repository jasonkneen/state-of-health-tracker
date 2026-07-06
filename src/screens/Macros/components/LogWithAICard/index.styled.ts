import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const AI_TILE_SIZE = 40
const CAMERA_BUTTON_SIZE = 40

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM
  },
  aiTile: {
    width: AI_TILE_SIZE,
    height: AI_TILE_SIZE,
    borderRadius: BorderRadius.TILE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiTileGlyph: {
    fontSize: FontSize.H2,
    fontWeight: '700',
    color: Theme.colors.white
  },
  textColumn: {
    flex: 1
  },
  title: {
    fontSize: FontSize.H3,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary,
    marginTop: Spacing.XX_SMALL / 2
  },
  cameraButton: {
    width: CAMERA_BUTTON_SIZE,
    height: CAMERA_BUTTON_SIZE,
    borderRadius: BorderRadius.TILE,
    backgroundColor: Theme.colors.inset,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
