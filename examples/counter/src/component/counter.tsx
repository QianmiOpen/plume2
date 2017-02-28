import * as React from 'react'
import { Relax, storePath, storeMethod } from 'plume2'
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
    count: storePath('count', 0),
    increment: storeMethod('increment', () => { }),
    decrement: storeMethod('decrement', () => { }),
  };

  render() {
    const { count, increment, decrement } = this.props

    return (
      <div>
        <a href='javascript:;' onClick={decrement}>decrement</a>
        <span>{count}</span>
        <a href='javascript:;' onClick={increment}>increment</a>
      </div>
    )
  }
}