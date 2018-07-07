import { createStore, combineReducers } from 'redux'

const initialState = {

}

const AppReducer = (state=initialState, action) => {
  switch(action.type){
    case 'TYPE':
      return state
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
