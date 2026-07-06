import React, {useState} from 'react'

import useAuthStore from '@store/auth/useAuthStore'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import LogOutIcon from '@components/icons/LogOutIcon'
import {showToast} from '@components/toast/util/ShowToast'

import {
  ACCOUNT_LOG_IN_LIST_ITEM,
  ACCOUNT_LOG_OUT_LIST_ITEM,
  LOG_OUT_CONFIRM_MODAL_BODY,
  LOG_OUT_CONFIRM_MODAL_HEADER,
  LOGOUT_ACCOUNT_ERROR
} from '@constants/strings'

import AccountListItem from './AccountListItem'

const AuthListItem = () => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const isAuthed = useAuthStore(state => state.isAuthed)
  const logoutUser = useAuthStore(state => state.logoutUser)

  return (
    <>
      <ConfirmModal
        confirmationTitle={LOG_OUT_CONFIRM_MODAL_HEADER}
        confirmButtonText={ACCOUNT_LOG_OUT_LIST_ITEM}
        confirmationBody={LOG_OUT_CONFIRM_MODAL_BODY}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={() => {
          setIsConfirmModalVisible(false)
          if (isAuthed) {
            logoutUser().catch(() => showToast('error', LOGOUT_ACCOUNT_ERROR))
          }
        }}
        onCancel={() => {
          setIsConfirmModalVisible(false)
        }}
      />

      <AccountListItem
        type="auth"
        label={isAuthed ? ACCOUNT_LOG_OUT_LIST_ITEM : ACCOUNT_LOG_IN_LIST_ITEM}
        icon={<LogOutIcon color={Theme.colors.textSecondary} />}
        onPressOverride={() => {
          if (isAuthed) {
            setIsConfirmModalVisible(true)
          }
        }}
      />
    </>
  )
}

export default AuthListItem
