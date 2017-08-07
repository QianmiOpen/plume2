import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Relax } from 'plume2';
import { Loading, noop } from 'uikit';

@Relax
export default class Smile extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      count: number;
      increment: () => void;
    };
  };

  static relaxProps = {
    count: 'count',
    loading: 'loading',
    increment: noop
  };

  render() {
    const { count, loading, increment } = this.props.relaxProps;
    //如果是loading，显示loading
    if (loading) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text} onPress={increment}>
          {`你一抹微笑如茉莉:) 😁${count}`}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  } as TextStyle
});
