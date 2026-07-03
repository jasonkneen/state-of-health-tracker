import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    padding: Spacing.SMALL,
    paddingBottom: Spacing.X_SMALL,
    borderRadius: BorderRadius.SECTION,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Spacing.MEDIUM
  },
  day: {
    fontSize: FontSize.H3,
    marginBottom: Spacing.SMALL
  },
  headerChipRow: {
    flexDirection: 'row'
  },
  columnLabelRow: {
    marginTop: Spacing.MEDIUM,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.SMALL
  },
  column1Label: {
    marginLeft: Spacing.X_SMALL,
    fontSize: FontSize.H2,
    fontWeight: 'bold'
  },
  column2Label: {
    marginRight: Spacing.X_SMALL,
    fontSize: FontSize.H2,
    fontWeight: 'bold'
  },
  subItem: {
    backgroundColor: Theme.colors.tertiary,
    borderRadius: BorderRadius.SECTION,
    marginBottom: Spacing.XX_SMALL,
    paddingLeft: Spacing.SMALL,
    paddingRight: Spacing.SMALL,
    paddingTop: Spacing.XX_SMALL,
    paddingBottom: Spacing.XX_SMALL
  },
  subItemTitle: {
    fontWeight: 'bold'
  },
  subItemSubtitle: {
    marginTop: Spacing.XX_SMALL,
    fontWeight: '200'
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
