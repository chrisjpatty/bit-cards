import React from 'react'
import styled from 'react-emotion'
import { Portal } from 'react-portal'
import { Motion, spring } from 'react-motion'
import { history } from '../index'
import store from '../store'

const Shade = styled('div')({
  position: 'fixed',
  left: '-10vw',
  top: '-10vh',
  width: 'calc(100vw + 20vw)',
  height: 'calc(100vh + 20vh)',
  background: 'rgba(255,255,255,.82)',
  zIndex: 98
})

const MenuWrapper = styled('div')({
  position: 'fixed',
  zIndex: 99,
  right: 0,
  top: 0,
  width: '100vw',
  maxWidth: 200,
  height: '100vh',
  // background: '#fff',
  display: 'flex'
})

export default class MobileSlideout extends React.Component {
  state = { isOpen: false, exiting: false }
  componentWillReceiveProps = nextProps => {
    if (this.props.isOpen === false && nextProps.isOpen === true) {
      this.setState({ isOpen: true, exiting: false })
    }else if(this.props.isOpen === true && nextProps.isOpen === false){
      this.setState({ exiting: true })
    }
  }
  closeModal = () => {
    this.setState({ isOpen: false, exiting: false })
  }
  render() {
    const { isOpen, onRequestClose } = this.props
    return this.state.isOpen ? (
      <Portal>
        <Menu
          onRequestClose={onRequestClose}
          onAnimatedOut={this.closeModal}
          exiting={this.state.exiting}
          isOpen={isOpen}
        />
      </Portal>
    ) : null
  }
}

const NavWrapper = styled('nav')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
})

const MenuButton = styled('button')({
  flex: '1 1 auto',
  width: '100%',
  padding: '30px 15px',
  background: '#fda639',
  border: 'none',
  textTransform: 'uppercase',
  fontSize: 22,
  fontWeight: 600
}, ({theme}) => ({
  color: '#ffffff',
  '&:first-child': {
    background: '#36b7f3'
  },
  '&:nth-child(2)': {
    background: '#fda639'
  },
  '&:nth-child(3)': {
    background: '#ed5555'
  },
  '&:nth-child(4)': {
    background: '#7d5bbf'
  }
}))

const Menu = ({ isOpen, onRequestClose, onAnimatedOut, exiting }) => (
  <Motion
    defaultStyle={{ x: 110, opacity: 0 }}
    style={{
      x: spring(isOpen ? 0 : 110),
      opacity: spring(isOpen ? 1 : 0)
    }}
    onRest={() => {
      if (!isOpen) {
        onAnimatedOut()
      }
    }}
  >
    {({ x, opacity }) => (
      <React.Fragment>
        <MenuWrapper
          style={{
            transform: `translateX(${x}%)`
          }}
        >
          <NavWrapper>
            <MenuButton onClick={() => {
              history.push('/edit');
              store.dispatch({
                type: 'RESET_STATE'
              })
              onRequestClose()
            }}>
              <span role='img' aria-hidden={true} aria-label="Rainbow">🌈</span> New Deck
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/edit',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
              {/* <span role='img' aria-hidden={true} aria-label="Pencil">✏️</span> */}
              Edit Deck
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/about',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
              {/* <span role='img' aria-hidden={true} aria-label="Computer">💻</span> */}
              About
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/examples',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
              {/* <span role='img' aria-hidden={true} aria-label="Sparks">✨</span> */}
              Examples
            </MenuButton>
          </NavWrapper>
        </MenuWrapper>
        <Shade
          onClick={onRequestClose}
          style={{
            opacity,
            pointerEvents: exiting ? 'none' : ''
          }}
        />
      </React.Fragment>
    )}
  </Motion>
)
