import React from 'react'
import styled from 'react-emotion'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { history } from '../index'

const HeaderWrapper = styled('header')({
  display: 'flex',
  flexDirection: 'row',
  padding: 10
})

const Links = styled('ul')({
  listStyle: 'none',
  margin: 'none',
  display: 'flex'
})

const LinkWrapper = styled('li')({
  '& a': {
    padding: 10,
    textDecoration: 'none'
  }
})

export default class Header extends React.Component{
  render(){
    return(
      <HeaderWrapper>
        <nav>
          <Links>
            <LinkWrapper>
              <Link to={{
                pathname: '/edit',
                search: history.location.search
              }}>
                New Deck
              </Link>
            </LinkWrapper>
            <LinkWrapper>
              <Link to={{
                pathname: '/howitworks',
                search: history.location.search
              }}>
                How it works
              </Link>
            </LinkWrapper>
            <LinkWrapper>
              <Link to={{
                pathname: '/examples',
                search: history.location.search
              }}>
                Examples
              </Link>
            </LinkWrapper>
            <LinkWrapper>
              <Link to={{
                pathname: '/about',
                search: history.location.search
              }}>
                About
              </Link>
            </LinkWrapper>
          </Links>
        </nav>
        <div className={css({
          marginLeft: 'auto'
        })}>
          {`Bytes: ${history.location.search.length}`}
        </div>
      </HeaderWrapper>
    )
  }
}
