import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL
  },
  day: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Spacing.SMALL
  },
  headerChipRow: {
    flexDirection: 'row'
  },
  columnLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.MEDIUM,
    paddingBottom: Spacing.X_SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.hairline
  },
  columnLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Theme.colors.textMuted
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.hairline
  },
  subItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  subItemInfo: {
    flex: 1,
    marginRight: Spacing.SMALL
  },
  subItemTitle: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    color: Theme.colors.text
  },
  subItemSubtitle: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  emptyStateTitle: {
    fontSize: FontSize.H1,
    marginTop: Spacing.MEDIUM,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  emptyStateBody: {
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.MEDIUM,
    marginLeft: Spacing.MEDIUM,
    marginRight: Spacing.MEDIUM,
    fontSize: FontSize.PARAGRAPH,
    textAlign: 'center',
    fontWeight: '200',
    alignSelf: 'center'
  }
})
