import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'
import { CardWrapper, Positioner, Perspective, Flipper } from './DraggableCard'
import { css } from 'emotion'
// import Markdown from './Markdown'

const scrollableCSS = css({overflow: 'auto'})

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
    const cardFront = card.ftype === 'i' ? <CardImg src={card.front} /> : card.front
    const cardBack = card.btype === 'i' ? <CardImg src={card.back} /> : card.back
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
                <CardWrapper isImage={card.ftype === 'i'} className={scrollableCSS}>
                  {cardFront}
                </CardWrapper>
                <CardWrapper
                   isImage={card.btype === 'i'}
                  className={scrollableCSS}
                  style={{
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {cardBack}
                </CardWrapper>
              </Flipper>
            </Perspective>
          </Positioner>
        )}
      </Motion>
    ) : null
  }
}

const CardImage = styled('img')({
  maxWidth: '50vw',
  maxHeight: '45vh',
  borderRadius: 4,
  display: 'block',
  margin: 'auto'
}, ({theme}) => ({
  [theme.media.sm]: {
    maxWidth: '88vw',
    maxHeight: '55vh'
  }
}))

export class CardImg extends React.Component{
  render(){
    const { src } = this.props;
    return(
      <CardImage src={src} alt='' />
    )
  }
}
