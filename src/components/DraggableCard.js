import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'

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
  exited = false
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
    if (this.state.draggedLeft || this.state.draggedRight) {
      this.props.onExited()
      this.exited = true
    }
    this.setState({
      dragging: false,
      startedDragging: false
    })
  }
  render() {
    const { card, offset, shouldRender } = this.props
    return (
      shouldRender ?
      <Motion
        defaultStyle={{ x: 0, y: 0 - 5 * (offset - 1) }}
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
          y: spring(this.state.dragging ? this.state.y : 0 - 5 * offset)
        }}
      >
        {({ x, y }) => (
          <Positioner>
            <CardWrapper
              style={{
                transform: `translate(${
                  this.state.dragging ? this.state.x : x
                }px, ${this.state.dragging ? this.state.y : y}px)`
              }}
              innerRef={r => {
                this.card = r
              }}
              onTouchStart={this.startDrag}
              onTouchEnd={this.stopDrag}
              onTouchMove={this.drag}
            >
              {card[this.state.activeSide]}
            </CardWrapper>
          </Positioner>
        )}
      </Motion>
      : null
    )
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
    textAlign: 'center',
    userSelect: 'none',
    position: 'fixed',
    left: '20vw',
    top: '20vh',
    zIndex: 10
    // paddingBottom: 'calc(7vh + 30px)'
  },
  ({ theme }) => ({
    boxShadow: theme.shadows.high,
    borderTop: `1px solid ${theme.gray.extraExtraLight}`,
    [theme.media.sm]: {
      width: '95vw',
      height: '60vh',
      left: '2.5vw',
      top: '12vh'
    }
  })
)

export const Positioner = styled('div')(

)
