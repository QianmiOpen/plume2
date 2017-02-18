import { Store, IOptions } from 'plume2'
import TimerActor from './actor/timer-actor'

export default class AppStore extends Store {
  private timer;

  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      //debug
      (window as any)._store = this
    }
  }

  bindActor() {
    return [new TimerActor]
  }

  start = () => {
    this.timer = setInterval(() => this.dispatch('inc'), 1000)
  };

  reset = () => {
    clearTimeout(this.timer)
    this.dispatch('reset')
  }
}