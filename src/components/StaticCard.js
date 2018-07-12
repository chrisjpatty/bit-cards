import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'
import { CardWrapper, Positioner, Perspective, Flipper } from './DraggableCard'

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
  static getDerivedStateFromProps = (props, state) => {
    if(props.shouldRender === false && state.activeSide === 'back'){
      return {
        activeSide: 'front'
      }
    }else{
      return null;
    }
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
          y: 0 - 10 * (offset - 1),
          rotate: 0,
          scale: 1 - .01 * (offset - 1)
        }}
        style={{
          x: spring(inStack ? 0 : this.state.pWidth),
          y: spring(0 - 10 * offset),
          rotate: spring(this.state.activeSide === 'front' ? 0 : 180),
          scale: spring(1 - .01 * offset)
        }}
      >
        {({ x, y, rotate, scale }) => (
          <Positioner
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`
            }}
          >
            <Perspective>
              <Flipper style={{
                transform: `rotateY(${rotate}deg)`
              }}>
                <CardWrapper>
                  {card.front}
                </CardWrapper>
                <CardWrapper
                  style={{
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {card.back}
                </CardWrapper>
              </Flipper>
            </Perspective>
          </Positioner>
        )}
      </Motion>
    ) : null
  }
}
