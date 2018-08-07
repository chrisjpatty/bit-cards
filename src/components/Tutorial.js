import React from 'react'
import { Portal } from 'react-portal'
import styled from 'react-emotion'
import RoundButton from './RoundButton'
import { Motion, spring } from 'react-motion'

const stops = [
  {
    tip: 'Welcome to Bitcards!\n\nBitcards allows you to create beautiful, intuitive, and instantly shareable flash cards.',
    anchorId: 'tutorial-title-input',
    noHint: true,
    topOffset: -100,
  },
  {
    anchorId: 'tutorial-title-input',
    tip: 'Tap here to name your new deck.',
    hintTopOffset: 30
  },
  {
    anchorId: 'tutorial-global-settings',
    tip:
      'These settings apply to your whole deck. You can toggle background colors, make your cards one-sided, or swap the front and back of all your cards.',
    topOffset: 15,
    hintTopOffset: -10
  },
  {
    anchorId: 'tutorial-card-front-input',
    tip: 'Tap here to edit the front side of your first card.\n\nPro tip: Bitcards support emoji! 🎉🌈😍',
    topOffset: -200,
    leftOffset: 15,
    hintTopOffset: 50,
    hintLeftOffset: 100
  },
  {
    anchorId: 'tutorial-card-controls',
    tip:
      'Cards can have either text or images. Use these buttons to switch from text mode to image mode.',
    topOffset: 10,
    leftOffset: -10
  },
  {
    anchorId: 'tutorial-card-color-control',
    tip: 'Use this button to change the background color for this card.',
    topOffset: 10
  },
  {
    anchorId: 'tutorial-card-delete-swap',
    tip:
      'These buttons can be used to delete a card or swap the front and back sides.',
    topOffset: 15,
    hintTopOffset: -10
  },
  {
    anchorId: 'tutorial-add-card',
    tip: 'Use this button to add a new card.',
    topOffset: -170,
    hintTopOffset: 8,
    hintLeftOffset: 8
  },
  {
    anchorId: 'tutorial-play',
    tip:
      "When you're satisfied with your cards, click this button to start studying.\n\nDon't worry, you can always come back to edit or add more cards later.",
    topOffset: -250
  },
  {
    anchorId: 'tutorial-play',
    tip:
      'To save or share your cards all you need is the link to this page. All your cards are safely stored for you in the URL.\n\nWhen you\'re ready, tap "Exit Tutorial" to get started!',
    topOffset: -200,
    noHint: true
  }
]

const Wrapper = styled('div')({
  position: 'absolute',
  // width: '100%',
  // height: '100%',
  background: 'none',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  pointerEvents: 'none'
})

export const PulseTip = styled('div')(
  {
    position: 'absolute',
    width: '6vw',
    maxWidth: 50,
    height: '6vw',
    maxHeight: 50,
    borderRadius: '100%',
    animation: 'tutorial-pulse 1s infinite',
    pointerEvents: 'none'
  },
  ({ theme }) => ({
    background: theme.primary.color,
    opacity: 0.6
  })
)

