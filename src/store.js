import { createStore, combineReducers } from 'redux'
import detectIt from 'detect-it'

const initialState = {
  value: {
    title: '',
    clr: true,
    sds: 2,
    cards: [
      {
        ftype: 't',
        btype: 't',
        falt: '',
        balt: '',
        front: '',
        back: '',
        color: 1
      }
    ]
  },
  cache: {
    title: '',
    clr: true,
    sds: 2,
    cards: [
      {
        ftype: 't',
        btype: 't',
        falt: '',
        balt: '',
        front: '',
        back: '',
        color: 1
      }
    ]
  },
  deletedCard: null,
  historyIndex: 0,
  hasTouch: detectIt.hasTouch,
  primaryInput: detectIt.primaryInput
}

const AppReducer = (state=initialState, action) => {
  switch(action.type){
    case 'RESET_STATE': 
      return {...initialState}
    case 'SET_VALUE':
      return {
        ...state,
        value: action.value,
        cache: action.cache ? action.cache : state.cache,
        ...(action.payload || {})
      }
    case 'CLEAR_DELETED_CARD':
      return { ...state, deletedCard: null }
    case 'INCREMENT_HISTORY_INDEX':
      return {...state, historyIndex: state.historyIndex + 1}
    case 'SET_HISTORY_INDEX':
      return {...state, historyIndex: state.historyIndex}
    default:
      return state
  }
}

const store = createStore(
  combineReducers({
    app: AppReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;
