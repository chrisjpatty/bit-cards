import React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: '80vh'
})

export default class ActiveCard extends React.Component{
  render(){
    const { card, activeSide } = this.props;
    return(
      <Wrapper>
        <CardWrapper>
          {card[activeSide]}
          {/* <ColorBar style={{
            borderColor: COLORS[card.color].color
          }} /> */}
        </CardWrapper>
      </Wrapper>
    )
  }
}

const CardWrapper = styled('div')({
  padding: 30,
  background: '#fff',
  borderRadius: 5,
  width: '65vh',
  minHeight: '45vh',
  maxWidth: '95vw',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '5vh',
  position: 'relative',
  textAlign: 'center'
  // paddingBottom: 'calc(7vh + 30px)'
}, ({theme}) => ({
  boxShadow: theme.shadows.high,
  borderTop: `1px solid ${theme.gray.extraExtraLight}`
}))

// const ColorBar = styled('div')({
//   position: 'absolute',
//   width: '100%',
//   height: '7vh',
//   bottom: 0,
//   left: 0,
//   borderBottomLeftRadius: 5,
//   borderBottomRightRadius: 5
// }, ({theme}) => ({
//   background: theme.gray.extraExtraLight
// }))
