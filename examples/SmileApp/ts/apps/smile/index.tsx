import * as React from 'react'
import { StoreProvider } from 'plume2'
import AppStore from './store'
import Smile from './component/smile'

@StoreProvider(AppStore, { debug: true })
export default class SmileApp extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init()
  }

  render() {
    return (
      <Smile />
    )
  }
}
