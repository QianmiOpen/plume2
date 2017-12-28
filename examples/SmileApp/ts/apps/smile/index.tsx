import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import Smile from './component/smile';
import actionType from './action-type';
import actionCreator from './action-creator';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SmileApp extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    actionCreator.fire(actionType.INIT);
  }

  render() {
    return <Smile />;
  }
}
