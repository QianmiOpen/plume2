import { StoreProvider } from 'plume2';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './component/counter';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
class CounterApp extends React.Component {
  render() {
    return <Counter />;
  }
}

ReactDOM.render(<CounterApp />, document.getElementById('app'));
