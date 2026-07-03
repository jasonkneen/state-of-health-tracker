import {Dimensions, StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const createFoodContentWidth = Dimensions.get('window').width - Spacing.MEDIUM * 2

export default StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingBottom: Spacing.LARGE
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: 'bold'
  },
  fieldLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginTop: Spacing.GUTTER,
    marginBottom: Spacing.X_SMALL
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '300',
    marginTop: Spacing.XX_SMALL
  },

  // The unit dropdown list overlays the sections below it
  servingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10
  },
  servingColumn: {
    width: createFoodContentWidth * 0.32
  },
  unitColumn: {
    width: createFoodContentWidth * 0.62
  },
  macrosSection: {
    zIndex: -1
  },

  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  macroCell: {
    flex: 1,
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.CELL,
    paddingHorizontal: Spacing.SMALL,
    paddingVertical: Spacing.SMALL,
    marginHorizontal: Spacing.XX_SMALL
  },
  macroCellHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.PILL,
    marginRight: Spacing.XX_SMALL
  },
  dotProtein: {
    backgroundColor: Theme.colors.accentGreen
  },
  dotCarbs: {
    backgroundColor: Theme.colors.teal
  },
  dotFat: {
    backgroundColor: Theme.colors.lime
  },
  macroCellLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Theme.colors.textSecondary
  },
  macroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Spacing.XX_SMALL
  },
  macroInput: {
    minWidth: 40,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    fontSize: FontSize.H1,
    fontWeight: 'bold'
  },
  macroUnitSuffix: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted,
    marginBottom: Spacing.XX_SMALL / 2
  },

  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.ITEM,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL,
    marginTop: Spacing.MEDIUM
  },
  caloriesLabel: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted
  },
  caloriesInput: {
    minWidth: 64,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    textAlign: 'right',
    fontSize: FontSize.H1,
    fontWeight: 'bold'
  },

  scanHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.greenTint,
    borderRadius: BorderRadius.TIP,
    paddingHorizontal: Spacing.SMALL,
    paddingVertical: Spacing.SMALL,
    marginTop: Spacing.MEDIUM
  },
  scanHintGlyph: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.accentGreen,
    marginRight: Spacing.X_SMALL
  },
  scanHintText: {
    flex: 1,
    fontSize: FontSize.LABEL,
    color: Theme.colors.accentGreen
  },

  button: {
    marginTop: Spacing.MEDIUM
  }
})
