import React, {useState} from 'react'

import {Keyboard} from 'react-native'

import {Theme} from '@styles/theme'
import DropDownPicker from 'react-native-dropdown-picker'

export interface PickerItem {
  label: string
  value: any
}

interface Props {
  width?: number
  items: PickerItem[]
  disabled?: boolean
  placeholder?: string
  initialValue?: any
  onValueSet: (value: any) => void
}

const Picker = (props: Props) => {
  const {width, items, disabled = false, placeholder, initialValue, onValueSet} = props

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue)

  const valueSet = (v: any) => {
    onValueSet(v)
    setValue(v)
  }

  return (
    <DropDownPicker
      onPress={() => Keyboard.dismiss()}
      dropDownContainerStyle={{
        width,
        backgroundColor: Theme.colors.secondary,
        borderWidth: 0,
        height: 300
      }}
      // @ts-ignore
      arrowIconStyle={{tintColor: Theme.colors.secondaryLighter}}
      // @ts-ignore
      tickIconStyle={{tintColor: Theme.colors.secondaryLighter}}
      textStyle={{color: Theme.colors.white}}
      placeholderStyle={{color: Theme.colors.white}}
      style={{
        width,
        opacity: disabled ? 0.25 : 1,
        elevation: 100,
        backgroundColor: Theme.colors.secondary,
        borderWidth: 0
      }}
      placeholder={placeholder}
      disabled={disabled}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={valueSet}
    />
  )
}

export default Picker
