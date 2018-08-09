import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'
import { CardWrapper, Positioner, Perspective, Flipper } from './DraggableCard'
import { ImageError } from '../Icons'
import { css } from 'emotion'
// import Markdown from './Markdown'

const scrollableCSS = css({ overflow: 'auto' })

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
    if (props.shouldRender === false && state.activeSide === 'back') {
      return {
        activeSide: 'front'
      }
    } else {
      return null
    }
  }
  flip = () => {
    this.setState(state => ({
      activeSide: state.activeSide === 'front' ? 'back' : 'front'
    }))
  }
  getFontSize = string => {
    const numBreaks = string.split(/\n/).length
    if(string.length > 200 || numBreaks > 5){
      return '4vh'
    }
    if(string.length > 150 || numBreaks > 3){
      return '4.3vh'
    }
    if(string.length > 100){
      return '4.7vh'
    }
    if(string.length <= 3){
      return '10vh'
    }
    return ''
  }
  render() {
    const { card, offset, shouldRender, inStack, active } = this.props
    const cardFront =
      card.ftype === 'i' ? (
        <CardImg src={card.front} alt={card.falt} />
      ) : (
        card.front
      )
    const cardBack =
      card.btype === 'i' ? (
        <CardImg src={card.back} alt={card.balt} />
      ) : (
        card.back
      )
    const isOnFront = this.state.activeSide === 'front'
    return shouldRender ? (
      <Motion
        defaultStyle={{
          x: !inStack ? this.state.pWidth : 0,
          y: 0 - 10 * (offset - 1),
          rotate: 0,
          scale: 1 - 0.01 * (offset - 1)
        }}
        style={{
          x: spring(inStack ? 0 : this.state.pWidth),
          y: spring(0 - 10 * offset),
          rotate: spring(isOnFront ? 0 : 180),
          scale: spring(1 - 0.01 * offset)
        }}
      >
        {({ x, y, rotate, scale }) => (
          <Positioner
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`
            }}
          >
            <Perspective aria-hidden={!active}>
              <Flipper
                style={{
                  transform: `rotateY(${rotate}deg)`
                }}
              >
                <CardWrapper
                  aria-hidden={!isOnFront}
                  isImage={card.ftype === 'i'}
                  className={scrollableCSS}
                  style={card.ftype === 't' ? {
                    fontSize: this.getFontSize(card.front)
                  } : null}
                >
                  {cardFront}
                </CardWrapper>
                <CardWrapper
                  isImage={card.btype === 'i'}
                  className={scrollableCSS}
                  aria-hidden={isOnFront}
                  style={{
                    transform: 'rotateY(180deg)',
                    fontSize: card.ftype === 't' ? this.getFontSize(card.back) : ''
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

const CardImage = styled('img')(
  {
    maxWidth: '50vw',
    maxHeight: '45vh',
    borderRadius: 4,
    display: 'block',
    margin: 'auto'
  },
  ({ theme }) => ({
    [theme.media.sm]: {
      maxWidth: '88vw',
      maxHeight: '55vh'
    }
  })
)

const ErrorWrapper = styled('div')(
  {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      marginBottom: '2vh',
      height: '20vh'
    }
  },
  ({ theme }) => ({
    color: theme.gray.light
  })
)

export class CardImg extends React.Component {
  state = {
    error: false
  }
  setError = () => {
    this.setState({ error: true })
  }
  render() {
    const { src, alt } = this.props
    return this.state.error ? (
      <ErrorWrapper>
        <ImageError />
        <span>Image not found</span>
      </ErrorWrapper>
    ) : (
      <CardImage onError={this.setError} src={src} alt={alt} />
    )
  }
}
