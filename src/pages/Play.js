import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Page from '../components/Page'
import styled from 'react-emotion'
import { css } from 'emotion'
import FOB from '../components/FOB'
import DraggableCard from '../components/DraggableCard'
import StaticCard from '../components/StaticCard'
import CircularButton from '../components/CircularButton'
import { withTheme } from 'emotion-theming'
import { COLORS } from '../components/ColorPicker'

const StopIcon = styled('div')({
  pointerEvents: 'none',
  display: 'flex',
  width: 30,
  height: 30,
  background: '#fff',
  borderRadius: 4
})

const FlipButtonStyles = theme =>
  css({
    position: 'fixed',
    bottom: 30,
    left: 'calc(50% - 40px)',
    fontSize: 20,
    textTransform: 'uppercase',
    [theme.media.sm]: {
      width: 70,
      height: 70,
      left: 75,
      bottom: 14
    }
  })

const PrevButtonStyles = theme =>
  css({
    position: 'fixed',
    width: 50,
    height: 50,
    bottom: 45,
    left: 'calc(50% - 100px)',
    fontSize: 20,
    textTransform: 'uppercase',
    [theme.media.sm]: {
      left: 15,
      bottom: 24
    }
  })

const NextButtonStyles = theme =>
  css({
    position: 'fixed',
    width: 50,
    height: 50,
    bottom: 45,
    left: 'calc(50% + 50px)',
    fontSize: 20,
    textTransform: 'uppercase',
    [theme.media.sm]: {
      left: 155,
      bottom: 24
    }
  })

const Background = styled('div')({
  background: '#fff',
  transition: 'background 500ms',
  position: 'fixed',
  width: '120vw',
  height: '120vh',
  left: '-10vw',
  top: '-10vh',
  zIndex: -99
})

const CardsWrapper = styled('div')(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    minHeight: '80vh'
  },
  ({ theme }) => ({
    [theme.media.sm]: {
      minHeight: '100vh'
    }
  })
)

const defaultCard = {
  id: 'blank',
  color: 17
}

const Controls = styled('div')(
  ({ theme, hasTouch }) =>
    hasTouch
      ? {
          [theme.media.sm]: {
            display: 'none'
          }
        }
      : null
)

class Play extends React.Component {
  state = {
    activeIndex: 0
  }
  componentDidMount = () => {
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
  }
  componentWillUnmount = () => {
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    document.body.style.overflow = ''
    document.body.style.overscrollBehavior = ''
  }
  stopPlaying = () => {
    this.props.history.push({
      pathname: '/edit',
      hash: this.props.location.hash
    })
  }
  decrementActiveIndex = () => {
    if (this.state.activeIndex > 0) {
      this.setState(state => ({
        activeIndex: state.activeIndex - 1
      }))
    }
  }
  incrementActiveIndex = (offset = 0) => {
    if (this.state.activeIndex < this.props.cards.length - 1 + offset) {
      this.setState(state => ({
        activeIndex: state.activeIndex + 1
      }))
    }
  }
  flipCard = () => {
    this.activeCard.flip()
  }
  render() {
    const { enableColors, doubleSided, theme, cards, preferTouch } = this.props
    // const { title } = this.props.value;
    const activeCard =
      cards[cards.length - this.state.activeIndex - 1] || defaultCard
    return (
      <Page>
        <CardsWrapper>
          {cards.map((card, i) => {
            const index = cards.length - i - 1
            const offset = Math.abs(this.state.activeIndex - index)
            return preferTouch ? (
              <DraggableCard
                active={this.state.activeIndex === index}
                card={card}
                onExited={this.incrementActiveIndex}
                shouldRender={
                  index > this.state.activeIndex - 3 &&
                  index < this.state.activeIndex + 3
                }
                offset={offset}
                // index={index}
                key={card.id || i}
              />
            ) : (
              <StaticCard
                active={this.state.activeIndex === index}
                ref={r => {
                  if (this.state.activeIndex === index) {
                    this.activeCard = r
                  }
                }}
                card={card}
                shouldRender={
                  index > this.state.activeIndex - 3 &&
                  index < this.state.activeIndex + 3
                }
                inStack={index >= this.state.activeIndex}
                offset={offset}
                // index={index}
                key={card.id || i}
              />
            )
          })}
        </CardsWrapper>
        <FOB
          cssFunction={theme => ({
            background: theme.danger.color,
            padding: 10,
            '&:hover': {
              background: theme.danger.light
            }
          })}
          onClick={this.stopPlaying}
        >
          <StopIcon />
        </FOB>
        {!preferTouch && (
          <React.Fragment>
            <CircularButton
              className={PrevButtonStyles(theme)}
              onClick={this.decrementActiveIndex}
              disabled={this.state.activeIndex === 0}
            >
              {`<`}
            </CircularButton>
            {doubleSided && (
              <CircularButton
                className={FlipButtonStyles(theme)}
                onClick={this.flipCard}
              >
                Flip
              </CircularButton>
            )}
            <CircularButton
              className={NextButtonStyles(theme)}
              onClick={() => {
                this.incrementActiveIndex(1)
              }}
              disabled={this.state.activeIndex === cards.length}
            >
              {`>`}
            </CircularButton>
          </React.Fragment>
        )}
        {enableColors && (
          <Background
            style={{
              background: COLORS[activeCard.color].color
            }}
          />
        )}
      </Page>
    )
  }
}
export default compose(
  withTheme,
  connect(state => ({
    value: state.app.value,
    cards: state.app.value.cards.slice().reverse(),
    enableColors: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2,
    preferTouch: state.app.primaryInput === 'touch'
  }))
)(Play)
