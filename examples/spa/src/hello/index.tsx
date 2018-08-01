import { StoreProvider } from 'plume2';
import React from 'react';
import Hello from './component/hello';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component {
  render() {
    return <Hello />;
  }
}
