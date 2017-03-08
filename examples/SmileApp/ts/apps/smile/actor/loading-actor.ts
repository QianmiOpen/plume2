import { Actor, Action, IMap } from 'plume2'

export default class LoadingActor extends Actor {
  defaultState() {
    return { loading: true }
  }

  @Action('loading:end')
  loadingEnd(state: IMap) {
    return state.set('loading', false)
  }
}
