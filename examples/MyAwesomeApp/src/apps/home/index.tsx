import { StoreProvider } from 'plume2';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Hello from './component/hello';
import Store from './store';

@StoreProvider(Store, { debug: __DEV__ })
export default class HomeApp extends React.Component {
  store: Store;
  componentDidMount() {
    this.store.viewAction.HomeViewAction.onInit();
  }
  render() {
    return (
      <View style={styles.container}>
        <Hello />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange'
  } as ViewStyle
});
