import { createStore, combineReducers } from 'redux'

const initialState = {
  value: {
    title: '',
    clr: true,
    sds: 2,
    cards: [
      {
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
        front: '',
        back: '',
        color: 1
      }
    ]
  },
  deletedCard: null
}

const AppReducer = (state=initialState, action) => {
  switch(action.type){
    case 'SET_VALUE':
      return {
        ...state,
        value: action.value,
        cache: action.cache ? action.cache : state.cache,
        ...(action.payload || {})
      }
    case 'CLEAR_DELETED_CARD':
      return { ...state, deletedCard: null }
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
