import React from 'react'
import styled from 'react-emotion'

const ButtonWrapper = styled('button')(
  {
    width: 60,
    height: 60,
    borderRadius: '100%',
    position: 'fixed',
    right: 30,
    bottom: 30,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 16,
    paddingBottom: 11,
    outline: 'none',
    transition: 'transform 250ms',
    '& svg': {
      width: '100%'
    }
  },
  ({ theme }) => ({
    background: theme.success.color,
    color: theme.primary.textOn,
    boxShadow: theme.shadows.high,
    '&:hover': {
      background: theme.success.light,
      transform: 'scale(1.1)'
    },
    '&:focus': {
      background: theme.success.light
    }
  }),
  ({ cssFunction, theme }) =>
    typeof cssFunction === 'function' ? cssFunction(theme) : null
)

export default class FOB extends React.Component {
  render() {
    const { children, cssFunction, ...restProps } = this.props
    return (
      <ButtonWrapper cssFunction={cssFunction} {...restProps}>
        {children}
      </ButtonWrapper>
    )
  }
}
