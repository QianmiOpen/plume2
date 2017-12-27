import React from 'react';
import { Relax } from 'plume2';
const noop = () => {};

type Handler = () => void;

@Relax
export default class Counter extends React.Component {
  props: {
    relaxProps?: {
      count: number;
      increment: Handler;
      decrement: Handler;
    };
  };

  static relaxProps = {
    count: 'count',
    increment: noop,
    decrement: noop
  };

  render() {
    const { count, increment, decrement } = this.props.relaxProps;

    return (
      <div>
        <a href="javascript:;" onClick={decrement}>
          decrement
        </a>
        <span>{count}</span>
        <a href="javascript:;" onClick={increment}>
          increment
        </a>
      </div>
    );
  }
}
