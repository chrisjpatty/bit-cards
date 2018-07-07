import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Edit from './pages/Edit'
import Header from './components/Header'
import 'normalize.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Route component={Edit} path="/edit" />
      </div>
    );
  }
}

export default App;
