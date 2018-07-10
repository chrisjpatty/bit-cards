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
  outline: 'none'
}, ({theme}) => ({
  color: theme.gray.mediumLight,
  borderTop: `1px solid ${theme.gray.extraExtraLight}`,
  boxShadow: theme.shadows.low,
  '&:hover': {
    boxShadow: theme.shadows.mid
  },
  '&:active': {
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
