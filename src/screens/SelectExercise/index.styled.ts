import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: Spacing.GUTTER
  },
  // Horizontal insets live on each section (not the container) so they line up
  // with SearchBar, which carries its own MEDIUM padding.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.MEDIUM,
    marginBottom: Spacing.X_SMALL
  },
  title: {
    fontWeight: 'bold',
    fontSize: FontSize.H1
  },
  closeButton: {
    width: Spacing.X_LARGE,
    height: Spacing.X_LARGE,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.tile,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContent: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingTop: Spacing.X_SMALL,
    paddingBottom: Spacing.X_LARGE
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.SMALL,
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginBottom: Spacing.X_SMALL
  },
  rowSelected: {
    backgroundColor: Theme.colors.greenTint
  },
  rowText: {
    flex: 1
  },
  rowLabel: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  rowLabelSelected: {
    color: Theme.colors.greenOnTint
  },
  rowSubtitle: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  }
})
