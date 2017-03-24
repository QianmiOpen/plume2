import React, { Component } from 'react'
import { StoreProvider } from 'plume2'
import AppStore from './store'
import Hello from './component/hello'

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component<any, any> {
  render() {
    return (
      <Hello />
    )
  }
}