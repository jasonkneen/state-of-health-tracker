import React, {useEffect, useState} from 'react'

import {Keyboard, TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'

import TextInput from '@components/TextInput'

import {Theme} from '@styles/theme'

import styles from './index.styled'

export {SEARCH_BAR_HEIGHT} from './index.styled'

interface Props {
  placeholder?: string
  onSearchTextChanged: (text: string) => void
}

const SearchBar = (props: Props) => {
  const {onSearchTextChanged, placeholder} = props

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    onSearchTextChanged(searchText)
  }, [searchText])

  const onCancel = () => {
    setSearchText('')
    setTimeout(() => {
      Keyboard.dismiss()
    }, 50)
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={Theme.colors.secondary} />

        <TextInput
          maxLength={100}
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={placeholder}
        />

        {searchText !== '' && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="close" size={20} color={Theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default SearchBar
