import React from 'react'
import styled from 'react-emotion'
import examples from '../examples'

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  overflow: 'hidden',
  padding: '2vw'
}, ({theme}) => ({
  [theme.media.sm]: {
    marginTop: '7vw'
  }
}))

export default class Examples extends React.Component{
  render(){
    return(
      <Wrapper>
        {
          examples.map((exp, i) => (
            <ExampleDeck {...exp} key={i}/>
          ))
        }
      </Wrapper>
    )
  }
}

const ExampleDeck = ({cards, name, link}) => (
  <ExampleWrapper>
    <Link href={link} target="_blank">
      <Cards cards={cards} />
      <Name>{name}</Name>
    </Link>
  </ExampleWrapper>
)

const Link = styled('a')({
  cursor: 'pointer',
  padding: '1vw 5vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  appearance: 'none',
  color: 'inherit'
}, ({theme}) => ({
  '&:hover': {
    '& .ex-card-main': {
      transform: 'scale(1.1)'
    },
    '& .ex-card-left': {
      transform: 'rotate(-20deg) translate(-3vw, -1vw) scale(.9)'
    },
    '& .ex-card-right': {
      transform: 'rotate(20deg) translate(3vw, -1vw) scale(.9)'
    },
    '& span': {
      textDecoration: 'underline',
      textDecorationColor: theme.gray.extraLight
    }
  }
}))

const ExampleWrapper = styled('div')({
  flex: '1 1 33.333%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}, ({theme}) => ({
  [theme.media.lg]: {
    flex: '1 1 50%'
  },
  [theme.media.sm]: {
    flex: '1 1 100%',
    marginBottom: '7vw'
  }
}))

const Name = styled('span')({
  padding: '2vw',
  fontSize: 25
}, ({theme}) => ({
  textDecorationColor: theme.gray.extraExtraLight,
  [theme.media.sm]: {
    paddingTop: '4vw'
  }
}))

const Cards = ({cards}) => (
  <CardsWrapper>
    <Card className='ex-card-main' {...cards[0]}/>
    <Card className='ex-card-left' left {...cards[1]}/>
    <Card className='ex-card-right' right {...cards[2]}/>
  </CardsWrapper>
)

const CardsWrapper = styled('div')({
  position: 'relative',
})

const Card = ({value, type, left, right, className=''}) => (
  <CardWrapper className={className} left={left} right={right} singleChar={value.length < 3}>
    {
      type === 'text' &&
      value
    }
    {
      type === 'image' &&
      <CardImage src={value} alt='' aria-hidden={true}/>
    }
  </CardWrapper>
)

const CardWrapper = styled('div')({
  position: 'relative',
  padding: 5,
  borderRadius: 5,
  background: '#fff',
  width: '15vw',
  height: '15vw',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2.5vw',
  textAlign: 'center',
  lineHeight: '1.5',
  transition: 'transform 250ms',
  willChange: 'transform',
  userSelect: 'none'
}, ({theme}) => ({
  borderTop: `1px solid ${theme.gray.extraExtraLight}`,
  boxShadow: theme.shadows.mid,
  [theme.media.lg]: {
    width: '20vw',
    height: '20vw'
  },
  [theme.media.sm]: {
    width: '40vw',
    height: '40vw',
    fontSize: '7vw'
  }
}), ({left, theme}) => (
  left ? {
    position: 'absolute',
    top: 0,
    left: '-5vw',
    transform: 'rotate(-10deg) scale(.8)',
    zIndex: 2,
    [theme.media.lg]: {
      left: '-8vw'
    },
    [theme.media.sm]: {
      left: '-13vw'
    }
  } : null
), ({right, theme}) => (
  right ? {
    position: 'absolute',
    top: 0,
    right: '-5vw',
    transform: 'rotate(10deg) scale(.8)',
    zIndex: 1,
    [theme.media.lg]: {
      right: '-8vw'
    },
    [theme.media.sm]: {
      right: '-13vw'
    }
  } : null
), ({singleChar, theme}) => (
  singleChar ? {
    fontSize: '6vw !important',
    [theme.media.sm]: {
      fontSize: '20vw !important'
    }
  } : null
))

const CardImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%'
})
