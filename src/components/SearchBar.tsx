import React, {useEffect, useState} from 'react'

import {Keyboard, TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import TextInput from '@components/TextInput'
import {Theme} from '@styles/theme'
import Spacing from '@styles/spacing'

interface Props {
  placeholder?: string
  onSearchTextChanged: (text: string) => void
}

export const SEARCH_BAR_HEIGHT = 64

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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: SEARCH_BAR_HEIGHT,
        backgroundColor: Theme.colors.secondary
      }}>
      <View
        style={{
          backgroundColor: Theme.colors.background,
          alignSelf: 'center',
          borderRadius: 50,
          flexDirection: 'row',
          width: '90%'
        }}>
        <Ionicons
          style={{
            alignSelf: 'center',
            marginLeft: Spacing.MEDIUM
          }}
          name="search"
          size={20}
          color={Theme.colors.secondary}
        />

        <TextInput
          maxLength={100}
          style={{
            borderRadius: 50,
            borderWidth: 0,
            flex: 1
          }}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={placeholder}
        />

        {searchText !== '' && (
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginRight: Spacing.MEDIUM
            }}
            onPress={onCancel}>
            <Ionicons name="close" size={20} color={Theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default SearchBar
