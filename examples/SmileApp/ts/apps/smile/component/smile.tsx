import { Relax, TViewAction } from 'plume2';
import React from 'react';
import { Loading } from 'uikit';
import * as viewAction from '../view-action';
import { Scene, Text } from './styled';

@Relax
export default class Smile extends React.Component {
  props: {
    relaxProps?: {
      loading: boolean;
      count: number;
      viewAction: TViewAction<typeof viewAction>;
    };
  };

  static relaxProps = {
    count: 'count',
    loading: 'loading',
    viewAction: 'viewAction'
  };

  render() {
    const { count, loading, viewAction } = this.props.relaxProps;
    //如果是loading，显示loading
    if (loading) {
      return <Loading />;
    }

    return (
      <Scene>
        <Text
          onPress={() => viewAction.SmileAction.increment}
        >{`你一抹微笑如茉莉:) 😁${count}`}</Text>
      </Scene>
    );
  }
}
