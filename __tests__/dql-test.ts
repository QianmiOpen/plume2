import { Actor, Store, QL } from "../src/index";
import { DynamicQueryLang, QueryLang } from "../src/ql";

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
  it('todoDQL', () => {
    const store = new AppStore()

    //ql
    const loadingQL = QL('loadingQL', [
      'loading',
      (loading) => loading
    ])

    //dql    
    const todoDQL = QL('todoDQL', [
      loadingQL,
      ['todo', '$index', 'text'],
      (loading, text) => ({
        loading, text
      })
    ])

    const lang = (todoDQL as DynamicQueryLang)
      .withContext({ index: 0 })
      .analyserLang(todoDQL.lang())
    const todoQL = new QueryLang('todoQL', lang)

    expect(todoQL.lang()[1])
      .toEqual(['todo', 0, 'text'])
    expect(store.bigQuery(todoQL))
      .toEqual({ loading: false, text: 'hello plume' })

  })

  it('dql nested dql', () => {
    const store = new AppStore()

    const loadingDQL = QL('loadingDQL', [
      '$loading',
      (loading) => loading
    ])

    const todoDQL = QL('todoDQL', [
      loadingDQL,
      ['todo', '$index', 'text'],
      (loading, text) => ({ loading, text })
    ])

    const lang = (todoDQL as DynamicQueryLang)
      .withContext({ index: 0, loading: 'loading' })
      .analyserLang(todoDQL.lang())
    const todoQL = new QueryLang('todoDQL', lang)

    expect(todoQL.lang()[1])
      .toEqual(['todo', 0, 'text'])
    expect(store.bigQuery(todoQL))
      .toEqual({ loading: false, text: 'hello plume' })
  })
})