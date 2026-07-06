import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const BAR_MAX_HEIGHT = 96

export default StyleSheet.create({
  container: {
    marginTop: Spacing.SMALL,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.hairline,
    paddingTop: Spacing.SMALL
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  overline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  targetCaption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textSecondary
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.SMALL
  },
  barColumn: {
    flex: 1,
    alignItems: 'center'
  },
  barArea: {
    // Extra room above the tallest bar for its count label
    height: BAR_MAX_HEIGHT + Spacing.GUTTER,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  countLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.XX_SMALL
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: BorderRadius.SECTION / 2,
    borderTopRightRadius: BorderRadius.SECTION / 2,
    borderBottomLeftRadius: BorderRadius.SECTION / 4,
    borderBottomRightRadius: BorderRadius.SECTION / 4,
    backgroundColor: Theme.colors.barMuted
  },
  barCurrentWeek: {
    backgroundColor: Theme.colors.barMid
  },
  barHitTarget: {
    backgroundColor: Theme.colors.barActive
  },
  weekLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL
  },
  weekLabelCurrent: {
    color: Theme.colors.text,
    fontWeight: '600'
  }
})
