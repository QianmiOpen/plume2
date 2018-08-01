import { StoreProvider } from 'plume2';
import React from 'react';
import Smile from './component/smile';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SmileApp extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.viewAction.SmileAction.init();
  }

  render() {
    return <Smile />;
  }
}
