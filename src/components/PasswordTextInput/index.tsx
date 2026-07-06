import React, {useState} from 'react'

import {TouchableOpacity} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import TextInputWithHeader, {TextInputProps} from '@components/TextInputWithHeader'

import styles from './index.styled'

const PasswordTextInput = (props: TextInputProps) => {
  const {secureTextEntry} = props
  const [secureEntry, setSecureEntry] = useState(secureTextEntry)

  return (
    <>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => {
          setSecureEntry(!secureEntry)
        }}>
        <Ionicons
          style={styles.toggleIcon}
          name={secureEntry ? 'eye' : 'eye-off'}
          size={24}
          color={Theme.colors.white}
        />
      </TouchableOpacity>

      <TextInputWithHeader {...props} secureTextEntry={secureEntry} />
    </>
  )
}

export default PasswordTextInput
