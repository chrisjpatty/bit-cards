import React from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import LightLogo from '../img/bitcards_logo_on_dark.svg'
import DarkLogo from '../img/bitcards_logo_on_light.svg'
import { HamburgerIcon } from '../Icons'
import MobileSlideout from './MobileSlideout'

const HeaderWrapper = styled('header')({
  display: 'none',
  flexDirection: 'row',
  alignItems: 'center'
}, ({theme}) => ({
  [theme.media.sm]: {
    display: 'flex'
  }
}))

const Logo = styled('img')({
  width: 140,
  marginLeft: '3vw',
  marginTop: '3vw'
})

const AlignRight = styled('div')({
  marginLeft: 'auto'
})

const MenuButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: '10px 15px 5px 10px',
  '& svg': {
    width: 26
  }
}, ({light, theme}) => ({
  color: light ? '#fff' : theme.gray.mediumDark
}))

class MobileHeader extends React.Component{
  state = {menuOpen: false}
  toggleMenu = () => {
    this.setState(state => ({menuOpen: !state.menuOpen}))
  }
  render(){
  const { isPlaying, hasColor } = this.props;
    return(
      <HeaderWrapper>
        <Logo src={isPlaying ? LightLogo : DarkLogo} alt="Bitcards" />
        <AlignRight>
          <MenuButton light={isPlaying && hasColor} onClick={this.toggleMenu} aria-label='Open Menu'>
            <HamburgerIcon/>
          </MenuButton>
        </AlignRight>
        <MobileSlideout onRequestClose={this.toggleMenu} isOpen={this.state.menuOpen} />
      </HeaderWrapper>
    )
  }
}
export default connect(
  ({app}) => ({
    hasColor: app.value.clr
  })
)(MobileHeader)
