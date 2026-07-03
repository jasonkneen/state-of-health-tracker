import React, {useEffect, useState, useRef} from 'react'
import {ReactNode} from 'react'

import {View, TouchableWithoutFeedback} from 'react-native'

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import {Theme} from '@styles/theme'
import {Subject} from 'rxjs'

import styles from './index.styled'

interface BottomSheetEvent {
  action: 'open' | 'close'
  content?: ReactNode
}

export const BottomSheetSubject$ = new Subject<BottomSheetEvent>()

export const openGlobalBottomSheet = (content: ReactNode) => {
  BottomSheetSubject$.next({
    action: 'open',
    content
  })
}

export const closeGlobalBottomSheet = () => {
  BottomSheetSubject$.next({action: 'close'})
}

const GlobalBottomSheet = () => {
  const sheetRef = useRef<BottomSheet>(null)

  const [content, setContent] = useState<ReactNode>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const sub = BottomSheetSubject$.subscribe(({action, content}) => {
      if (action === 'open') {
        setContent(content || null)
        sheetRef.current?.expand()
        setIsOpen(true)
      } else {
        setIsOpen(false)
        setContent(null)
        sheetRef.current?.close()
      }
    })

    return () => sub.unsubscribe()
  }, [])

  return (
    <>
      {isOpen && (
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={closeGlobalBottomSheet}>
            <View style={styles.backdropTouchableArea} />
          </TouchableWithoutFeedback>
        </View>
      )}

      <BottomSheet
        ref={sheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        handleIndicatorStyle={{backgroundColor: Theme.colors.white}}
        backgroundStyle={{backgroundColor: Theme.colors.background}}
        style={styles.sheetShadow}
        onClose={closeGlobalBottomSheet}>
        <BottomSheetView style={styles.sheetContent}>{content}</BottomSheetView>
      </BottomSheet>
    </>
  )
}

export default GlobalBottomSheet
