import React, {useState} from 'react'

import {TouchableOpacity} from 'react-native'

import {Theme} from '@styles/theme'

import TargetCaloriesModal from '@components/dialog/TargetCaloriesModal'
import TargetWorkoutsModal from '@components/dialog/TargetWorkoutsModal'
import WeightEntryModal from '@components/dialog/WeightEntryModal'
import ChevronRightIcon from '@components/icons/ChevronRightIcon'
import IconTile, {IconTileVariant} from '@components/IconTile'
import Text from '@components/Text'

import styles from './index.styled'

interface Props {
  readonly label: string
  readonly value?: string
  readonly icon: React.JSX.Element
  readonly tileVariant?: IconTileVariant
  readonly type: 'target-calories' | 'target-workouts' | 'weight' | 'auth' | 'info' | 'display-name'
  readonly clickable?: boolean
  readonly danger?: boolean
  readonly isLastInGroup?: boolean
  readonly onPressOverride?: () => void
}

const AccountListItem = (props: Props) => {
  const {
    label,
    value,
    icon,
    tileVariant = 'neutral',
    type,
    clickable = true,
    danger = false,
    isLastInGroup = false,
    onPressOverride
  } = props

  const [isInputModalVisible, setIsInputModalVisible] = useState(false)

  const getModalForType = () => {
    const dialogProps = {
      isVisible: isInputModalVisible,
      onDismissed: () => setIsInputModalVisible(false)
    }

    switch (type) {
      case 'target-calories':
        return <TargetCaloriesModal {...dialogProps} />
      case 'target-workouts':
        return <TargetWorkoutsModal {...dialogProps} />
      case 'weight':
        return <WeightEntryModal {...dialogProps} />
      default:
        break
    }
  }

  return (
    <>
      {getModalForType()}

      <TouchableOpacity
        activeOpacity={clickable ? 0.5 : 1}
        onPress={() => {
          onPressOverride ? onPressOverride() : clickable && setIsInputModalVisible(true)
        }}
        style={[styles.row, !isLastInGroup && styles.rowDivider]}>
        <IconTile variant={tileVariant}>{icon}</IconTile>

        <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>

        {value !== undefined && <Text style={styles.value}>{value}</Text>}

        {clickable && <ChevronRightIcon color={Theme.colors.textDisabled} />}
      </TouchableOpacity>
    </>
  )
}

export default AccountListItem
