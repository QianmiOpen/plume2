import { StoreProvider } from 'plume2';
import React from 'react';
import Like from './component/like';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LikeApp extends React.Component {
  render() {
    return <Like />;
  }
}
