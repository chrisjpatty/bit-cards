import React from 'react'
import styled from "react-emotion";
import { Portal } from 'react-portal'

const PageWrapper = styled("div")({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 99
})

const Shade = styled("div")({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.5)',
  zIndex: -1
})

export default class ModalStateController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exiting: false,
      isOpen: props.isOpen || false
    }
  }
  componentWillReceiveProps = nextProps => {
    //If modal close was requested
    if (
      this.props.isOpen === true &&
      nextProps.isOpen === false &&
      !this.state.exiting
    ) {
      this.startModalClose()
    }
    //If modal open was requested
    if (!this.props.isOpen && nextProps.isOpen === true) {
      this.openModal()
    }
  }
  getWrapperProps = () => {
    return {
      className: this.state.exiting
        ? this.props.exitAnimationClassName
        : this.props.enterAnimationClassName,
      onAnimationEnd: this.state.exiting ? this.closeModal : undefined
    }
  }
  openModal = () => {
    this.setState(state => ({
      isOpen: true,
      exiting: false
    }))
  }
  startModalClose = () => {
    this.setState(state => ({
      exiting: true
    }))
  }
  closeModal = () => {
    this.setState(state => ({
      exiting: false,
      isOpen: false
    }))
    if(this.props.onModalClose){
      this.props.onModalClose()
    }
  }
  render() {
    const { children, closeOnClickOutside, shadeStyle={}, noShade } = this.props
    return (
      this.state.isOpen && (
        <Portal>
          <PageWrapper>
            {children({
              getProps: this.getWrapperProps,
              closeModal: this.startModalClose,
              exiting: this.state.exiting
            })}
            {
              !noShade &&
              <Shade
                onClick={
                  closeOnClickOutside === false ? undefined : this.startModalClose
                }
                style={shadeStyle}
                className={this.state.exiting ? 'fade-out' : 'fade-in'}
              />
            }
          </PageWrapper>
        </Portal>
      )
    )
  }
}
