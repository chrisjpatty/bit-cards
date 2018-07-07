import React from 'react'
import styled from 'react-emotion'
import EditableCard from './EditableCard'
import { PlusIcon } from '../Icons'
import { css } from 'emotion'

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 1000,
  paddingBottom: 50
})

const AddCardButton = styled('button')({
  borderRadius: '100%',
  width: 80,
  height: 80,
  transition: 'box-shadow 200ms, transform 200ms, color 200ms',
  cursor: 'pointer',
  transform: 'scale(.95)',
  padding: 10,
  border: 'none',
  fill: 'currentColor',
  outline: 'none',
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
  '&:hover': {
    transform: 'scale(1)',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  },
  '&:focus': {
    transform: 'scale(1)',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  }
}, ({theme}) => ({
  color: theme.gray.extraLight,
  '&:hover': {
    color: theme.gray.light
  },
  '&:focus': {
    color: theme.gray.light
  }
}))

export default class Cards extends React.Component{
  mergeCardChanges = (card, index) => {
    this.props.onChange([
      ...this.props.cards.slice(0, index),
      card,
      ...this.props.cards.slice(index + 1)
    ])
  }
  render(){
    const { cards, addCard } = this.props;
    return(
      <Wrapper>
        {
          cards.map((card, i) => (
            <EditableCard card={card} onChange={this.mergeCardChanges} index={i} key={i} />
          ))
        }
        <div className={css({
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15
        })}>
          <AddCardButton onClick={addCard}>
            <PlusIcon />
          </AddCardButton>
        </div>
      </Wrapper>
    )
  }
}
