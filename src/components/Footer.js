import React from 'react'
import styled from 'react-emotion'

export default () => (
  <Footer>© Christopher Patty 2018</Footer>
)

const Footer = styled('footer')({
  padding: '3vw',
  width: '100%'
}, ({theme}) => ({
  color: theme.gray.light
}))
