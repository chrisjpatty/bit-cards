import React from 'react'
import styled from 'react-emotion'
import RoundButton from './RoundButton'

export default class TitleEditor extends React.Component {
  setTitle = e => {
    this.props.onChange(e.target.value)
  }
  select = () => {
    this.input.select()
  }
  render() {
    const { title, swapSides } = this.props
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
          <RoundButton onClick={swapSides}>
            Swap Sides
          </RoundButton>
        </ButtonColumn>
      </TitleWrapper>
    )
  }
}

const TitleWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  maxWidth: 1000
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
    paddingLeft: 20,
    textTransform: 'uppercase',
    textAlign: 'left'
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
