import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const GRADIENT_TILE_SIZE = 36
const TEXT_INPUT_MIN_HEIGHT = 130

export default StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingTop: Spacing.X_SMALL,
    paddingBottom: Spacing.X_LARGE
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SMALL,
    marginBottom: Spacing.MEDIUM
  },
  gradientTile: {
    width: GRADIENT_TILE_SIZE,
    height: GRADIENT_TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.TILE
  },
  gradientTileGlyph: {
    fontSize: FontSize.H3,
    color: Theme.colors.white
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: 'bold'
  },
  textInput: {
    minHeight: TEXT_INPUT_MIN_HEIGHT,
    textAlignVertical: 'top',
    borderRadius: BorderRadius.INPUT,
    fontSize: FontSize.BODY
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.SMALL,
    marginTop: Spacing.SMALL
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.SMALL,
    borderRadius: BorderRadius.BUTTON,
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder
  },
  photoButtonLabel: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  },
  estimateButton: {
    marginTop: Spacing.MEDIUM
  },
  estimateButtonDisabled: {
    opacity: 0.5
  },
  caption: {
    marginTop: Spacing.MEDIUM,
    textAlign: 'center',
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  },
  summaryCard: {
    padding: Spacing.SMALL,
    marginBottom: Spacing.MEDIUM,
    borderRadius: BorderRadius.INPUT,
    backgroundColor: Theme.colors.inset
  },
  summaryText: {
    fontSize: FontSize.BODY
  },
  summaryHint: {
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  },
  estimateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.X_SMALL,
    marginBottom: Spacing.SMALL
  },
  estimateHeaderOverline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 1,
    color: Theme.colors.textMuted
  },
  estimateHeaderRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.hairline
  },
  estimateHeaderTotal: {
    fontSize: FontSize.LABEL,
    fontWeight: 'bold'
  },
  notes: {
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  },
  tipBanner: {
    padding: Spacing.SMALL,
    marginTop: Spacing.SMALL,
    borderRadius: BorderRadius.TIP,
    backgroundColor: Theme.colors.greenTint
  },
  tipText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.accentGreen
  },
  mealSelector: {
    marginTop: Spacing.MEDIUM
  },
  addButton: {
    marginTop: Spacing.MEDIUM
  },
  reEstimateButton: {
    alignSelf: 'center',
    padding: Spacing.SMALL,
    marginTop: Spacing.X_SMALL
  },
  reEstimateLabel: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  }
})
