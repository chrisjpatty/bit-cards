import React from 'react'
import styled from 'react-emotion'

export default class TitleEditor extends React.Component {
  setTitle = e => {
    this.props.onChange(e.target.value)
  }
  select = () => {
    this.input.select()
  }
  render() {
    const { title } = this.props
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
      </TitleWrapper>
    )
  }
}

const TitleWrapper = styled('div')({
  width: '100%',
  maxWidth: 900
})

const TitleInput = styled('input')(
  {
    width: '100%',
    height: 80,
    fontSize: 48,
    border: 'none',
    outline: 'none',
    background: 'none',
    fontWeight: 600,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  ({ theme }) => ({
    color: theme.gray.dark,
    '&:focus': {
      color: theme.gray.extraDark
    }
  })
)
