import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {BaseToast, ToastProps} from 'react-native-toast-message'

import Text from '@components/Text'

import styles from './index.styled'

export interface ActionToastProps {
  actionLabel: string
  onAction: () => void
}

export default {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1NumberOfLines={3}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  action: ({text1, text2, props}: ToastProps & {text1?: string; text2?: string; props: ActionToastProps}) => (
    <View style={styles.actionToast}>
      <View style={styles.actionTextColumn}>
        <Text style={styles.text1} numberOfLines={1}>
          {text1}
        </Text>

        {!!text2 && (
          <Text style={styles.text2} numberOfLines={2}>
            {text2}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={props.onAction}>
        <Text style={styles.actionButtonText}>{props.actionLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}
