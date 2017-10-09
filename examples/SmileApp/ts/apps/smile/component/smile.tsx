import React from 'react';
import { Relax } from 'plume2';
import { Loading, noop } from 'uikit';
import { Scene, Text } from './styled';
import * as m from '../mutation';

@Relax
export default class Smile extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      count: number;
    };
  };

  static relaxProps = {
    count: 'count',
    loading: 'loading'
  };

  render() {
    const { count, loading } = this.props.relaxProps;
    //如果是loading，显示loading
    if (loading) {
      return <Loading />;
    }

    return (
      <Scene>
        <Text onPress={m.onIncrement}>{`你一抹微笑如茉莉:) 😁${count}`}</Text>
      </Scene>
    );
  }
}
