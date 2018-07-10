import { createStore, combineReducers } from 'redux'

const initialState = {
  value: {
    title: '',
    cards: [
      {
        front: '',
        back: '',
        color: 1
      }
    ]
  }
}

const AppReducer = (state=initialState, action) => {
  switch(action.type){
    case 'SET_VALUE':
      return {
        ...state,
        value: action.value
      }
    default:
      return state
  }
}

const store = createStore(
  combineReducers({
    app: AppReducer
  })
)

export default store;
