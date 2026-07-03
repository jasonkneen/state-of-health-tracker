import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import Text from '@components/Text'
import {Theme} from '@styles/theme'
import Screens from '@constants/screens'
import {SEARCH_EXERCISES_PLACEHOLDER} from '@constants/strings'

import styles from './index.styled'
import {Navigation} from '../../../../navigation/types'

const ExerciseSearchBarButton = () => {
  const {navigate} = useNavigation<Navigation>()
  const onPress = () => {
    navigate(Screens.SEARCH_EXERCISES)
  }

  return (
    <>
      <View style={[styles.searchBarBackground, {backgroundColor: Theme.colors.secondary}]} />

      <View style={[styles.container, {backgroundColor: Theme.colors.secondary}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.innerContainer, {backgroundColor: Theme.colors.background}]}
          onPress={onPress}>
          <Ionicons style={styles.icon} name="search" size={20} color={Theme.colors.secondary} />

          <Text style={[styles.placeholder, {color: Theme.colors.tertiary}]} numberOfLines={1}>
            {SEARCH_EXERCISES_PLACEHOLDER}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default ExerciseSearchBarButton
