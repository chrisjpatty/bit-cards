import React from 'react'
import styled from 'react-emotion'

const StyledButton = styled('button')({
  background: '#fff',
  fontSize: 14,
  transition: 'box-shadow 200ms',
  textTransform: 'uppercase',
  border: 'none',
  padding: '5px 10px',
  borderRadius: 10,
  outline: 'none',
  whiteSpace: 'nowrap',
  margin: '0px 5px',
  userSelect: 'none',
  '&:first-child': {
    marginLeft: 0
  },
  '&:last-child': {
    marginRight: 0
  }
}, ({theme}) => ({
  color: theme.gray.mediumLight,
  borderTop: `1px solid ${theme.gray.extraExtraLight}`,
  boxShadow: theme.shadows.low,
  '&:hover': {
    boxShadow: theme.shadows.mid
  },
  '&:active': {
    background: theme.gray.extraExtraLight
  },
  '&:focus': {
    background: theme.gray.extraExtraLight
  }
}))

export default class RoundButton extends React.Component{
  render(){
    const { children, ...restProps } = this.props;
    return(
      <StyledButton {...restProps}>
        {children}
      </StyledButton>
    )
  }
}
