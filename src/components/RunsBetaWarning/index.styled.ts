import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.MEDIUM
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MEDIUM
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.SMALL,
    backgroundColor: Theme.colors.fireOrange
  },
  title: {
    fontSize: FontSize.H2,
    fontWeight: '700'
  },
  content: {
    marginBottom: Spacing.LARGE
  },
  description: {
    fontSize: FontSize.BODY,
    lineHeight: 22,
    marginBottom: Spacing.MEDIUM
  },
  bulletPoints: {
    marginBottom: Spacing.MEDIUM
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.SMALL
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginRight: Spacing.SMALL,
    backgroundColor: Theme.colors.textSecondary
  },
  bulletText: {
    fontSize: FontSize.PARAGRAPH,
    lineHeight: 20,
    color: Theme.colors.textSecondary,
    flex: 1
  },
  footer: {
    fontSize: FontSize.PARAGRAPH,
    lineHeight: 20,
    color: Theme.colors.textMuted,
    fontStyle: 'italic'
  },
  buttonContainer: {
    marginTop: Spacing.X_SMALL
  }
})
