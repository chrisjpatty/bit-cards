import React from 'react'
import { connect } from 'react-redux'
import { encode } from '../utilities'
import debounce from 'lodash/debounce'
import { history } from '../index'
import Page from '../components/Page'
import TitleEditor from '../components/TitleEditor'
import Cards from '../components/Cards'
import FOB from '../components/FOB'
import {PlayIcon} from '../Icons'

const cardTemplate = {
  front: "",
  back: "",
  color: 1
}

class Edit extends React.Component{
  componentWillUnmount = () => {
    if(this.runningWorker && this.runningWorker.cancel){
      this.runningWorker.cancel()
    }
    this.setEncodedValue(this.props.value)
  }
  runningWorker = null;
  setEncodedValue = value => {
    if(this.runningWorker && this.runningWorker.cancel){
      this.runningWorker.cancel()
    }
    this.runningWorker = encode(value).then(encoded => {
      history.replace({pathname: history.location.pathname, search: `?${encoded}`})
      this.runningWorker = null;
    })
  }
  setDebouncedEncodedValue = debounce(this.setEncodedValue, 300)
  setGlobalValue = callback => {
    const value = callback(this.props.value)
    this.props.dispatch({
      type: 'SET_VALUE',
      value
    })
    this.setDebouncedEncodedValue(value)
  }
  setTitle = title => {
    this.setGlobalValue(value => ({
      ...value,
      title
    }))
  }
  setCards = cards => {
    this.setGlobalValue(value => ({
      ...value,
      cards
    }))
  }
  addCard = () => {
    this.setGlobalValue(value => ({
      ...value,
      cards: [
        ...value.cards,
        {...cardTemplate}
      ]
    }))
  }
  swapSides = () => {
    this.setGlobalValue(value => ({
      ...value,
      cards: value.cards.map(card => ({
        ...card,
        front: card.back,
        back: card.front
      }))
    }))
  }
  playCards = () => {
    this.props.history.push({
      pathname: '/play',
      search: this.props.location.search
    })
  }
  render(){
    const { cards, title } = this.props.value
    return(
      <Page>
        <TitleEditor title={title} onChange={this.setTitle} swapSides={this.swapSides} />
        <Cards cards={cards} onChange={this.setCards} addCard={this.addCard} />
        <FOB onClick={this.playCards}>
          <PlayIcon/>
        </FOB>
      </Page>
    )
  }
}
export default connect(
  state => ({
    value: state.app.value
  })
)(Edit)
