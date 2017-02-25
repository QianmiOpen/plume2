import * as React from 'react'
import { Relax } from 'plume2'
const noop = () => { }

type Handler = () => void;

@Relax
export default class Counter extends React.Component<any, any> {
  props: {
    count?: number;
    increment?: Handler;
    decrement?: Handler;
  }

  static defaultProps = {
    count: 0,
    increment: noop,
    decrement: noop,
  };

  render() {
    const {count, increment, decrement} = this.props

    return (
      <div>
        <a href='javascript:;' onClick={decrement}>decrement</a>
        <span>{count}</span>
        <a href='javascript:;' onClick={increment}>increment</a>
      </div>
    )
  }
}