import React from 'react'
import styled from 'react-emotion'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { history } from '../index'

const HeaderWrapper = styled('header')({
  display: 'flex',
  flexDirection: 'row',
  padding: '20px 10px'
})

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
