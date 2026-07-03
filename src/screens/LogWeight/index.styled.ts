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
  content: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingTop: Spacing.X_SMALL,
    paddingBottom: Spacing.X_LARGE
  },
  fieldLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.LARGE,
    marginBottom: Spacing.X_SMALL
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.X_SMALL,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL
  },
  weightInput: {
    flex: 1,
    fontSize: FontSize.STAT_LG,
    fontWeight: '700',
    color: Theme.colors.text,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  weightUnit: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textMuted,
    marginBottom: Spacing.XX_SMALL
  },
  errorText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.danger,
    marginTop: Spacing.X_SMALL
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    paddingHorizontal: Spacing.SMALL,
    paddingVertical: Spacing.X_SMALL
  },
  dateStepButton: {
    width: Spacing.X_LARGE,
    height: Spacing.X_LARGE,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.tile,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateStepButtonDisabled: {
    opacity: 0.4
  },
  dateLabel: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  buttonWrapper: {
    marginTop: Spacing.X_LARGE
  }
})
