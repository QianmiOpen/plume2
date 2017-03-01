import * as React from 'react'
import { Relax } from 'plume2'
const noop = () => { }

type Handler = () => void;

@Relax
export default class Timer extends React.Component<any, any> {
  props: {
    relaxProps?: {
      second: number;
      start: Handler;
      reset: Handler;
    }
  };

  static relaxProps = {
    second: 'second',
    start: noop,
    reset: noop,
  };

  render() {
    const { second, start, reset } = this.props.relaxProps

    return (
      <div>
        <a href={'javascript:;'} onClick={reset}>reset</a>
        <div>{second}</div>
        <a href={'javascript:;'} onClick={start}>start</a>
      </div>
    )
  }
}