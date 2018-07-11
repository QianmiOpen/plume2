import { Relax } from 'plume2';
import React from 'react';
import { TCounterViewAction } from '../typings';

@Relax
export default class Counter extends React.Component {
  props: {
    relaxProps?: {
      count: number;
      viewAction: TCounterViewAction;
    };
  };

  static relaxProps = {
    count: 'count',
    viewAction: 'viewAction'
  };

  render() {
    const { count, viewAction } = this.props.relaxProps;

    return (
      <div>
        <a href="javascript:;" onClick={viewAction.CounterViewAction.decrement}>
          decrement
        </a>
        <span>{count}</span>
        <a href="javascript:;" onClick={viewAction.CounterViewAction.increment}>
          increment
        </a>
      </div>
    );
  }
}
