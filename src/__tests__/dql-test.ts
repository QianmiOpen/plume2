import {QL} from '../ql'
import {DQL} from '../dql'
import Actor from '../actor'
import Store from '../store'

class LoadingActor extends Actor {
  defaultState() {
    return {loading: false}
  }
}


class TodoActor extends Actor {
  defaultState() {
    return {todo: [
      {id: 1, text: 'hello plume', done: false}
    ]}
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor,
      new TodoActor
    ]
  }
}

describe('dql test suite', () => {
  it('init dql', () => {
    const store = new AppStore({})
    const loadingQL = QL('loadingQL', [
      'loading',
      (loading) => loading
    ])

    const todoDQL = DQL('todoDQL', [
      loadingQL,
      ['todo', '$index', 'text'],
      (loading, text) => ({
        loading, text
      })
    ])

    const todoQL = todoDQL.withContext({index: 0}).ql()
    expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1])
    expect({loading: false, text: 'hello plume'}).toEqual(store.bigQuery(todoQL))
  })
})