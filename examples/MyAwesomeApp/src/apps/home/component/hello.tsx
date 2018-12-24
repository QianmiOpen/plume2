import { Relax } from 'plume2';
import React from 'react';
import { Text } from 'react-native';
import { Loading } from 'uikit';
import { THomeViewAction } from '../types';

@Relax
export default class Hello extends React.Component {
  props: {
    relaxProps?: {
      loading: boolean;
      count: number;
      viewAction: THomeViewAction;
    };
  };

  static relaxProps = ['loading', 'count', 'viewAction'];

  render() {
    const { loading, count, viewAction } = this.props.relaxProps;
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Text
          onPress={viewAction.HomeViewAction.onIncCount}
        >{`你一抹微笑如茉莉:) 😁${count}`}</Text>
      );
    }
  }
}
