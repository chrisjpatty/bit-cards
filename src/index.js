import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import store from './store'
import { ThemeProvider } from 'emotion-theming'
import theme from './theme'
import ReactGA from 'react-ga';

ReactGA.initialize('UA-123980345-1');

export const Analytics = ReactGA;

export const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
