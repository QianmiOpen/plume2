import * as React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

export default class Loading extends React.Component<any, any> {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          size={'large'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  } as React.ViewStyle
})