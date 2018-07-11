import React from 'react'
import { connect } from 'react-redux'
import Page from '../components/Page'
import styled from 'react-emotion'
import { css } from 'emotion'
import FOB from '../components/FOB'
import ActiveCard from '../components/ActiveCard'
import CircularButton from '../components/CircularButton'
import { COLORS } from '../components/ColorPicker'

const StopIcon = styled('div')({
  pointerEvents: 'none',
  display: 'flex',
  width: 30,
  height: 30,
  background: '#fff',
  borderRadius: 4
})

const FlipButtonStyles = css({
  position: 'fixed',
  bottom: 30,
  left: 'calc(50% - 40px)',
  fontSize: 20,
  textTransform: 'uppercase'
})

const PrevButtonStyles = css({
  position: 'fixed',
  width: 50,
  height: 50,
  bottom: 45,
  left: 'calc(50% - 100px)',
  fontSize: 20,
  textTransform: 'uppercase'
})

const NextButtonStyles = css({
  position: 'fixed',
  width: 50,
  height: 50,
  bottom: 45,
  left: 'calc(50% + 50px)',
  fontSize: 20,
  textTransform: 'uppercase'
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

class Play extends React.Component{
  state = {
    activeIndex: 0,
    activeSide: 'front'
  }
  stopPlaying = () => {
    this.props.history.push({
      pathname: '/edit',
      hash: this.props.location.hash
    })
  }
  flipCard = () => {
    this.setState(state => ({
      activeSide: state.activeSide === 'front' ? 'back' : 'front'
    }))
  }
  decrementActiveIndex = () => {
    this.setState(state => ({
      activeIndex: state.activeIndex === 0 ? this.props.value.cards.length - 1 : state.activeIndex - 1,
      activeSide: 'front'
    }))
  }
  incrementActiveIndex = () => {
    this.setState(state => ({
      activeIndex: state.activeIndex === this.props.value.cards.length - 1 ? 0 : state.activeIndex + 1,
      activeSide: 'front'
    }))
  }
  render(){
    const { enableColors, doubleSided } = this.props;
    const { cards, title } = this.props.value;
    return(
      <Page>
        <ActiveCard card={cards[this.state.activeIndex]} activeSide={this.state.activeSide} />
        <FOB cssFunction={theme => ({
          background: theme.danger.color,
          padding: 10,
          '&:hover': {
            background: theme.danger.light
          }
        })} onClick={this.stopPlaying}>
          <StopIcon/>
        </FOB>
        <CircularButton
          className={PrevButtonStyles}
          onClick={this.decrementActiveIndex}
        >
          {`<`}
        </CircularButton>
        {
          doubleSided &&
          <CircularButton
            className={FlipButtonStyles}
            onClick={this.flipCard}
          >
            Flip
          </CircularButton>
        }
        <CircularButton
          className={NextButtonStyles}
          onClick={this.incrementActiveIndex}
        >
          {`>`}
        </CircularButton>
        {
          enableColors &&
          <Background style={{
            background: COLORS[cards[this.state.activeIndex].color].color
          }} />
        }
      </Page>
    )
  }
}
export default connect(
  state => ({
    value: state.app.value,
    enableColors: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2
  })
)(Play)
