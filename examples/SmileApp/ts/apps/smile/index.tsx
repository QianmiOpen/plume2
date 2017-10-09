import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import Smile from './component/smile';
import * as m from './mutation';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SmileApp extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    m.onInit();
  }

  render() {
    return <Smile />;
  }
}
