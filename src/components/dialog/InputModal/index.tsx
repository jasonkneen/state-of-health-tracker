import React, {useEffect} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import Modal from 'react-native-modal'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TextInput from '@components/TextInput'

import styles from './index.styled'

interface Props {
  isVisible: boolean
  onCancel: () => void
  onButtonPressed: () => void
  value?: string
  onChangeText: (text: string) => void
  icon?: React.JSX.Element
  title: string
  subtitle?: string
  buttonText: string
  showError?: boolean
  errorMessage?: string
  keyboardType?: 'default' | 'numeric' | 'number-pad' | 'decimal-pad'
  maxInputLength?: number
  placeholder?: string
}

const InputModal = (props: Props) => {
  const {
    isVisible,
    title,
    subtitle,
    buttonText,
    icon,
    value = '',
    onChangeText,
    onCancel,
    onButtonPressed,
    showError = false,
    errorMessage = '',
    keyboardType = 'default',
    maxInputLength = 24,
    placeholder
  } = props

  useEffect(() => {
    if (isVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }, [isVisible])

  return (
    <Modal
      isVisible={isVisible}
      avoidKeyboard={true}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.5}
      animationIn="pulse"
      animationOut="fadeOut"
      animationInTiming={250}
      animationOutTiming={50}
      backdropTransitionInTiming={100}
      onBackdropPress={onCancel}>
      <View style={styles.modalCard}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color={Theme.colors.white} style={styles.closeIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        {icon && icon}

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <TextInput
          placeholder={placeholder}
          // Only keyboards with a return key get a returnKeyType — on pad
          // keyboards RN renders it as a floating "Done" accessory instead
          returnKeyType={keyboardType === 'default' ? 'done' : undefined}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxInputLength}
        />

        {showError && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        <PrimaryButton style={styles.button} label={buttonText} onPress={onButtonPressed} />
      </View>
    </Modal>
  )
}

export default InputModal
