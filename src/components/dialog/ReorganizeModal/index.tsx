import React, {useEffect, useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import * as Haptics from 'expo-haptics'
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist'
import Modal from 'react-native-modal'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'

import {CANCEL_BUTTON_TEXT, CONFIRM_BUTTON_TEXT, REORG_MODAL_BODY} from '@constants/strings'

import styles from './index.styled'

interface Props<T> {
  readonly isVisible: boolean
  readonly onCancel?: () => void
  readonly onConfirm?: (updateItems: T[]) => void
  readonly items: T[]
  readonly getTitleForItem: (item: T) => string
}

const ReorganizeModal = <T extends object>(props: Props<T>) => {
  const {isVisible, onCancel, onConfirm, items, getTitleForItem} = props

  const [listData, setListData] = useState(items)

  useEffect(() => {
    if (isVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }, [isVisible])

  useEffect(() => {
    setListData(items)
  }, [items])

  const renderItem = ({item, drag, isActive}: RenderItemParams<T>) => (
    <ScaleDecorator>
      <TouchableOpacity activeOpacity={0.75} delayLongPress={50} onLongPress={drag} disabled={isActive}>
        <Text style={styles.itemTitle}>{getTitleForItem(item)}</Text>
      </TouchableOpacity>
    </ScaleDecorator>
  )

  return (
    <Modal
      useNativeDriverForBackdrop={true}
      animationIn="pulse"
      backdropOpacity={0.5}
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={100}
      isVisible={isVisible}
      onBackdropPress={() => {
        onCancel?.()
      }}>
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.modalCard}>
          <Text style={styles.body}>{REORG_MODAL_BODY}</Text>

          <DraggableFlatList
            data={listData}
            onDragEnd={({data}) => setListData(data)}
            keyExtractor={item => getTitleForItem(item)}
            renderItem={renderItem}
          />

          <View style={styles.buttonRow}>
            <PrimaryButton
              width="48%"
              style={styles.button}
              label={CANCEL_BUTTON_TEXT}
              onPress={() => {
                onCancel?.()
              }}
            />

            <PrimaryButton
              width="48%"
              style={styles.confirmButton}
              label={CONFIRM_BUTTON_TEXT}
              onPress={() => {
                onConfirm?.(listData)
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ReorganizeModal
