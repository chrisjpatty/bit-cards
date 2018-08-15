import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { withTheme } from 'emotion-theming'
import { COLORS, ColorPicker } from './ColorPicker'
import RoundButton from './RoundButton'
import { compose } from 'redux'
import { Analytics } from '../index'
// import { css } from 'emotion'
// import ContentEditable from "react-sane-contenteditable";

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '3vw',
  width: '100%',
  '&:last-child': {
    marginBottom: 0
  }
}, ({theme}) => ({
  borderBottom: `2px solid ${theme.gray.extraExtraLight}`,
  [theme.media.sm]: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5vw',
    paddingBottom: '5vw',
  }
}))

const ControlsRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  padding: '10px 5vw',
  // maxWidth: 1000,
  position: 'relative',
  alignItems: 'center'
}, ({theme}) => ({

}))

const CardRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: '100%',
  maxWidth: 1000
}, ({theme}) => ({
  [theme.media.sm]: {
    flexDirection: 'column',
    alignItems: 'center',
  }
}))

const RightAlign = styled('div')({
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
})

class EditableCard extends React.Component {
  setValue = (key, value) => {
    if(this.props.card[key].length < 100 && value.length >= 100){
      Analytics.event({
        category: 'Editing',
        action: 'Added at least 100 characters to a card'
      })
    }
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
    Analytics.event({
      category: 'Editing',
      action: 'Deleted a card'
    });
  }
  swapSides = () => {
    this.props.onChange({
      ...this.props.card,
      front: this.props.card.back,
      back: this.props.card.front,
      ftype: this.props.card.btype,
      btype: this.props.card.ftype
    }, this.props.index)
    Analytics.event({
      category: 'Editing',
      action: 'Swapped sides (single)'
    });
  }
  setType = (side, value) => {
    if(side === 'front'){
      if(value === 't'){
        this.props.onChange({
          ...this.props.card,
          ftype: value,
          falt: ''
        }, this.props.index)
      }else{
        this.props.onChange({
          ...this.props.card,
          ftype: value
        }, this.props.index)
      }
    }else if(side === 'back'){
      if(value === 't'){
        this.props.onChange({
          ...this.props.card,
          btype: value,
          balt: ''
        }, this.props.index)
      }else{
        this.props.onChange({
          ...this.props.card,
          btype: value
        }, this.props.index)
      }
    }
    Analytics.event({
      category: 'Editing',
      action: 'Changed card type',
      value: value === 't' ? 0 : 1
    });
  }
  setAltText = (side, value) => {
    if(side === 'front'){
      if(this.props.card.falt === ''){
        Analytics.event({
          category: 'Editing',
          action: 'Added image alt text'
        })
      }
      this.props.onChange({
        ...this.props.card,
        falt: value
      }, this.props.index)
    }else{
      if(this.props.card.balt === ''){
        Analytics.event({
          category: 'Editing',
          action: 'Added image alt text'
        })
      }
      this.props.onChange({
        ...this.props.card,
        balt: value
      }, this.props.index)
    }
  }
  render() {
    const { card, enableColors, doubleSided, isFirst } = this.props
    const { front, back, color, ftype, btype, falt, balt } = card
    // console.log(card);
    return (
      <Wrapper>
        <CardRow>
          <EditableCardSide
            value={front}
            color={color}
            onChange={value => {
              this.setValue('front', value)
            }}
            onTypeChange={value => {
              this.setType('front', value)
            }}
            onAltTextChange={value => {
              this.setAltText('front', value)
            }}
            altText={falt}
            label="front"
            type={ftype}
            isFirst={isFirst}
            left
          />
          {doubleSided && (
            <EditableCardSide
              value={back}
              color={color}
              type={btype}
              onChange={value => {
                this.setValue('back', value)
              }}
              onTypeChange={value => {
                this.setType('back', value)
              }}
              onAltTextChange={value => {
                this.setAltText('back', value)
              }}
              isFirst={isFirst}
              altText={balt}
              label="back"
              right
            />
          )}
        </CardRow>
        <ControlsRow>
          {
            enableColors &&
            <ColorPickerWithButton
              color={color}
              id={isFirst ? 'tutorial-card-color-control' : ''}
              onChange={color => {
                this.setValue('color', color)
              }}
            />
          }
          <RightAlign>
            <RoundButton
              onClick={this.deleteCard}
              id={isFirst ? 'tutorial-card-delete-swap' : ''}
            >
              Delete Card
            </RoundButton>
            {
              doubleSided &&
              <RoundButton
                onClick={this.swapSides}
              >
                Swap Sides
              </RoundButton>
            }
          </RightAlign>
        </ControlsRow>
      </Wrapper>
    )
  }
}
export default compose(
  connect(state => ({
    enableColors: state.app.value.clr ? true : false,
    doubleSided: state.app.value.sds === 2
  })),
  withTheme
)(EditableCard)

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
    transition: 'box-shadow 300ms, transform 300ms, font-size 500ms',
    transform: 'scale(.99)',
    textAlign: 'center',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    appearance: 'none',
    '&:focus': {
      boxShadow:
        '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
      transform: 'scale(1)'
    }
  },
  ({ theme }) => ({
    border: `1px solid ${theme.gray.extraExtraLight}`,
    '&::placeholder': {
      color: theme.gray.extraLight
    },
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
      : {},
  ({fontModifier, theme}) => (
    fontModifier === 'md' ? {
      fontSize: '2.6vw',
      [theme.media.sm]: {
        fontSize: '1.8rem'
      }
    } : null
  ),
  ({fontModifier, theme}) => (
    fontModifier === 'sm' ? {
      fontSize: '2.3vw',
      [theme.media.sm]: {
        fontSize: '1.6rem'
      }
    } : null
  ),
  ({fontModifier, theme}) => (
    fontModifier === 'xs' ? {
      fontSize: '2vw',
      [theme.media.sm]: {
        fontSize: '1.4rem'
      }
    } : null
  )
)

const CardLabel = styled('div')(
  {
    position: 'absolute',
    fontWeight: 600,
    left: '1vw',
    top: '1vw',
    fontSize: 10,
    textTransform: 'uppercase'
    // transform: 'rotate(-90deg)'
  },
  ({ theme }) => ({
    color: theme.gray.extraLight,
    [theme.media.sm]: {
      left: '2vw',
      top: '2vw',
      fontSize: 12
    }
  }),
  ({relative, theme}) => (
    relative ? {
      position: 'relative',
      left: 'auto',
      top: 'auto',
      [theme.media.sm]: {
        position: 'relative',
        left: 'auto',
        top: 'auto',
      }
    } : null
  )
)

const AltTextWrapper = styled('div')({
  position: 'absolute',
  left: '2vw',
  bottom: '5.8vw',
  zIndex: 8,
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100% - 4vw)'
}, ({theme}) => ({
  [theme.media.sm]: {
    left: '2vw',
    bottom: '11vw'
  }
}))

