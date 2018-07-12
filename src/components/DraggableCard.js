import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'

const noop = () => {}

export default class ActiveCard extends React.Component {
  state = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    pWidth: 0,
    pHeight: 0,
    dragging: false,
    draggedLeft: false,
    draggedRight: false,
    activeSide: 'front'
  }
  flip = () => {
    this.setState(state => ({
      activeSide: state.activeSide === 'front' ? 'back' : 'front'
    }))
  }
  startDrag = e => {
    // e.preventDefault()
    window.scrollTo(0, 1)
    const touch = e.touches[0]
    const pWidth = window.innerWidth
    const pHeight = window.innerHeight
    this.setState(({ cWidth, cHeight }) => {
      const offsetX = (pWidth / 2 - touch.clientX) * -1
      const offsetY = (pHeight / 2 - touch.clientY) * -1
      return {
        startX: touch.clientX,
        startY: touch.clientY,
        offsetX,
        offsetY,
        x: (pWidth / 2 - touch.clientX + offsetX) * -1,
        y: (pHeight / 2 - touch.clientY + offsetY) * -1,
        pWidth,
        pHeight,
        leftThreshold: pWidth / 5,
        rightThreshold: pWidth - pWidth / 5,
        startedDragging: true
      }
    })
  }
  drag = e => {
    // e.preventDefault()
    const touch = e.touches[0]
    const distanceTraveled = Math.abs(this.state.startX - touch.clientX)
    const draggedLeft =
      touch.clientX < this.state.leftThreshold &&
      distanceTraveled > this.state.leftThreshold
    const draggedRight =
      touch.clientX > this.state.rightThreshold &&
      distanceTraveled > this.state.leftThreshold
    this.setState(
      ({
        pWidth,
        pHeight,
        offsetX,
        offsetY,
        leftThreshold,
        rightThreshold,
        dragging,
        startedDragging
      }) => {
        const x = (pWidth / 2 - touch.clientX + offsetX) * -1
        const y = (pHeight / 2 - touch.clientY + offsetY) * -1
        return {
          x,
          y,
          startedDragging: false,
          dragging: true,
          draggedLeft,
          draggedRight
        }
      }
    )
  }
  stopDrag = e => {
    // e.preventDefault()
    if (!this.state.dragging) {
      if(this.props.flippable){
        this.flip()
      }
    } else {
      if (this.state.draggedLeft || this.state.draggedRight) {
        this.props.onExited()
      }
      this.setState({
        dragging: false,
        startedDragging: false
      })
    }
  }
  render() {
    const { card, offset, shouldRender, active, flippable } = this.props
    return shouldRender ? (
      <Motion
        defaultStyle={{
          x: 0,
          y: 0 - 10 * (offset - 1),
          rotate: 0,
          scale: 1 - 0.02 * (offset)
        }}
        style={{
          x: spring(
            this.state.dragging
              ? this.state.x
              : this.state.draggedLeft
                ? this.state.pWidth * -2
                : this.state.draggedRight
                  ? this.state.pWidth * 2
                  : 0
          ),
          y: spring(this.state.dragging ? this.state.y : 0 - 10 * offset),
          rotate: spring(this.state.activeSide === 'front' ? 0 : 180),
          scale: spring(1 - 0.02 * (offset + 1))
        }}
      >
        {({ x, y, rotate, scale }) => (
          <Positioner
            style={{
              transform: `translate(${
                this.state.dragging ? this.state.x : x
              }px, ${this.state.dragging ? this.state.y : y}px) scale(${scale})`
            }}
          >
            <Perspective>
              <Flipper
                style={{
                  transform: `rotateY(${rotate}deg)`
                }}
              >
                <CardWrapper
                  innerRef={r => {
                    this.card = r
                  }}
                  onTouchStart={active ? this.startDrag : noop}
                  onTouchEnd={active ? this.stopDrag : noop}
                  onTouchMove={active ? this.drag : noop}
                >
                  {card.front}
                </CardWrapper>
                {
                  flippable &&
                  <CardWrapper
                    style={{
                      transform: 'rotateY(180deg)'
                    }}
                    onTouchStart={active ? this.startDrag : noop}
                    onTouchEnd={active ? this.stopDrag : noop}
                    onTouchMove={active ? this.drag : noop}
                  >
                    {card.back}
                  </CardWrapper>
                }
              </Flipper>
            </Perspective>
          </Positioner>
        )}
      </Motion>
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
    backfaceVisibility: 'hidden'
    // paddingBottom: 'calc(7vh + 30px)'
  },
  ({ theme }) => ({
    boxShadow: theme.shadows.high,
    borderTop: `1px solid ${theme.gray.extraExtraLight}`,
    [theme.media.sm]: {
      width: '95vw',
      height: '60vh',
      left: '-47.5vw',
      top: '-30vh'
    }
  })
)

export const Positioner = styled('div')({
  position: 'fixed',
  left: '50vw',
  top: '46vh',
  zIndex: 10
})

export const Perspective = styled('div')({
  perspective: '150vh'
})

export const Flipper = styled('div')({
  transformStyle: 'preserve-3d'
})
