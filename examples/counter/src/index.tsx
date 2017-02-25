import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {StoreProvider} from 'plume2'
import AppStore from './store'
import Counter from './component/counter'

declare const __DEV__: boolean;

if(__DEV__) {
  require('preact/devtools')
}

@StoreProvider(AppStore, {debug: __DEV__})
class CounterApp extends React.Component<any, any> {
  render() {
    return <Counter/>
  }
}

ReactDOM.render(<CounterApp/>, document.getElementById('app'))
