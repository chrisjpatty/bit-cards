import React from 'react'
import styled from 'react-emotion'

const StyledWrapper = styled('label')(
  {
    background: '#fff',
    fontSize: 14,
    transition: 'box-shadow 200ms',
    textTransform: 'uppercase',
    border: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5px 10px',
    borderRadius: 10,
    outline: 'none',
    whiteSpace: 'nowrap',
    margin: '0px 5px',
    userSelect: 'none',
    paddingLeft: 5,
    '&:first-child': {
      marginLeft: 0
    },
    '&:last-child': {
      marginRight: 0
    }
  },
  ({ theme }) => ({
    color: theme.gray.mediumLight,
    borderTop: `1px solid ${theme.gray.extraExtraLight}`,
    boxShadow: theme.shadows.low,
    '&:hover': {
      boxShadow: theme.shadows.mid
    },
    '&:active': {
      background: theme.gray.extraExtraLight
    }
  }),
  ({theme, focused}) => (
    focused ? {
      boxShadow: theme.shadows.mid
    } : null
  )
)

const HiddenCheckbox = styled('input')({
  opacity: 0,
  width: 1,
  height: 1,
  background: 'transparent',
  border: 'none'
})

const StyledCheckboxLabel = styled('label')(
  {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 5,
    boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ({ theme }) => ({
    border: `1px solid ${theme.gray.extraExtraLight}`,
    '&:before': {
      content: '" "',
      width: 12,
      height: 12,
      borderRadius: 4,
      background: theme.gray.medium,
      transition: 'transform 150ms'
    }
  }),
  ({ checked }) => ({
    '&:before': {
      transform: `scale(${checked ? 1 : 0})`
    }
  })
)

export default class Checkbox extends React.Component {
  state = {focused: false}
  fieldId = Math.random()
    .toString(36)
    .substring(2, 15)
  onChange = e => {
    const checked = e.target.checked;
    this.props.onChange(checked)
  }
  focus = () => {
    this.setState({focused: true})
  }
  blur = () => {
    this.setState({focused: false})
  }
  render() {
    const { children, checked } = this.props
    return (
      <StyledWrapper focused={this.state.focused} htmlFor={this.fieldId}>
        <HiddenCheckbox
          checked={checked}
          onChange={this.onChange}
          onFocus={this.focus}
          onBlur={this.blur}
          id={this.fieldId}
          type="checkbox"
        />
        <StyledCheckboxLabel checked={checked} htmlFor={this.fieldId} />
        {children}
      </StyledWrapper>
    )
  }
}