const AltText = styled('input')({
  borderRadius: 5,
  height: '5vh',
  width: '100%',
  paddingLeft: 10,
  paddingRight: 10,
  outline: 'none',
  transition: 'border-color 200ms'
}, ({theme}) => ({
  border: `2px solid ${theme.gray.extraExtraLight}`,
  '&:focus': {
    borderColor: theme.gray.extraLight
  }
}))

class EditableCardSide extends React.Component {
  setSideContent = e => {
    if (this.props.value !== e.target.value) {
      this.props.onChange(e.target.value)
    }
  }
  getFontModifier = string => {
    const numBreaks = string.split(/\n/).length
    if(string.length > 200 || numBreaks > 5){
      return 'xs'
    }
    if(string.length > 150 || numBreaks > 3){
      return 'sm'
    }
    if(string.length > 100){
      return 'md'
    }
    return ''
  }
  setAltText = e => {
    const value = e.target.value;
    this.props.onAltTextChange(value)
  }
  render() {
    const {
      value,
      label,
      left,
      right,
      type,
      altText,
      onTypeChange,
      isFirst
    } = this.props
    return (
      <SideWrapper>
        <StyledTextArea
          value={value}
          onBlur={this.stopEditing}
          onChange={this.setSideContent}
          id={isFirst ? `tutorial-card-${label}-input` : ''}
          left={left}
          right={right}
          placeholder={type === 't' ? `Lorum ipsum delorum...` : `http://imageurl...`}
          fontModifier={this.getFontModifier(value)}
        />
        {label && <CardLabel>{`${label} ${type === 't' ? 'TEXT' : 'IMAGE URL'}`}</CardLabel>}
        {
          type === 'i' &&
          <AltTextWrapper>
            <CardLabel relative >Alt Text</CardLabel>
            <AltText
              type='text'
              value={altText}
              onChange={this.setAltText}
            />
          </AltTextWrapper>
        }
        <CardControlsWrapper id={isFirst && label === 'front' ? 'tutorial-card-controls' : ''}>
          <RoundButton
            active={type === 't'}
            onClick={()=>{
              if(type !== 't'){
                onTypeChange('t')
              }
            }}
          >
            Text
          </RoundButton>
          <RoundButton
            active={type === 'i'}
            onClick={()=>{
              if(type !== 'i'){
                onTypeChange('i')
              }
            }}
          >
            Image
          </RoundButton>
        </CardControlsWrapper>
      </SideWrapper>
    )
  }
}

const CardControlsWrapper = styled('div')({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'row',
  left: '2vw',
  bottom: '2vw'
}, ({ theme }) => ({
  [theme.media.sm]: {
    left: '3vw',
    bottom: '3vw',
  }
}))

const ButtonWrapper = styled('div')({
  // position: 'absolute',
  position: 'relative'
  // right: '2vw',
  // bottom: '2vw'
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
  left: 0,
  zIndex: 9
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
    Analytics.event({
      category: 'Editing',
      action: 'Changed a card color'
    });
  }
  render() {
    const { color, id } = this.props
    const selected = COLORS[color] || {}
    return (
      <React.Fragment>
        <ButtonWrapper>
          <ColorButton
            id={id}
            style={{
              background: selected.color
            }}
            onClick={this.openPicker}
            innerRef={r => {
              this.button = r
            }}
            aria-label="Toggle Color Picker"
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
