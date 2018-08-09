import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'
import { getFontSize } from '../utilities'
import { CardImg } from './StaticCard'

const noop = () => {}

let gx, gy, gnx, gny

export default class ActiveCard extends React.Component {
  state = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    pWidth: 0,
    pHeight: 0,
    dragging: false,
    velocities: [],
    activeSide: 'front',
    exited: false
  }
  flip = () => {
    if(this.props.active){
      this.setState(state => ({
        activeSide: state.activeSide === 'front' ? 'back' : 'front'
      }))
    }
  }
  getOffscreenCoordinates = ({ xDistance, yDistance, pWidth, pHeight }) => {
    let offScreenX, offScreenY
    const ratio = Math.abs(xDistance) / Math.abs(yDistance)
    if (ratio > 0.5) {
      if (xDistance < 0) {
        offScreenX = pWidth * 1.3 * -1
      } else {
        offScreenX = pWidth * 1.3
      }
      offScreenY = (yDistance / xDistance) * offScreenX
    } else {
      if (yDistance < 0) {
        offScreenY = pHeight * -1
      } else {
        offScreenY = pHeight
      }
      offScreenX = (xDistance / yDistance) * offScreenY
    }
    return { offScreenX, offScreenY }
  }
  startDrag = e => {
    // e.preventDefault()
    window.scrollTo(0, 1)
    const touch = e.touches[0]
    const pWidth = window.innerWidth
    const pHeight = window.innerHeight
    this.setState(
      ({ cWidth, cHeight }) => {
        const offsetX = (pWidth / 2 - touch.clientX) * -1
        const offsetY = (pHeight / 2 - touch.clientY) * -1
        gx = (pWidth / 2 - touch.clientX + offsetX) * -1
        gy = (pHeight / 2 - touch.clientY + offsetY) * -1
        return {
          startX: touch.clientX,
          startY: touch.clientY,
          offsetX,
          offsetY,
          x: (pWidth / 2 - touch.clientX + offsetX) * -1,
          y: (pHeight / 2 - touch.clientY + offsetY) * -1,
          velocities: [],
          pWidth,
          pHeight,
          startedDragging: true,
          exited: false
        }
      },
      () => {
        window.requestAnimationFrame(this.recordVelocity)
      }
    )
  }
  recordVelocity = () => {
    const velocity = Math.hypot(Math.abs(gx - gnx), Math.abs(gy - gny))
    if (!Number.isNaN(velocity)) {
      this.setState(state => ({
        velocities: [...state.velocities.slice(0, 3), velocity]
      }))
    }
    if (this.state.startedDragging || this.state.dragging) {
      window.requestAnimationFrame(this.recordVelocity)
    }
  }
  drag = e => {
    // e.preventDefault()
    const touch = e.touches[0]
    this.setState(
      ({
        pWidth,
        pHeight,
        x,
        y,
        offsetX,
        offsetY,
        dragging,
        startedDragging
      }) => {
        const nextX = (pWidth / 2 - touch.clientX + offsetX) * -1
        const nextY = (pHeight / 2 - touch.clientY + offsetY) * -1
        gx = x
        gy = y
        gnx = nextX
        gny = nextY
        return {
          x: nextX,
          y: nextY,
          touchX: touch.clientX,
          touchY: touch.clientY,
          startedDragging: false,
          dragging: true
        }
      }
    )
  }
  stopDrag = e => {
    // e.preventDefault()
    if (!this.state.dragging) {
      if (this.props.flippable) {
        this.flip()
      }
    } else {
      let exited = false
      const {
        startX,
        startY,
        touchX,
        touchY,
        pWidth,
        pHeight,
        velocities
      } = this.state
      const minimumVelocity = 30
      const averageVelocity =
        velocities.reduce((av, v) => av + v, 0) / velocities.length
      const exceedsMinimumVelocity = averageVelocity > minimumVelocity
      const distanceTraveled = Math.hypot(
        Math.abs(startX - touchX),
        Math.abs(startY - touchY)
      )
      const minimumDistance = this.state.pWidth / 2.5
      const traveledMinimumDistance = distanceTraveled > minimumDistance
      if (traveledMinimumDistance || exceedsMinimumVelocity) {
        exited = true
        this.props.onExited()
      }
      const { offScreenX, offScreenY } = this.getOffscreenCoordinates({
        xDistance: touchX - startX,
        yDistance: touchY - startY,
        pWidth,
        pHeight
      })
      this.setState({
        dragging: false,
        startedDragging: false,
        exited,
        offScreenX,
        offScreenY
      })
    }
  }
  render() {
    const { card, offset, shouldRender, active, flippable } = this.props
    const cardFront = card.ftype === 'i' ? <CardImg src={card.front} alt={card.falt}/> : card.front
    const cardBack = card.btype === 'i' ? <CardImg src={card.back} alt={card.balt}/> : card.back
    return shouldRender ? (
      <React.Fragment>
        <Motion
          defaultStyle={{
            x: 0,
            y: 0 - 10 * (offset - 1),
            rotate: 0,
            scale: 1 - 0.02 * offset
          }}
          style={{
            x: spring(
              this.state.dragging
                ? this.state.x
                : this.state.exited
                  ? this.state.offScreenX
                  : 0
            ),
            y: spring(
              this.state.dragging
                ? this.state.y
                : this.state.exited
                  ? this.state.offScreenY
                  : 0 - 10 * offset
            ),
            rotate: spring(this.state.activeSide === 'front' ? 0 : 180),
            scale: spring(1 - 0.02 * (offset + 1))
          }}
        >
          {({ x, y, rotate, scale }) => (
            <Positioner
              style={{
                transform: `translate(${
                  this.state.dragging ? this.state.x : x
                }px, ${
                  this.state.dragging ? this.state.y : y
                }px) scale(${scale})`
              }}
            >
              <Perspective>
                <Flipper
                  style={{
                    transform: `rotateY(${rotate}deg)`
                  }}
                >
                  <CardWrapper
                    isImage={card.ftype === 'i'}
                    innerRef={r => {
                      this.card = r
                    }}
                    onTouchStart={active ? this.startDrag : noop}
                    onTouchEnd={active ? this.stopDrag : noop}
                    onTouchMove={active ? this.drag : noop}
                    style={{
                      fontSize: getFontSize(card.front)
                    }}
                  >
                    {cardFront}
                  </CardWrapper>
                  {flippable && (
                    <CardWrapper
                      isImage={card.ftype === 'i'}
                      style={{
                        transform: 'rotateY(180deg)',
                        fontSize: getFontSize(card.back)
                      }}
                      onTouchStart={active ? this.startDrag : noop}
                      onTouchEnd={active ? this.stopDrag : noop}
                      onTouchMove={active ? this.drag : noop}
                    >
                      {cardBack}
                    </CardWrapper>
                  )}
                </Flipper>
              </Perspective>
            </Positioner>
          )}
        </Motion>
      </React.Fragment>
    ) : null
  }
}

