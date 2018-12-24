import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default class Loading extends React.Component {
  render() {
    return (
      <View>
        <ActivityIndicator size="large" animating />
      </View>
    );
  }
}
