import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StoreProvider } from 'plume2'
import AppStore from './store'
import Timer from './component/timer'

if (__DEV__) {
  require('preact/devtools')
}

@StoreProvider(AppStore, { debug: __DEV__ })
export default class TimerApp extends React.Component<any, any> {
  render() {
    return <Timer />
  }
}

ReactDOM.render(<TimerApp />, document.getElementById('app'))

