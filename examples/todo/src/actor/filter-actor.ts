import { Actor, Action, IMap } from 'plume2'

export default class FilterActor extends Actor {
  defaultState() {
    return { filterStatus: '' }
  }

  @Action('change:filter')
  changeFilter(state: IMap, text: string) {
    return state.set('filterStatus', text)
  }
}