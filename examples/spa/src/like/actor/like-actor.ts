import { Actor, Action, IMap } from 'plume2'

export default class LikeActor extends Actor {
  defaultState() {
    return { like: 0 }
  }

  @Action('inc')
  inc(state: IMap) {
    return state.update('like', like => like + 1)
  }
}
