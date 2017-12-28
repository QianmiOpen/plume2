import React from 'react';
import { Relax } from 'plume2';
import actionType from '../action-type';
import actionCreator from '../action-creator';

@Relax
export default class Counter extends React.Component {
  props: {
    relaxProps?: {
      count: number;
    };
  };

  static relaxProps = {
    count: 'count'
  };

  render() {
    const { count } = this.props.relaxProps;

    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => actionCreator.fire(actionType.INCREMENT)}
        >
          decrement
        </a>
        <span>{count}</span>
        <a
          href="javascript:;"
          onClick={() => actionCreator.fire(actionType.DECREMENT)}
        >
          increment
        </a>
      </div>
    );
  }
}
