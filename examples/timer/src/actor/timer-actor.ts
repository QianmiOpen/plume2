import {Actor, Action, IMap} from 'plume2'

export default class TimerActor extends Actor {
  defaultState() {
    return {
      second: 0
    }
  }

  @Action('inc')
  increment(state: IMap) {
    return state.update('second', s => s + 1)
  }

  @Action('reset')
  reset(state: IMap) {
    return state.set('second', 0)
  }
}