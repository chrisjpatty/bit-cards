import React from 'react'
import styled from 'react-emotion'
import { TapIcon, SwipeIcon } from '../Icons'

const Wrapper = styled('div')({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: 10
})

const Row = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center'
}, ({theme}) => ({
  color: theme.gray.light,
  '& svg': {
    width: '30%',
    fill: theme.gray.light
  }
}))

const Text = styled('p')({
  fontSize: '1.8rem',
  padding: 0,
  margin: 0,
  marginBottom: '5vh'
}, ({theme}) => ({
  color: theme.gray.light
}))

export const Front = () => (
  <Wrapper>
    <Row>
      <Text>
        Tap to flip the card
      </Text>
      <TapIcon/>
    </Row>
  </Wrapper>
)

export const Back = () => (
  <Wrapper>
    <Row>
      <Text>
        Swipe left or right to advance
      </Text>
      <SwipeIcon/>
    </Row>
  </Wrapper>
)
