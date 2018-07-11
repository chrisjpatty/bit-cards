import React from 'react'
import styled from 'react-emotion'
import { Motion, spring } from 'react-motion'

const Wrapper = styled('div')({
  position: 'fixed',
  left: '50%',
  bottom: '4vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 1
})

const ToastWrapper = styled('div')(
  {
    flex: '0 0 auto',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  ({ theme }) => ({
    background: theme.gray.dark,
    color: '#fff',
    boxShadow: theme.shadows.high
  })
)

export default class Toast extends React.Component {
  static defaultProps = {
    timeout: 4500
  }
  state = {
    visible: true
  }
  componentDidMount = () => {
    this.startTimer()
  }
  componentWillUnmount = () => {
    this.cancelTimer()
  }
  startTimer = () => {
    this.timer = setTimeout(this.startClose, this.props.timeout)
  }
  cancelTimer = () => {
    clearTimeout(this.timer)
  }
  startClose = () => {
    this.setState({ visible: false })
  }
  handleRest = () => {
    if(!this.state.visible){
      this.props.onClose()
    }
  }
  render() {
    const { children } = this.props
    return (
      <Motion
        defaultStyle={{ y: 14 }}
        style={{ y: spring(this.state.visible ? 0 : 14) }}
        onRest={this.handleRest}
      >
        {({ y }) => (
          <Wrapper
            style={{
              transform: `translateY(${y}vh)`
            }}
          >
            <ToastWrapper
              onMouseEnter={this.cancelTimer}
              onMouseLeave={this.startTimer}
            >
              {children}
            </ToastWrapper>
          </Wrapper>
        )}
      </Motion>
    )
  }
}
