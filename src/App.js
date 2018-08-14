import React, { Component } from 'react'
import { decode } from './utilities'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { Route } from 'react-router-dom'
import Edit from './pages/Edit'
import Play from './pages/Play'
import About from './pages/About'
import Examples from './pages/Examples'
import Header from './components/Header'
import Helmet from 'react-helmet'
import { cardTemplate } from './pages/Edit'
import 'normalize.css'
import './App.css';

class App extends Component {
  componentDidMount = () => {
    this.getStateFromHash()
    window.addEventListener('popstate', this.handlePopState)
  }
  runningWorker = null;
  getStateFromHash = () => {
    if (this.runningWorker && this.runningWorker.cancel) {
      this.runningWorker.cancel()
    }
    this.runningWorker = decode(this.props.location.hash.slice(1)).then(value => {
      this.runningWorker = null;
      const validShape = value.hasOwnProperty('cards') && value.hasOwnProperty('title')
      value = {
        ...value,
        cards: value.cards.map(card => ({
          ...cardTemplate,
          ...card,
          id: Math.random().toString(36).substring(2, 15)
        }))
      }
      if(validShape){
        this.props.dispatch({
          type: 'SET_VALUE',
          value,
          cache: value
        })
      }
    })
    .catch(err => {
      this.props.history.push(this.props.location.pathname)
    })
  }
  componentWillUnmount = () => {
    window.removeEventListenter('popstate', this.handlePopState)
  }
  handlePopState = e => {
    const state = (e.state || {}).state || {};
    const currentIndex = state.index || null;
    const prevIndex = this.props.historyIndex;
    if(currentIndex !== null){
      this.props.dispatch({
        type: 'SET_HISTORY_INDEX',
        historyIndex: currentIndex
      })
      if(currentIndex !== prevIndex){
        this.getStateFromHash()
      }
    }
  }
  render() {
    return (
      <div className="App">
        <Helmet>
          <meta name="theme-color" content="#ed5555" />
        </Helmet>
        <Header location={this.props.location} />
        <Route render={({location}) => (
          <Redirect to={{
            pathname: '/edit',
            hash: location.hash
          }}/>
        )} path='/' exact/>
        <Route component={Edit} path="/edit" />
        <Route component={Play} path="/play" />
        <Route component={Examples} path="/examples" />
        <Route component={About} path="/about"/>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    (state, props) => ({
      location: props.location,
      historyIndex: state.app.historyIndex
    })
  )
)(App)
