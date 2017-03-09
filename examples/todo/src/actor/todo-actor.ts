import { Actor, Action, IMap } from 'plume2'
import { fromJS } from 'immutable'

let uuid = 0;

export default class TodoActor extends Actor {
  defaultState() {
    return {
      todo: []
    }
  }

  @Action('submit')
  add(state: IMap, text: string) {
    return state.update('todo', todo => todo.push(fromJS({
      id: ++uuid,
      text,
      done: false
    })))
  }

  @Action('destroy')
  destroy(state: IMap, index: number) {
    return state.deleteIn(['todo', index])
  }

  @Action('toggle')
  toggle(state: IMap, index: number) {
    return state.updateIn(['todo', index, 'done'], done => !done)
  }

  @Action('toggleAll')
  toggleAll(state: IMap, checked: boolean) {
    return state.update('todo', todo => todo.map(item => item.set('done', checked)))
  }

  @Action('clearCompleted')
  clear(state: IMap) {
    return state.update('todo', todo => todo.filter(item => !item.get('done')))
  }

  @Action('init')
  init(state: IMap, { todo }) {
    return state.set('todo', fromJS(todo))
  }
}