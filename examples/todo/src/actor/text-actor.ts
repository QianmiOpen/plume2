import { Actor, Action, IMap } from 'plume2'

export default class TextActor extends Actor {
  defaultState() {
    return { value: '' }
  }

  @Action('change:text')
  changeText(state: IMap, text) {
    return state.set('value', text)
  }

  @Action('submit')
  submit(state: IMap) {
    return state.set('value', '')
  }

  @Action('init')
  init(state: IMap, { value }) {
    return state.set('value', value)
  }
}
