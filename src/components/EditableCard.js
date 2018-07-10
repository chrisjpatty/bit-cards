import React from 'react'
import styled from 'react-emotion'
import {COLORS, ColorPicker} from './ColorPicker'
// import { css } from 'emotion'
// import ContentEditable from "react-sane-contenteditable";

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center'
})

export default class EditableCard extends React.Component {
  setValue = (key, value) => {
    this.props.onChange(
      {
        ...this.props.card,
        [key]: value
      },
      this.props.index
    )
  }
  render() {
    const { card } = this.props
    const { front, back, color } = card
    // console.log(card);
    return (
      <Wrapper>
        <EditableCardSide
          value={front}
          color={color}
          onChange={value => {
            this.setValue('front', value)
          }}
          onColorChange={color => {
            this.setValue('color', color)
          }}
          label="FRONT"
        />
        <EditableCardSide
          value={back}
          color={color}
          noColorPicker
          onChange={value => {
            this.setValue('back', value)
          }}
          onColorChange={color => {
            this.setValue('color', color)
          }}
          label="BACK"
        />
      </Wrapper>
    )
  }
}

const SideWrapper = styled('div')({
  padding: '3%',
  width: '50%',
  paddingTop: '40%',
  position: 'relative',
  '&:first-child': {
    paddingRight: '3%'
  },
  '&:last-child': {
    paddingLeft: '3%'
  }
})

const StyledTextArea = styled('textarea')(
  {
    position: 'absolute',
    left: '3%',
    top: '3%',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
    background: '#fff',
    width: '92%',
    height: '92%',
    fontSize: '4vh',
    outline: 'none',
    resize: 'none',
    borderRadius: 5,
    padding: '7%',
    transition: 'box-shadow 300ms, transform 300ms',
    transform: 'scale(.99)',
    textAlign: 'center',
    '&:focus': {
      boxShadow:
        '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
      transform: 'scale(1)'
    }
  },
  ({ theme }) => ({
    border: `1px solid ${theme.gray.extraExtraLight}`
  })
)

const CardLabel = styled('div')({
  position: 'absolute',
  fontWeight: 600,
  left: 25,
  top: 22,
  fontSize: 10,
  // transform: 'rotate(-90deg)'
}, ({theme}) => ({
  color: theme.gray.extraLight
}))

class EditableCardSide extends React.Component {
  setSideContent = e => {
    if (this.props.value !== e.target.value) {
      this.props.onChange(e.target.value)
    }
  }
  render() {
    const { value, color, onColorChange, noColorPicker, label } = this.props
    return (
      <SideWrapper>
        <StyledTextArea
          type="text"
          value={value}
          onBlur={this.stopEditing}
          onChange={this.setSideContent}
        />
        {
          !noColorPicker &&
          <ColorPickerWithButton color={color} onChange={onColorChange} />
        }
        {
          label &&
          <CardLabel>{label}</CardLabel>
        }
      </SideWrapper>
    )
  }
}

const ButtonWrapper = styled('div')({
  position: 'absolute',
  right: 50,
  bottom: 50
})

const ColorButton = styled('button')({
  width: 50,
  height: 50,
  border: 'none',
  outline: 'none',
  borderRadius: '100%',
  transform: 'scale(.95)',
  transition: 'box-shadow 300ms, transform 300ms',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  '&:focus': {
    boxShadow: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
    opacity: .8,
    transform: 'scale(1)'
  },
  '&:hover': {
    boxShadow: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
    transform: 'scale(1)'
  }
})

const PickerWrapper = styled('div')({
  position: 'absolute',
  bottom: 65,
  right: 0
})

class ColorPickerWithButton extends React.Component {
  state = {
    isOpen: false
  }
  openPicker = () => {
    this.setState({ isOpen: true})
  }
  closePicker = () => {
    this.setState({ isOpen: false })
  }
  selectColor = color => {
    this.props.onChange(color)
  }
  render() {
    const { color } = this.props;
    const selected = COLORS[color] || {}
    return (
      <React.Fragment>
        <ButtonWrapper>
          <ColorButton
            style={{
              background: selected.color
            }}
            onClick={this.openPicker}
            innerRef={r => {
              this.button = r
            }}
          />
          {
            this.state.isOpen &&
            <PickerWrapper className='fade-in-fast'>
              <ColorPicker
                closeModal={this.closePicker}
                onSelect={this.selectColor}
              />
            </PickerWrapper>
          }
        </ButtonWrapper>
      </React.Fragment>
    )
  }
}
