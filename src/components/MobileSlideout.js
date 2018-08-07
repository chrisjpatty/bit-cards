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
  background: 'rgba(0,0,0,.6)',
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
  background: '#fff'
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
})

const MenuButton = styled('button')({
  width: '100%',
  padding: '30px 15px',
  background: 'none',
  border: 'none',
  textTransform: 'uppercase',
  fontSize: 18,
  fontWeight: 600
}, ({theme}) => ({
  color: theme.gray.dark,
  '&:nth-child(even)': {
    background: theme.gray.extraExtraLight
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
              + New Deck
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/edit',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
              Edit Deck
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/about',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
              About
            </MenuButton>
            <MenuButton onClick={() => {
              history.push({
                pathname: '/examples',
                hash: history.location.hash
              })
              onRequestClose()
            }}>
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
