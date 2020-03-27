import React from 'react'
import Toast from './Toast'
import { css } from 'emotion'
import RoundButton from './RoundButton'
import { Portal } from 'react-portal'

export default ({onRequestClose}) => {

  return (
    <Portal>
      <Toast onClose={onRequestClose}>
        Bitcards has a new version
        <RoundButton onClick={() => window.location.reload(false)} className={css({
          marginLeft: '15px !important'
        })}>
          Reload
        </RoundButton>
      </Toast>
    </Portal>
  )
}
