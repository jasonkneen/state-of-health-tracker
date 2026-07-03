import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {useNavigation} from '@react-navigation/native'
import {Theme} from '@styles/theme'

import DeleteTemplateBottomSheet from '@screens/AddExercise/components/DeleteTemplateBottomSheet'

import {openGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'

import Screens from '@constants/screens'

import styles from './index.styled'
import {Navigation} from '../../../../navigation/types'

interface Props {
  template: ExerciseTemplate
}

const TemplateListItem = ({template}: Props) => {
  const {push} = useNavigation<Navigation>()

  const onPress = () => {
    push(Screens.WORKOUT_TEMPLATE_DETAIL, {template})
  }

  const onLongPress = () => {
    openGlobalBottomSheet(<DeleteTemplateBottomSheet template={template} />)
  }

  return (
    <TouchableOpacity activeOpacity={0.5} delayPressIn={50} onLongPress={onLongPress} onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: Theme.colors.background,
            borderColor: Theme.colors.border
          }
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {template.name}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {template.tagline}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TemplateListItem
