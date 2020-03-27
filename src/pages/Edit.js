import React from 'react'
import { connect } from 'react-redux'
import { encode } from '../utilities'
import { css } from 'emotion'
import debounce from 'lodash/debounce'
import { history } from '../index'
import Page from '../components/Page'
import TitleEditor from '../components/TitleEditor'
import Cards from '../components/Cards'
import FOB from '../components/FOB'
import { PlayIcon } from '../Icons'
import Toast from '../components/Toast'
import RoundButton from '../components/RoundButton'
import Tutorial from '../components/Tutorial'
import { Helmet } from "react-helmet"
import Footer from '../components/Footer'
import { Analytics } from '../index'

export const cardTemplate = {
  ftype: 't',
  btype: 't',
  front: '',
  falt: '',
  balt: '',
  back: '',
  color: 6
}

class Edit extends React.Component {
  state = { tutorialOpen: false }
  componentDidMount = () => {
    Analytics.set('/edit')
    Analytics.pageview('/edit')
  }
  componentWillUnmount = () => {
    if (this.runningWorker && this.runningWorker.cancel) {
      this.runningWorker.cancel()
    }
    this.setEncodedValue(this.props.value)
  }
  runningWorker = null
  setEncodedValue = value => {
    if (this.runningWorker && this.runningWorker.cancel) {
      this.runningWorker.cancel()
    }
    this.runningWorker = encode(value).then(encoded => {
      history.push({
        pathname: history.location.pathname,
        hash: `#${encoded}`,
        state: {index: this.props.historyIndex + 1}
      })
      this.runningWorker = null
      this.incrementHistoryIndex()
    })
  }
  incrementHistoryIndex = () => {
    this.props.dispatch({ type: 'INCREMENT_HISTORY_INDEX' })
  }
  setDebouncedEncodedValue = debounce(this.setEncodedValue, 300)
  setGlobalValue = (callback, options={}) => {
    const { skipCache, updateCache, payload } = options;
    const value = callback(this.props.value, this.props.cache)
    let cache = null;
    if(updateCache){
      cache = updateCache(this.props.value, this.props.cache)
    }
    this.props.dispatch({
      type: 'SET_VALUE',
      value,
      cache: skipCache ? undefined : cache || value,
      payload
    })
    this.setDebouncedEncodedValue(value)
  }
  setTitle = title => {
    this.setGlobalValue(value => ({
      ...value,
      title
    }))
  }
  setCards = (cards, payload) => {
    this.setGlobalValue(value => ({
      ...value,
      cards
    }), { payload })
  }
  addBulkCards = cards => {
    this.setGlobalValue(value => ({
      ...value,
      cards: cards.map(card => ({
        ...cardTemplate,
        front: card[0] || "",
        back: card[1] || ""
      }))
    }))
    Analytics.event({
      category: 'Editing',
      action: 'Uploaded a CSV file'
    })
  }
  addCard = () => {
    this.setGlobalValue(value => ({
      ...value,
      cards: [...value.cards, { ...cardTemplate }]
    }))
    Analytics.event({
      category: 'Editing',
      action: 'Added a card'
    })
  }
  swapSides = () => {
    this.setGlobalValue(value => ({
      ...value,
      cards: value.cards.map(card => ({
        ...card,
        front: card.back,
        back: card.front,
        ftype: card.btype,
        btype: card.ftype
      }))
    }), {
      updateCache: (value, cache) => ({
        ...value,
        cards: value.cards.map(card => {
          const cachedCard = cache.cards.find(cc => cc.id === card.id)
          if(cachedCard){
            return {
              ...card,
              front: card.back,
              back: card.front,
              ftype: card.btype,
              btype: card.ftype,
              color: cachedCard.color
            }
          }else{
            return {
              ...card,
              front: card.back,
              back: card.front,
              ftype: card.btype,
              btype: card.ftype
            }
          }
        })
      })
    })
    Analytics.event({
      category: 'Editing',
      action: 'Swapped sides (all)'
    })
  }
  toggleColors = clr => {
    this.setGlobalValue((value, cache) => ({
      ...value,
      clr,
      cards: value.cards.map(card => {
        if(clr){
          const cachedCard = cache.cards.find(cc => cc.id === card.id)
          if(cachedCard){
            return {
              ...card,
              color: cachedCard.color
            }
          }else{
            return card
          }
        }else{
          const { color, ...restCard } = card;
          return restCard
        }
      })
    }), {skipCache: true})
    Analytics.event({
      category: 'Editing',
      action: 'Toggled allowColors',
      value: clr ? 1 : 0
    })
  }
  toggleDoubleSided = dbl => {
    this.setGlobalValue((value, cache) => ({
      ...value,
      sds: dbl ? 2 : 1,
      cards: value.cards.map(card => {
        if(dbl){
          const cachedCard = cache.cards.find(cc => cc.id === card.id)
          if(cachedCard){
            return {
              ...card,
              back: cachedCard.back
            }
          }else{
            return card
          }
        }else{
          const { back, ...restCard } = card;
          return restCard
        }
      })
    }), {skipCache: true})
    Analytics.event({
      category: 'Editing',
      action: 'Set number of sides',
      value: dbl ? 2 : 1
    })
  }
  playCards = () => {
    this.props.history.push({
      pathname: '/play',
      hash: this.props.location.hash
    })
    Analytics.event({
      category: 'Editing',
      action: 'Clicked the play button'
    })
  }
  clearDeleteCache = () => {
    this.props.dispatch({
      type: 'CLEAR_DELETED_CARD'
    })
  }
  undoDelete = () => {
    const { deletedCard: { index, ...card } } = this.props;
    this.setGlobalValue((value, cache) => ({
      ...value,
      cards: [
        ...value.cards.slice(0, index),
        {...card},
        ...value.cards.slice(index)
      ]
    }), {
      payload: {
        deletedCard: null
      }
    })
    Analytics.event({
      category: 'Editing',
      action: 'Undeleted a card'
    })
  }
  startTutorial = () => {
    this.setState({tutorialOpen: true})
    Analytics.event({
      category: 'Editing',
      action: 'Started the tutorial'
    })
  }
  endTutorial = step => {
    this.setState({tutorialOpen: false})
    Analytics.event({
      category: 'Editing',
      action: 'Exited the tutorial',
      value: step
    })
  }
  render() {
    const { cards, title } = this.props.value
    const { deletedCard } = this.props;
    return (
      <Page>
        <Helmet>
          <title>{`✏️ ${title || 'New Deck'} | Bitcards – Beautiful. Simple. Flash Cards.`}</title>
          <meta name="theme-color" content="#ed5555" />
        </Helmet>
        <TitleEditor
          title={title}
          onChange={this.setTitle}
          swapSides={this.swapSides}
          toggleColors={this.toggleColors}
          toggleDoubleSided={this.toggleDoubleSided}
          startTutorial={this.startTutorial}
          onCardsUploaded={this.addBulkCards}
        />
        <Cards cards={cards} onChange={this.setCards} addCard={this.addCard} />
        <FOB id='tutorial-play' onClick={this.playCards} aria-label='Play'>
          <PlayIcon />
        </FOB>
        {
          deletedCard &&
          <Toast onClose={this.clearDeleteCache}>
            Successfully deleted
            <RoundButton onClick={this.undoDelete} className={css({
              marginLeft: '15px !important'
            })}>
              Undo
            </RoundButton>
          </Toast>
        }
        {
          this.state.tutorialOpen &&
          <Tutorial onExitRequested={this.endTutorial}/>
        }
        <Footer/>
      </Page>
    )
  }
}
export default connect(state => ({
  value: state.app.value,
  cache: state.app.cache,
  deletedCard: state.app.deletedCard,
  historyIndex: state.app.historyIndex
}))(Edit)
