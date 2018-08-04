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

export const cardTemplate = {
  ftype: 't',
  btype: 't',
  front: '',
  falt: '',
  balt: '',
  back: '',
  color: 1
}

class Edit extends React.Component {
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
  addCard = () => {
    this.setGlobalValue(value => ({
      ...value,
      cards: [...value.cards, { ...cardTemplate }]
    }))
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
  }
  playCards = () => {
    this.props.history.push({
      pathname: '/play',
      hash: this.props.location.hash
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
  }
  render() {
    const { cards, title } = this.props.value
    const { deletedCard } = this.props;
    return (
      <Page>
        <TitleEditor
          title={title}
          onChange={this.setTitle}
          swapSides={this.swapSides}
          toggleColors={this.toggleColors}
          toggleDoubleSided={this.toggleDoubleSided}
        />
        <Cards cards={cards} onChange={this.setCards} addCard={this.addCard} />
        <FOB onClick={this.playCards}>
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
