import { Store, QL, Actor, Action } from '../index'
import { QueryLang } from '../ql'
import { Map, fromJS } from 'immutable'

type TMap = Map<string, any>

let uuid = 0

class TodoActor extends Actor {
  defaultState() {
    return {
      filter: '',
      todo: [

      ]
    }
  }

  @Action('add')
  add(state: TMap, text: string) {
    return state.update('todo', todo => todo.push(fromJS({
      id: ++uuid,
      text,
      done: false
    })))
  }
}

class AppStore extends Store {
  bindActor() {
    return [new TodoActor]
  }

  add = (text: string) => {
    this.dispatch('add', text)
  }
}

const todoQL = QL('todoQL', [
  'todo',
  'filter',
  (todo, filter) => todo
])

const countQL = QL('countQL', [
  todoQL,
  todo => todo.count()
])

describe('bigquery test suite', () => {
  it('initial state', () => {
    const store = new AppStore({ debug: true })
    let count = store.bigQuery(countQL as QueryLang)
    expect(count).toEqual(0)

    store.add('hello')
    count = store.bigQuery(countQL as QueryLang)
    expect(count).toEqual(1)
  })
})