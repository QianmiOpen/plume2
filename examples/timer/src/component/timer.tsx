import * as React from 'react'
import { Relax } from 'plume2'
const noop = () => { }

type Handler = () => void;

interface TProps {
  second?: number; //injected by store's second
  start?: Handler; //injected by store's start 
  reset?: Handler; //injected by store's reset
}

@Relax
export default class Timer extends React.Component<TProps, any> {
  static defaultProps = {
    second: 0,
    start: noop,
    reset: noop,
  };

  render() {
    const {second, start, reset} = this.props
    return (
      <div>
        <a href={'javascript:;'} onClick={reset}>reset</a>
        <div>{second}</div>
        <a href={'javascript:;'} onClick={start}>start</a>
      </div>
    )
  }
}