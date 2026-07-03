import React, {useState} from 'react'

import useAuthStore from '@store/auth/useAuthStore'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import TrashIcon from '@components/icons/TrashIcon'
import {showToast} from '@components/toast/util/ShowToast'

import {
  DELETE_ACCOUNT_CONFIRM_MODAL_BODY,
  DELETE_ACCOUNT_CONFIRM_MODAL_HEADER,
  DELETE_ACCOUNT_ERROR,
  DELETE_ACCOUNT_LIST_ITEM,
  DELETE_BUTTON_TEXT
} from '@constants/strings'

import AccountListItem from './AccountListItem'

const DeleteAccountListItem = () => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {deleteUser} = useAuthStore()

  return (
    <>
      <ConfirmModal
        confirmationTitle={DELETE_ACCOUNT_CONFIRM_MODAL_HEADER}
        confirmButtonText={DELETE_BUTTON_TEXT}
        confirmationBody={DELETE_ACCOUNT_CONFIRM_MODAL_BODY}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={() => {
          deleteUser().catch(() => showToast('error', DELETE_ACCOUNT_ERROR))
          setIsConfirmModalVisible(false)
        }}
        onCancel={() => {
          setIsConfirmModalVisible(false)
        }}
      />

      <AccountListItem
        type="auth"
        label={DELETE_ACCOUNT_LIST_ITEM}
        danger={true}
        isLastInGroup={true}
        tileVariant="danger"
        icon={<TrashIcon color={Theme.colors.danger} />}
        onPressOverride={() => {
          setIsConfirmModalVisible(true)
        }}
      />
    </>
  )
}

export default DeleteAccountListItem