export const CardWrapper = styled('div')(
  {
    padding: 30,
    background: '#fff',
    borderRadius: 5,
    width: '60vw',
    maxWidth: '95vw',
    height: '50vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '5vh',
    position: 'absolute',
    left: '-30vw',
    top: '-25vh',
    textAlign: 'center',
    userSelect: 'none',
    backfaceVisibility: 'hidden',
    '-webkit-backface-visibility': 'hidden',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    willChange: 'transform',
    '& img': {
      maxWidth: '55vw',
      maxHeight: '45vh',
      borderRadius: 4,
      display: 'block',
      margin: 'auto'
    },
    '& p': {
      marginTop: '1vh',
      marginBottom: '1vh',
      wordBreak: 'break-word'
    },
    '@media screen and (min-color-index:0) and(-webkit-min-device-pixel-ratio:0)': {
      '@media': {
        '-webkit-transform': 'translate3d(0,0,0)'
       }
    }
    // paddingBottom: 'calc(7vh + 30px)'
  },
  ({ theme }) => ({
    boxShadow: theme.shadows.high,
    borderTop: `1px solid ${theme.gray.extraExtraLight}`,
    [theme.media.sm]: {
      width: '95vw',
      height: '60vh',
      left: '-47.5vw',
      top: '-30vh',
      '& img': {
        maxWidth: '88vw',
        maxHeight: '55vh'
      }
    }
  }),
  ({isImage}) => (
    isImage ? {
      padding: 0
    } : null
  )
)

export const Positioner = styled('div')({
  position: 'fixed',
  left: '50vw',
  top: '46vh',
  zIndex: 10,
  '@media screen and (min-color-index:0) and(-webkit-min-device-pixel-ratio:0)': {
    '@media': {
      top: '40vh'
     }
  }
})

export const Perspective = styled('div')({
  perspective: '150vh'
})

export const Flipper = styled('div')({
  transformStyle: 'preserve-3d'
})
