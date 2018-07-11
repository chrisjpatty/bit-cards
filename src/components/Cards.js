import React from 'react'
import styled from 'react-emotion'
import EditableCard from './EditableCard'
import CircularButton from './CircularButton'
import { PlusIcon } from '../Icons'
import { css } from 'emotion'

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 1000,
  paddingBottom: 50
})

export default class Cards extends React.Component {
  mergeCardChanges = (card, index) => {
    this.props.onChange([
      ...this.props.cards.slice(0, index),
      card,
      ...this.props.cards.slice(index + 1)
    ])
  }
  deleteCardByIndex = index => {
    const deletedCard = {...this.props.cards[index], index}
    this.props.onChange([
      ...this.props.cards.slice(0, index),
      ...this.props.cards.slice(index + 1)
    ], { deletedCard })
  }
  render() {
    const { cards, addCard } = this.props
    return (
      <Wrapper>
        {cards.map((card, i) => (
          <EditableCard
            card={card}
            onChange={this.mergeCardChanges}
            deleteCard={this.deleteCardByIndex}
            index={i}
            key={i}
          />
        ))}
        <div
          className={css({
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15
          })}
        >
          <CircularButton onClick={addCard}>
            <PlusIcon />
          </CircularButton>
        </div>
      </Wrapper>
    )
  }
}
