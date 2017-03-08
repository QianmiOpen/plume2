import { Actor, Action, IMap } from 'plume2'

export default class CountActor extends Actor {
  defaultState() {
    return { count: 1 }
  }

  @Action('increment')
  change(state: IMap) {
    return state.update('count', count => count + 1)
  }

  @Action('init')
  init(state: IMap, count: number) {
    return state.set('count', count)
  }
}