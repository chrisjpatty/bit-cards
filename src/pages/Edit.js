import React from 'react'
import { encode, decode } from '../utilities'
import debounce from 'lodash/debounce'
import { history } from '../index'
import Page from '../components/Page'
import TitleEditor from '../components/TitleEditor'
import Cards from '../components/Cards'

const cardTemplate = {
  front: "",
  back: "",
  color: 1
}

export default class Edit extends React.Component{
  state = {
    value: {
      title: "The Title of the Deck",
      cards: [
        {
          front: "A short phrase",
          back: "It's the back of the card that's here.",
          color: 1
        },
        {
          front: "A different card",
          back: "This is the back of the card",
          color: 2
        },
        {
          front: "The front of it",
          back: "An elephant lives on the back of the card.",
          color: 3
        },
        {
          front: "Here's the front",
          back: "How much data can we fit?",
          color: 4
        },
        {
          front: "This is in base64",
          back: "This is not however.",
          color: 5
        },
        {
          front: "Now, if we just save this?",
          back: "How big is the output?",
          color: 6
        },
      ]
    },
    encodedValue: ''
  }
  componentDidUpdate  = (_, prevState) => {
    if(this.state.value !== prevState.value){
      this.setDebouncedEncodedValue(this.state.value)
    }
  }
  componentWillUnmount = () => {
    if(this.runningWorker && this.runningWorker.cancel){
      this.runningWorker.cancel()
    }
    this.setEncodedValue(this.state.value)
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
  commitChange = value => {
    this.setState({value})
    this.setDebouncedEncodedValue(value)
  }
  setTitle = title => {
    this.setState(state => ({
      value: {
        ...state.value,
        title
      }
    }))
  }
  setCards = cards => {
    this.setState(state => ({
      value: {
        ...state.value,
        cards
      }
    }))
  }
  addCard = () => {
    this.setState(state => ({
      value: {
        ...state.value,
        cards: [
          ...state.value.cards,
          {...cardTemplate}
        ]
      }
    }))
  }
  render(){
    const { cards, title } = this.state.value
    return(
      <Page>
        <TitleEditor title={title} onChange={this.setTitle} />
        <Cards cards={cards} onChange={this.setCards} addCard={this.addCard} />
      </Page>
    )
  }
}
