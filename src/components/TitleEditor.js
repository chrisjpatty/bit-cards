import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import RoundButton from './RoundButton'
import { TutorialIcon } from '../Icons'
import Checkbox from './Checkbox'
import { PulseTip } from './Tutorial'

class TitleEditor extends React.Component {
  state = { isNewUser: false }
  componentDidMount = () => {
    const hasViewedTutorial = localStorage.getItem('hasViewedTutorial') ? true : false;
    if(!hasViewedTutorial){
      this.setState({isNewUser: true})
      localStorage.setItem('hasViewedTutorial', true)
    }
  }
  setTitle = e => {
    this.props.onChange(e.target.value)
  }
  select = () => {
    this.input.select()
  }
  startTutorial = () => {
    if(this.state.isNewUser){
      localStorage.setItem('hasViewedTutorial', true)
      this.setState({isNewUser: false})
    }
    this.props.startTutorial()
  }
  render() {
    const {
      title,
      swapSides,
      toggleColors,
      toggleDoubleSided,
      colorsEnabled,
      doubleSided,
    } = this.props
    return (
      <TitleWrapper>
        <InputRow>
          <TitleInput
            type="text"
            id='tutorial-title-input'
            innerRef={r => {
              this.input = r
            }}
            value={title}
            placeholder="Deck Title"
            onFocus={this.select}
            onChange={this.setTitle}
          />
          <TutorialButtonWrapper>
            {
              this.state.isNewUser &&
              <PulseTip style={{left: 0, top: 0, width: 30, height: 30}}/>
            }
            <RoundButton style={{padding: '4px 7px', marginBottom: 3}} onClick={this.startTutorial}>
              <FlexCenter><TutorialIcon/></FlexCenter>
            </RoundButton>
          </TutorialButtonWrapper>
        </InputRow>
        <ButtonRow id="tutorial-global-settings">
          <Checkbox checked={colorsEnabled} onChange={toggleColors}>Colors</Checkbox>
          <Checkbox checked={doubleSided} onChange={toggleDoubleSided}>Double Sided</Checkbox>
          {
            doubleSided &&
            <RoundButton onClick={swapSides}>Swap Sides</RoundButton>
          }
        </ButtonRow>
      </TitleWrapper>
    )
  }
}
export default compose(
  withRouter,
  connect(state => ({
    colorsEnabled: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2
  }))
)(TitleEditor)

const TutorialButtonWrapper = styled('div')({
  position: 'relative'
})

const FlexCenter = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

const TitleWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '5vw',
  paddingRight: '5vw',
  marginBottom: 20
  // maxWidth: 1000
})

const InputRow = styled('div')({
  flex: '1 1 auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  '& svg': {
    width: 26
  }
})

const TitleInput = styled('input')(
  {
    flex: '1 1 auto',
    height: 80,
    fontSize: 48,
    border: 'none',
    outline: 'none',
    background: 'none',
    fontWeight: 600,
    paddingRight: 20,
    textTransform: 'uppercase',
    textAlign: 'left',
    width: '100%'
  },
  ({ theme }) => ({
    color: theme.gray.dark,
    '&::placeholder': {
      color: theme.gray.extraLight
    },
    '&:focus': {
      color: theme.gray.extraDark
    },
    [theme.media.sm]: {
      paddingLeft: 0,
      fontSize: 38,
      paddingRight: 0
    }
  })
)

const ButtonRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  paddingRight: 30
}, ({theme}) => ({
  [theme.media.sm]: {
    maxWidth: '100vw',
    overflowX: 'auto',
    paddingLeft: 3,
    paddingBottom: 4
  }
}))
