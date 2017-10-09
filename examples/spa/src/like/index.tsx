import * as React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import Like from './component/like';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LikeApp extends React.Component<any, any> {
  render() {
    return <Like />;
  }
}
