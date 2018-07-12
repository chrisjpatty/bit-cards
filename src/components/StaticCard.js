import React from 'react'
// import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'
import { CardWrapper, Positioner, Flipper } from './DraggableCard'

export default class StaticCard extends React.Component {
  state = {
    pWidth: 100,
    pHeight: 100,
    activeSide: 'front'
  }
  componentDidMount = () => {
    this.setState({
      pWidth: window.innerWidth,
      pHeight: window.innerHeight
    })
  }
  flip = () => {
    this.setState(state => ({
      activeSide: state.activeSide === 'front' ? 'back' : 'front'
    }))
  }
  render() {
    const { card, offset, shouldRender, inStack } = this.props
    return shouldRender ? (
      <Motion
        defaultStyle={{
          x: !inStack ? this.state.pWidth : 0,
          y: 0 - 5 * (offset - 1)
        }}
        style={{
          x: spring(inStack ? 0 : this.state.pWidth),
          y: spring(0 - 5 * offset)
        }}
      >
        {({ x, y }) => (
          <Positioner>
            <CardWrapper
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              {card.front}
            </CardWrapper>
            {/* <CardWrapper
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              {card.back}
            </CardWrapper> */}
          </Positioner>
        )}
      </Motion>
    ) : null
  }
}
