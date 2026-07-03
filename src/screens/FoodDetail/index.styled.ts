import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingBottom: Spacing.LARGE
  },
  eyebrow: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    letterSpacing: 1,
    color: Theme.colors.accentGreen
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: 'bold',
    marginTop: Spacing.XX_SMALL
  },
  subtitle: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },

  macroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.GUTTER,
    marginTop: Spacing.GUTTER
  },
  legend: {
    flex: 1,
    marginLeft: Spacing.LARGE
  },

  servingsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  servingsLabel: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textSecondary
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.TILE
  },
  stepperButtonText: {
    fontSize: FontSize.H2,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  },
  stepperValue: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: FontSize.STAT,
    fontWeight: 'bold'
  },

  fractionChipsRow: {
    flexDirection: 'row',
    marginTop: Spacing.MEDIUM
  },
  fractionChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.X_SMALL,
    marginHorizontal: Spacing.XX_SMALL,
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.PILL,
    borderWidth: 1,
    borderColor: Theme.colors.inset
  },
  fractionChipSelected: {
    backgroundColor: Theme.colors.greenTint,
    borderColor: Theme.colors.accentGreen
  },
  fractionChipText: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textSecondary
  },
  fractionChipTextSelected: {
    fontWeight: '600',
    color: Theme.colors.accentGreen
  },

  addsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.inset,
    borderRadius: BorderRadius.ITEM,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL,
    marginTop: Spacing.SMALL
  },
  addsLabel: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted
  },
  addsDetail: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted
  },
  addsCalories: {
    fontSize: FontSize.BODY,
    fontWeight: 'bold',
    color: Theme.colors.text
  },

  button: {
    marginTop: Spacing.MEDIUM
  }
})
