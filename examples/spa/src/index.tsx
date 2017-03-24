import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import AsyncRoute from './async-route'

if (__DEV__) {
  require('preact/devtools')
}

const SPA = () => (
  <Router history={createHistory()}>
    <div>
      <AsyncRoute exact path='/' load={() => System.import('./hello')} />
      <AsyncRoute path='/like' load={() => System.import('./like')} />
    </div>
  </Router>
);

ReactDOM.render(<SPA />, document.getElementById('app'))