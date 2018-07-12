import React from 'react'
import styled from 'react-emotion'
import ModalStateController from './ModalStateController'

const ORDERED_COLORS = [
  {type: 'color', id: 1, color: "#ef5350"},
  {type: 'color', id: 2, color: "#EC407A"},
  {type: 'color', id: 3, color: "#AB47BC"},
  {type: 'color', id: 4, color: "#7E57C2"},
  {type: 'color', id: 5, color: "#5C6BC0"},
  {type: 'color', id: 6, color: "#42A5F5"},
  {type: 'color', id: 7, color: "#29B6F6"},
  {type: 'color', id: 8, color: "#26C6DA"},
  {type: 'color', id: 9, color: "#26A69A"},
  {type: 'color', id: 10, color: "#66BB6A"},
  {type: 'color', id: 11, color: "#9CCC65"},
  {type: 'color', id: 12, color: "#D4E157"},
  {type: 'color', id: 13, color: "#FFEE58"},
  {type: 'color', id: 14, color: "#FFCA28"},
  {type: 'color', id: 15, color: "#FFA726"},
  {type: 'color', id: 16, color: "#FF7043"},
  {type: 'color', id: 18, color: "#78909C"},
  {type: 'color', id: 17, color: "#ffffff", outline: true},
]

export const COLORS = ORDERED_COLORS.reduce((obj, c) => ({...obj, [c.id]: c}), {})

const ModalWrapper = styled('div')({
  position: 'fixed',
  width: 1,
  height: 1,
  left: 30,
  top: 30
})

export default class ConnectedColorPicker extends React.Component{
  render(){
    const { isOpen, onModalClose, anchor } = this.props;
    return(
      <ModalStateController
        enterAnimationClassName='fade-in-fast'
        exitAnimationClassName='fade-out-fast'
        isOpen={isOpen}
        onModalClose={onModalClose}
        noShade
      >
        {
          ({getProps, closeModal}) => (
            <ModalWrapper style={{
              left: anchor.x,
              top: anchor.y,

            }}>
              <ColorPicker wrapperProps={getProps()} anchor={anchor} closeModal={closeModal} />
            </ModalWrapper>
          )
        }
      </ModalStateController>
    )
  }
}

const PickerWrapper = styled('div')({
  background: '#fff',
  display: 'flex',
  flexDirection: 'row',
  width: 310,
  height: 160,
  zIndex: 9,
  padding: 5,
  flexWrap: 'wrap',
  boxShadow: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
  borderRadius: 5
})

export class ColorPicker extends React.Component{
  componentDidMount = () => {
    document.addEventListener('click', this.handleOutsideClick)
  }
  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleOutsideClick)
  }
  handleOutsideClick = e => {
    if(!this.wrapper.contains(e.target)){
      this.props.closeModal()
      document.removeEventListener('click', this.handleOutsideClick)
    }
  }
  render(){
    const { wrapperProps, onSelect, closeModal } = this.props;
    return(
      <PickerWrapper {...wrapperProps} innerRef={r=>{this.wrapper=r}} >
        {
          ORDERED_COLORS.map(c => (
            <ColorButton {...c} onSelect={color=>{onSelect(color);closeModal()}} key={c.id} />
          ))
        }
      </PickerWrapper>
    )
  }
}

const StyledButton = styled('button')({
  width: 30,
  height: 30,
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
  borderRadius: 5,
  margin: 10,
  border: 'none',
  outline: 'none',
  transition: 'transform 150ms',
  '&:hover': {
    transform: 'scale(1.1)'
  },
  '&:focus': {
    transform: 'scale(1.1)'
  }
})

class ColorButton extends React.Component{
  selectColor = () => {
    this.props.onSelect(this.props.id)
  }
  render(){
    const { color, outline } = this.props;
    return(
      <StyledButton onClick={this.selectColor} style={{
        background: color,
        border: outline ? '1px solid rgb(199, 199, 199)' : ''
      }} />
    )
  }
}
