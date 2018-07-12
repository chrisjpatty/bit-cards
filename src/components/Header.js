import React, { Fragment } from 'react'
import styled from 'react-emotion'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { history } from '../index'

const HeaderWrapper = styled('header')({
  display: 'flex',
  flexDirection: 'row',
  padding: '20px 10px'
}, ({theme}) => ({
  [theme.media.sm]: {
    display: 'none'
  }
}))

const Links = styled('ul')({
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0
})

const LinkWrapper = styled('li')({
  '& a': {
    padding: '15px 20px',
    textDecoration: 'none',
    fontSize: 18
  }
}, ({theme}) => ({
  '& a': {
    color: theme.gray.light,
    '&:hover': {
      color: theme.gray.medium
    }
  }
}))

export default class Header extends React.Component{
  render(){
    return(
      <Fragment>
        <DesktopHeader />
      </Fragment>
    )
  }
}

const DesktopHeader = () => (
  <HeaderWrapper>
    <nav>
      <Links>
        <LinkWrapper>
          <Link to={{
            pathname: '/edit',
            hash: history.location.hash
          }}>
            New Deck
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link to={{
            pathname: '/howitworks',
            hash: history.location.hash
          }}>
            How it works
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link to={{
            pathname: '/examples',
            hash: history.location.hash
          }}>
            Examples
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link to={{
            pathname: '/about',
            hash: history.location.hash
          }}>
            About
          </Link>
        </LinkWrapper>
      </Links>
    </nav>
    <div className={css({
      marginLeft: 'auto'
    })}>
      {`Bytes: ${history.location.hash.length}`}
    </div>
  </HeaderWrapper>
)
