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
    velocities: [],
    activeSide: 'front',
    exited: false
  }
  flip = () => {
    this.setState(state => ({
      activeSide: state.activeSide === 'front' ? 'back' : 'front'
    }))
  }
  getOffscreenCoordinates = ({xDistance, yDistance, pWidth, pHeight}) => {
    let offScreenX, offScreenY;
    const ratio = Math.abs(xDistance) / Math.abs(yDistance);
    if(ratio > .5){
      if(xDistance < 0){
        offScreenX = (pWidth * 1.3) * -1
      }else{
        offScreenX = (pWidth * 1.3)
      }
      offScreenY = (yDistance / xDistance) * offScreenX
    }else{
      if(yDistance < 0){
        offScreenY = pHeight * -1
      }else{
        offScreenY = pHeight
      }
      offScreenX = (xDistance / yDistance) * offScreenY
    }
    return {offScreenX, offScreenY}
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
        velocities: [],
        pWidth,
        pHeight,
        startedDragging: true,
        exited: false
      }
    })
  }
  drag = e => {
    // e.preventDefault()
    const touch = e.touches[0];
    this.setState(
      ({
        pWidth,
        pHeight,
        x,
        y,
        offsetX,
        offsetY,
        dragging,
        startedDragging,
        velocities
      }) => {
        const nextX = (pWidth / 2 - touch.clientX + offsetX) * -1
        const nextY = (pHeight / 2 - touch.clientY + offsetY) * -1
        const velocity = Math.hypot(
          Math.abs(x - nextX),
          Math.abs(y - nextY)
        )
        return {
          x: nextX,
          y: nextY,
          touchX: touch.clientX,
          touchY: touch.clientY,
          velocities: [...velocities.slice(0, 5), velocity],
          startedDragging: false,
          dragging: true
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
      let exited = false;
      const { startX, startY, touchX, touchY, pWidth, pHeight, velocities } = this.state;
      const minimumVelocity = 10;
      const averageVelocity = velocities.reduce((av, v)=>av+v, 0) / velocities.length
      const exceedsMinimumVelocity = averageVelocity > minimumVelocity;
      const distanceTraveled = Math.hypot(
        Math.abs(startX - touchX),
        Math.abs(startY - touchY)
      )
      const minimumDistance = this.state.pWidth / 2.5;
      const traveledMinimumDistance = distanceTraveled > minimumDistance;
      if (traveledMinimumDistance || exceedsMinimumVelocity) {
        exited = true;
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
    return shouldRender ? (
      <React.Fragment>
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
                : this.state.exited ? this.state.offScreenX : 0
            ),
            y: spring(this.state.dragging ? this.state.y : this.state.exited ? this.state.offScreenY : 0 - 10 * offset),
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
