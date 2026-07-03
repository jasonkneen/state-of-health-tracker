import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const AVATAR_SIZE = 60

export default StyleSheet.create({
  scrollView: {
    height: '100%'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    marginTop: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: BorderRadius.PILL,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitials: {
    fontSize: FontSize.GREETING,
    fontWeight: '700',
    color: Theme.colors.white
  },
  greeting: {
    fontSize: FontSize.GREETING,
    fontWeight: '700'
  },
  email: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL / 2
  },
  sectionHeader: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.LARGE,
    marginBottom: Spacing.X_SMALL,
    marginHorizontal: Spacing.GUTTER
  },
  groupCard: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    overflow: 'hidden',
    marginHorizontal: Spacing.GUTTER
  },
  bottomSpacer: {
    height: Spacing.X_LARGE
  }
})
