import React from 'react'

import {Theme} from '@styles/theme'
import {BaseToast, ToastProps} from 'react-native-toast-message'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

export default {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: Theme.colors.success, backgroundColor: Theme.colors.tertiary}}
      contentContainerStyle={{paddingHorizontal: Spacing.MEDIUM}}
      text1Style={{
        color: Theme.colors.text,
        fontSize: FontSize.H3,
        fontWeight: '400'
      }}
      text2Style={{
        color: Theme.colors.text,
        fontSize: FontSize.PARAGRAPH,
        fontWeight: '300'
      }}
    />
  ),
  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: Theme.colors.errorLight, backgroundColor: Theme.colors.tertiary}}
      contentContainerStyle={{paddingHorizontal: Spacing.MEDIUM}}
      text1NumberOfLines={3}
      text1Style={{
        color: Theme.colors.text,
        fontSize: FontSize.H3,
        fontWeight: '400'
      }}
      text2Style={{
        color: Theme.colors.text,
        fontSize: FontSize.PARAGRAPH,
        fontWeight: '300'
      }}
    />
  )
}
