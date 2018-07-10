import React, { Component } from 'react'
import { decode } from './utilities'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Route } from 'react-router-dom'
import Edit from './pages/Edit'
import Play from './pages/Play'
import Header from './components/Header'
import 'normalize.css'
import './App.css';

class App extends Component {
  componentDidMount = () => {
    decode(this.props.location.search.slice(1)).then(value => {
      const validShape = value.hasOwnProperty('cards') && value.hasOwnProperty('title')
      if(validShape){
        this.props.dispatch({
          type: 'SET_VALUE',
          value
        })
      }
    })
    .catch(err => {
      this.props.history.push(this.props.location.pathname)
    })
  }
  render() {
    return (
      <div className="App">
        <Header />
        <Route component={Edit} path="/edit" />
        <Route component={Play} path="/play" />
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    (_, props) => ({
      location: props.location
    })
  )
)(App)
