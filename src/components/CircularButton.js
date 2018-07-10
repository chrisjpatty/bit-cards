import styled from 'react-emotion'

export default styled('button')({
  background: '#fff',
  borderRadius: '100%',
  width: 80,
  height: 80,
  transition: 'box-shadow 200ms, transform 200ms, color 200ms',
  cursor: 'pointer',
  transform: 'scale(.95)',
  padding: 10,
  border: 'none',
  fill: 'currentColor',
  outline: 'none',
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
  '&:hover': {
    transform: 'scale(1)',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  },
  '&:focus': {
    transform: 'scale(1)',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  }
}, ({theme}) => ({
  color: theme.gray.extraLight,
  '&:hover': {
    color: theme.gray.light
  },
  '&:focus': {
    color: theme.gray.light
  }
}))
