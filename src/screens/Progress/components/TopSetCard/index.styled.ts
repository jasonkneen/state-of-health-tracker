import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  delta: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  deltaNegative: {
    color: Theme.colors.danger
  },
  scrubDate: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.textMuted
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.XX_SMALL,
    marginTop: Spacing.XX_SMALL
  },
  value: {
    fontSize: FontSize.STAT_LG,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  unit: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textMuted,
    marginBottom: 4
  },
  reps: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginBottom: 4
  },
  chartWrapper: {
    marginTop: Spacing.MEDIUM
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.XX_SMALL
  },
  axisLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textFaint
  }
})
