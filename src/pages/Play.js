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
import { Front, Back } from '../components/InstructionCard'
import { Helmet } from "react-helmet"
import { RevertIcon, BackIcon, ForwardsIcon } from '../Icons'
import { Analytics } from '../index'
import shortid from 'shortid'

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
    fontWeight: 800,
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

const RevertButtonStyles = theme => (
  css({
    position: 'fixed',
    width: 100,
    height: 100,
    left: 'calc(50% - 50px)',
    top: 'calc(50% - 50px)',
    paddingTop: 8
  })
)

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
  color: 18
}

const instructionCard = {
  id: 'instructions',
  color: 17,
  front: <Front/>,
  back: <Back/>
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
const shuffleArray = rawArray => {
  const array = rawArray.slice();
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

class Play extends React.Component {
  state = {
    activeIndex: 0,
    cardKeys: this.props.cards.map(()=>shortid.generate()),
    instructionKey: shortid.generate()
  }
  cards = []
  componentDidMount = () => {
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    Analytics.set('/play')
    Analytics.pageview('/play')
  }
  componentWillUnmount = () => {
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    document.body.style.overflow = ''
    document.body.style.overscrollBehavior = ''
  }
  componentWillReceiveProps = nextProps => {
    if(this.props.cards !== nextProps.cards){
      this.setState({
        cardKeys: nextProps.cards.map(()=>shortid.generate())
      })
    }
  }
  stopPlaying = () => {
    this.props.history.push({
      pathname: '/edit',
      hash: this.props.location.hash
    })
    Analytics.event({
      category: 'Playing',
      action: 'Clicked the stop button'
    })
  }
  decrementActiveIndex = (_, callback) => {
    if (this.state.activeIndex > 0) {
      this.setState(state => ({
        activeIndex: state.activeIndex - 1
      }), callback)
    }
  }
  incrementActiveIndex = (offset = 0) => {
    if(this.state.activeIndex + 1 === this.props.cards.length){
      Analytics.event({
        category: 'Playing',
        action: 'Played an entire deck'
      })
    }
    if (this.state.activeIndex < this.props.cards.length + offset) {
      this.setState(state => ({
        activeIndex: state.activeIndex + 1
      }))
    }
  }
  revertDraggable = () => {
    this.decrementActiveIndex(null, () => {
      this.setState(state => ({
        cardKeys: [
          ...state.cardKeys.slice(0, this.state.activeIndex),
          shortid.generate(),
          ...state.cardKeys.slice(this.state.activeIndex + 1)
        ]
      }))
    })
  }
  restart = () => {
    this.setState(state => ({
      activeIndex: 0,
      cardKeys: this.props.cards.map(()=>shortid.generate()),
      instructionKey: shortid.generate()
    }))
    Analytics.event({
      category: 'Playing',
      action: 'Restarted a deck'
    })
  }
  flipCard = () => {
    this.activeCard.flip()
  }
  render() {
    const { enableColors, doubleSided, theme, cards, preferTouch, title } = this.props
    // const { title } = this.props.value;
    const activeCard =
      cards[cards.length - this.state.activeIndex - 1] || defaultCard
    return (
      <Page>
        <Helmet>
          <title>{`${title} | Bitcards – Beautiful. Simple. Flash Cards.`}</title>
          <meta name="theme-color" content="#000000"/>
        </Helmet>
        <CardsWrapper>
          {cards.map((card, i) => {
            const index = cards.length - i - 1
            const offset = Math.abs(this.state.activeIndex - index)
            return preferTouch ? (
              <DraggableCard
                ref={ref=>{this.cards[index] = ref}}
                active={this.state.activeIndex === index}
                card={card}
                onExited={this.incrementActiveIndex}
                shouldRender={
                  index > this.state.activeIndex - 3 &&
                  index < this.state.activeIndex + 3
                }
                flippable={doubleSided}
                offset={offset}
                // index={index}
                key={this.state.cardKeys[index] || i}
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
                key={this.state.cardKeys[index] || i}
              />
            )
          })}
          {
            preferTouch &&
            <DraggableCard
              active={this.state.activeIndex === 0}
              card={doubleSided ? instructionCard : {
                ...instructionCard,
                front: instructionCard.back
              }}
              onExited={()=>{}}
              flippable={doubleSided}
              shouldRender={
                0 > this.state.activeIndex - 3 &&
                0 < this.state.activeIndex + 3
              }
              offset={this.state.activeIndex}
              key={this.state.instructionKey}
            />
          }
        </CardsWrapper>
        <FOB
          cssFunction={theme => ({
            background: theme.danger.color,
            paddingLeft: 0,
            padding: 0,
            '&:hover': {
              background: theme.danger.light
            }
          })}
          aria-label='Stop'
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
              <BackIcon/>
            </CircularButton>
            {doubleSided && (
              <CircularButton
                className={FlipButtonStyles(theme)}
                onClick={this.state.activeIndex === cards.length ? this.restart : this.flipCard}
              >
                {
                  this.state.activeIndex === cards.length ?
                  <RevertIcon/>
                  :
                  'Flip'
                }
              </CircularButton>
            )}
            <CircularButton
              className={NextButtonStyles(theme)}
              onClick={() => {
                this.incrementActiveIndex(1)
              }}
              disabled={this.state.activeIndex === cards.length}
            >
              <ForwardsIcon/>
            </CircularButton>
          </React.Fragment>
        )}
        {
          preferTouch && this.state.activeIndex !== 0 &&
          <CircularButton
            className={PrevButtonStyles(theme)}
            onClick={this.revertDraggable}
          >
            <BackIcon/>
          </CircularButton>
        }
        {enableColors && (
          <Background
            style={{
              background: COLORS[activeCard.color].color
            }}
          />
        )}
        {
          preferTouch &&
          <CircularButton
            className={RevertButtonStyles(theme)}
            onClick={this.restart}
            disabled={this.state.activeIndex === 0}
          >
            <RevertIcon/>
          </CircularButton>
        }
      </Page>
    )
  }
}
export default compose(
  withTheme,
  connect(state => ({
    value: state.app.value,
    cards: state.app.value.shfl ? shuffleArray(state.app.value.cards) : state.app.value.cards.slice().reverse(),
    enableColors: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2,
    preferTouch: state.app.primaryInput === 'touch',
    title: state.app.value.title
  }))
)(Play)
