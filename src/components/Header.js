import React, { Fragment } from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { history } from '../index'
import RoundButton from './RoundButton'
import LightLogo from '../img/bitcards_logo_white.svg'
import DarkLogo from '../img/bitcards_logo.svg'
import store from '../store'
import MobileHeader from './MobileHeader'

const HeaderWrapper = styled('header')(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
    // padding: '20px 10px',
  },
  ({ theme }) => ({
    borderBottom: `2px solid ${theme.gray.extraExtraLight}`,
    [theme.media.sm]: {
      display: 'none'
    }
  }),
  ({isPlaying}) => (
    isPlaying ? {
      borderBottom: 'none'
    } : null
  ),
  ({theme}) => ({
    [theme.media.sm]: {
      display: 'none'
    }
  })
)

const Links = styled('ul')({
  listStyle: 'none',
  display: 'flex',
  height: '100%',
  margin: 0,
  padding: 0
})

const LinkWrapper = styled('li')(
  {
    display: 'flex',
    '& a': {
      padding: '15px 10px',
      paddingTop: 17,
      textDecoration: 'none',
      fontSize: 14,
      textTransform: 'uppercase'
    }
  },
  ({ theme }) => ({
    '& a': {
      color: theme.gray.medium,
      '&:hover': {
        color: theme.gray.medium
      }
    }
  }),
  ({ isPlaying, hasColor }) => (
    isPlaying && hasColor ? {
      '& a': {
        color: '#fff'
      }
    } : null
  )
)

const Logo = styled('img')({
  width: '15vw',
  maxWidth: 150,
  marginTop: '1vw',
  marginBottom: '.9vw',
  marginLeft: '1vw'
})

const NavWrapper = styled('nav')({
  marginLeft: 'auto'
})

export default class Header extends React.Component {
  render() {
    const { location } = this.props;
    const isPlaying = location.pathname.includes('play');
    return (
      <Fragment>
        <DesktopHeader isPlaying={isPlaying} />
        <MobileHeader isPlaying={isPlaying} />
      </Fragment>
    )
  }
}

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  paddingRight: '1vw',
  paddingLeft: 8,
  '& button': {
    margin: 'auto'
  }
})

let DesktopHeader = ({ hasColor, isPlaying }) => (
  <HeaderWrapper isPlaying>
    <Link
      to={{
        pathname: '/edit'
      }}
    >
      <Logo src={hasColor && isPlaying ? LightLogo : DarkLogo} alt="Bitcards" />
    </Link>
    <NavWrapper>
      <Links>
        <LinkWrapper hasColor={hasColor} isPlaying={isPlaying}>
          <Link
            to={{
              pathname: '/about',
              hash: history.location.hash
            }}
          >
            About
          </Link>
        </LinkWrapper>
        <LinkWrapper hasColor={hasColor} isPlaying={isPlaying}>
          <Link
            to={{
              pathname: '/examples',
              hash: history.location.hash
            }}
          >
            Examples
          </Link>
        </LinkWrapper>
        <LinkWrapper hasColor={hasColor} isPlaying={isPlaying}>
          <Link
            to={{
              pathname: '/edit',
              hash: history.location.hash
            }}
          >
            Edit Deck
          </Link>
        </LinkWrapper>
        <ButtonWrapper>
          <RoundButton
            primary={!isPlaying}
            onClick={() => {
              history.push('/edit')
              store.dispatch({ type: 'RESET_STATE' })
            }}
          >
            <span role='img' aria-label="" aria-hidden={true}>🌈</span> New Deck
          </RoundButton>
        </ButtonWrapper>
      </Links>
    </NavWrapper>
  </HeaderWrapper>
)
DesktopHeader = connect(
  ({app}) => ({
    hasColor: app.value.clr
  })
)(DesktopHeader)
