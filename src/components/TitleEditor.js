import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import RoundButton from './RoundButton'
import Checkbox from './Checkbox'

class TitleEditor extends React.Component {
  setTitle = e => {
    this.props.onChange(e.target.value)
  }
  select = () => {
    this.input.select()
  }
  render() {
    const {
      title,
      swapSides,
      toggleColors,
      toggleDoubleSided,
      colorsEnabled,
      doubleSided
    } = this.props
    return (
      <TitleWrapper>
        <TitleInput
          type="text"
          innerRef={r => {
            this.input = r
          }}
          value={title}
          placeholder="Deck Title"
          onFocus={this.select}
          onChange={this.setTitle}
        />
        <ButtonColumn>
          <Checkbox checked={colorsEnabled} onChange={toggleColors}>Colors</Checkbox>
          <Checkbox checked={doubleSided} onChange={toggleDoubleSided}>Double Sided</Checkbox>
          {
            doubleSided &&
            <RoundButton onClick={swapSides}>Swap Sides</RoundButton>
          }
        </ButtonColumn>
      </TitleWrapper>
    )
  }
}
export default compose(
  withRouter,
  connect(state => ({
    colorsEnabled: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2
  }))
)(TitleEditor)

const TitleWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '5vw',
  paddingRight: '5vw',
  marginBottom: 20
  // maxWidth: 1000
})

const TitleInput = styled('input')(
  {
    flex: '1 1 auto',
    height: 80,
    fontSize: 48,
    border: 'none',
    outline: 'none',
    background: 'none',
    fontWeight: 600,
    paddingRight: 20,
    textTransform: 'uppercase',
    textAlign: 'left',
    width: '100%'
  },
  ({ theme }) => ({
    color: theme.gray.dark,
    '&::placeholder': {
      color: theme.gray.extraLight
    },
    '&:focus': {
      color: theme.gray.extraDark
    }
  })
)

const ButtonColumn = styled('div')({
  display: 'flex',
  alignItems: 'center',
  paddingRight: 30
})