export default class Tutorial extends React.Component {
  state = {
    activeIndex: 0,
    coordinates: { left: 200, top: 100 },
    screenDimensions: { width: 100, height: 100 }
  }
  componentDidMount = () => {
    this.setScreenDimension().then(this.setActiveCoordinates)
  }
  setScreenDimension = () =>
    new Promise(resolve => {
      const width = window.innerWidth
      const body = document.body
      const html = document.documentElement
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
      this.setState(
        {
          screenDimensions: {
            width,
            height
          }
        },
        resolve
      )
    })
  getTipDimensions = () => {
    const { width, height } = this.tipWrapper.getBoundingClientRect()
    return { width, height }
  }
  setActiveCoordinates = () => {
    const activeStop = stops[this.state.activeIndex]
    const { width: sWidth, height: sHeight } = this.state.screenDimensions
    const scrollTop = window.scrollY
    const { width: tWidth, height: tHeight } = this.getTipDimensions()
    const activeElement = document.getElementById(activeStop.anchorId)
    const { left, bottom, top } = activeElement.getBoundingClientRect()
    const position = window
      .getComputedStyle(activeElement)
      .getPropertyValue('position')
    const isFixed = position === 'fixed'
    const leftPlusOffset = left + (activeStop.leftOffset || 0)
    const right = leftPlusOffset + tWidth + 30
    const calculatedLeft =
      right > sWidth ? (sWidth - 30 < tWidth) ? 10 : sWidth - tWidth - 30 : leftPlusOffset
    const topPlusOffset =
      bottom + (activeStop.topOffset || 0) + (isFixed ? 0 : scrollTop)
    const screenHeight = isFixed ? window.innerHeight : sHeight
    const calculatedTop =
      topPlusOffset + tHeight + 30 > screenHeight
        ? screenHeight - tHeight - 30
        : topPlusOffset
    this.setState({
      coordinates: {
        left: calculatedLeft,
        top: calculatedTop,
        hintTop:
          top + (activeStop.hintTopOffset || 0) + (isFixed ? 0 : scrollTop),
        hintLeft: left + (activeStop.hintLeftOffset || 0),
        position: position === 'fixed' ? 'fixed' : 'absolute'
      }
    })

    if (calculatedTop + tHeight + 20 > window.innerHeight && !isFixed) {
      window.scrollTo({
        top: calculatedTop - 100,
        behavior: 'smooth'
      })
    } else if (calculatedTop < scrollTop && !isFixed) {
      window.scrollTo({
        top: calculatedTop - 100,
        behavior: 'smooth'
      })
    }
  }
  incrementIndex = () => {
    this.setState(
      ({ activeIndex }) => ({
        activeIndex: activeIndex + 1
      }),
      () => {
        this.setActiveCoordinates()
      }
    )
  }
  decrementIndex = () => {
    this.setState(
      ({ activeIndex }) => ({
        activeIndex: activeIndex - 1
      }),
      () => {
        this.setActiveCoordinates()
      }
    )
  }
  exit = () => {
    this.props.onExitRequested()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  render() {
    const activeStop = stops[this.state.activeIndex]
    return (
      <Portal>
        <Wrapper>
          {!activeStop.noHint && (
            <PulseTip
              style={{
                left: this.state.coordinates.hintLeft,
                top: this.state.coordinates.hintTop,
                position: this.state.coordinates.position
              }}
            />
          )}
          <TipBox
            innerRef={ref => {
              this.tipWrapper = ref
            }}
            tip={activeStop.tip}
            isFirst={this.state.activeIndex === 0}
            isLast={this.state.activeIndex === stops.length - 1}
            coordinates={this.state.coordinates}
            increment={this.incrementIndex}
            decrement={this.decrementIndex}
            exit={this.exit}
          />
        </Wrapper>
      </Portal>
    )
  }
}

class TipBox extends React.Component {
  render() {
    const {
      tip,
      coordinates,
      increment,
      decrement,
      exit,
      isFirst,
      isLast,
      innerRef
    } = this.props
    return (
      <Motion
        defaultStyle={{ left: 200, top: 100 }}
        style={{
          left: spring(coordinates.left),
          top: spring(coordinates.top)
        }}
      >
        {({ left, top }) => (
          <TipBoxWrapper
            innerRef={innerRef}
            style={{ left, top, position: coordinates.position }}
          >
            <TipWrapper>{tip}</TipWrapper>
            <Navigation>
              {!isFirst && (
                <RoundButton onClick={decrement}>Previous</RoundButton>
              )}
              <AlignRight>
                <RoundButton primary={isLast} onClick={exit}>
                  Exit Tutorial
                </RoundButton>
                {!isLast && (
                  <RoundButton primary onClick={increment}>
                    Next Stop
                  </RoundButton>
                )}
              </AlignRight>
            </Navigation>
          </TipBoxWrapper>
        )}
      </Motion>
    )
  }
}

const AlignRight = styled('div')({
  marginLeft: 'auto'
})

const TipBoxWrapper = styled('div')(
  {
    // width: '100%',
    willChange: 'left, top',
    pointerEvents: 'auto',
    position: 'absolute',
    left: 200,
    top: 100,
    width: 340,
    padding: 10,
    background: '#fff',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  ({ theme }) => ({
    boxShadow: theme.shadows.high
  })
)

const TipWrapper = styled('p')({
  margin: 0,
  whiteSpace: 'pre-wrap'
})

const Navigation = styled('nav')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: 5,
  marginTop: 10
})
