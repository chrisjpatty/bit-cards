import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { css } from 'emotion'
import { withTheme } from 'emotion-theming'
import { COLORS, ColorPicker } from './ColorPicker'
import RoundButton from './RoundButton'
// import { css } from 'emotion'
// import ContentEditable from "react-sane-contenteditable";

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: '3vw',
  '&:last-child': {
    marginBottom: 0
  }
}, ({theme}) => ({
  [theme.media.sm]: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5vw',
    paddingBottom: '5vw',
    borderBottom: `2px solid ${theme.gray.extraExtraLight}`
  }
}))

class EditableCard extends React.Component {
  setValue = (key, value) => {
    this.props.onChange(
      {
        ...this.props.card,
        [key]: value
      },
      this.props.index
    )
  }
  deleteCard = () => {
    this.props.deleteCard(this.props.index)
  }
  render() {
    const { card, enableColors, doubleSided } = this.props
    const { front, back, color } = card
    // console.log(card);
    return (
      <Wrapper>
        <EditableCardSide
          value={front}
          color={color}
          noColorPicker={doubleSided ? true : !enableColors}
          onChange={value => {
            this.setValue('front', value)
          }}
          onColorChange={color => {
            this.setValue('color', color)
          }}
          label="FRONT"
          left
        />
        {doubleSided && (
          <EditableCardSide
            value={back}
            color={color}
            noColorPicker={!enableColors}
            onChange={value => {
              this.setValue('back', value)
            }}
            onColorChange={color => {
              this.setValue('color', color)
            }}
            onRequestDelete={this.deleteCard}
            deleteButton
            label="BACK"
            right
          />
        )}
      </Wrapper>
    )
  }
}
export default connect(state => ({
  enableColors: state.app.value.clr ? true : false,
  doubleSided: state.app.value.sds === 2
}))(EditableCard)

const SideWrapper = styled('div')({
  position: 'relative'
})

const StyledTextArea = styled('textarea')(
  {
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
    background: '#fff',
    width: '45vw',
    height: '35vw',
    fontSize: '2.8vw',
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
    border: `1px solid ${theme.gray.extraExtraLight}`,
    [theme.media.sm]: {
      width: '90vw',
      height: '75vw',
      borderRadius: 5,
      fontSize: '2rem',
      margin: 0
    }
  }),
  ({ right, theme }) =>
    right
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: 'none',
          marginLeft: 3
          // background: '#fcfcfc'
        }
      : {},
  ({ left }) =>
    left
      ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: 'none',
          marginRight: 3
        }
      : {}
)

const CardLabel = styled('div')(
  {
    position: 'absolute',
    fontWeight: 600,
    left: '1vw',
    top: '1vw',
    fontSize: 10
    // transform: 'rotate(-90deg)'
  },
  ({ theme }) => ({
    color: theme.gray.extraLight,
    [theme.media.sm]: {
      left: '2vw',
      top: '2vw',
      fontSize: 12
    }
  })
)

class EditableCardSide extends React.Component {
  setSideContent = e => {
    if (this.props.value !== e.target.value) {
      this.props.onChange(e.target.value)
    }
  }
  render() {
    const {
      value,
      color,
      onColorChange,
      onRequestDelete,
      noColorPicker,
      label,
      left,
      right,
      deleteButton,
      theme: {media: {sm}}
    } = this.props
    return (
      <SideWrapper>
        <StyledTextArea
          type="text"
          value={value}
          onBlur={this.stopEditing}
          onChange={this.setSideContent}
          left={left}
          right={right}
        />
        {!noColorPicker && (
          <ColorPickerWithButton color={color} onChange={onColorChange} />
        )}
        {label && <CardLabel>{label}</CardLabel>}
        {
          deleteButton &&
          <RoundButton
            className={css({
              position: 'absolute',
              left: '2vw',
              bottom: '2vw',
              [sm]: {
                left: '3vw',
                bottom: '5vw'
              }
            })}
            onClick={onRequestDelete}
          >
            Delete
          </RoundButton>
        }
      </SideWrapper>
    )
  }
}
EditableCardSide = withTheme(EditableCardSide)

const ButtonWrapper = styled('div')({
  position: 'absolute',
  right: '2vw',
  bottom: '2vw'
}, ({theme}) => ({
  [theme.media.sm]: {
    right: '3vw',
    bottom: '3vw'
  }
}))

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
    opacity: 0.8,
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
    this.setState({ isOpen: true })
  }
  closePicker = () => {
    this.setState({ isOpen: false })
  }
  selectColor = color => {
    this.props.onChange(color)
  }
  render() {
    const { color } = this.props
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
          {this.state.isOpen && (
            <PickerWrapper className="fade-in-fast">
              <ColorPicker
                closeModal={this.closePicker}
                onSelect={this.selectColor}
              />
            </PickerWrapper>
          )}
        </ButtonWrapper>
      </React.Fragment>
    )
  }
}
