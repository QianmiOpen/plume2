import { QL, QueryLang, DynamicQueryLang } from '../ql'
import Actor from '../actor'
import Store from '../store'

class LoadingActor extends Actor {
  defaultState() {
    return { loading: false }
  }
}


class TodoActor extends Actor {
  defaultState() {
    return {
      todo: [
        { id: 1, text: 'hello plume', done: false }
      ]
    }
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

    const todoDQL = QL('todoDQL', [
      loadingQL,
      ['todo', '$index', 'text'],
      (loading, text) => ({
        loading, text
      })
    ])

    const lang = (todoDQL as DynamicQueryLang).withContext({ index: 0 }).analyserLang(todoDQL.lang())
    const todoQL = new QueryLang('todoQL', lang)
    expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1])
    expect({ loading: false, text: 'hello plume' }).toEqual(store.bigQuery(todoQL))
  })

  it('dql nested dql', () => {
    const store = new AppStore({})
    const loadingDQL = QL('loadingDQL', [
      '$loading',
      (loading) => loading
    ])

    const todoDQL = QL('todoDQL', [
      loadingDQL,
      ['todo', '$index', 'text'],
      (loading, text) => ({ loading, text })
    ])

    const lang = (todoDQL as DynamicQueryLang).withContext({ index: 0, loading: 'loading' }).analyserLang(todoDQL.lang())
    const todoQL = new QueryLang('todoDQL', lang)
    expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1])
    expect({ loading: false, text: 'hello plume' }).toEqual(store.bigQuery(todoQL))
  })
})