import {QL} from '../ql'
import Store from '../store'
import Actor from '../actor'

class LoadingActor extends Actor {
  defaultState() {
    return {loading: true}
  }
}

class TodoActor extends Actor {
  defaultState() {
    return {todo: [{id: 1, text: 'hello plume', done: false}]}
  }
}

class AppStore extends Store {
  bindActor() {
    return [new LoadingActor, new TodoActor]
  }
}

describe('ql test suite', () => {
  it('ql init', () => {
    const helloQL = QL('helloQL', [
      'loading',
      (loading) => loading
    ])

    expect(1).toEqual(helloQL.id())
    expect('helloQL').toEqual(helloQL.name())
    expect(helloQL.lang()).toMatchSnapshot()
  })

  it('test bigQuery', () =>{
    const todoQL = QL('todoQL', [
      'loading',
      ['todo', 0, 'text'],
      (loading, text) => ({
        loading,
        text
      })
    ])

    const store = new AppStore({})
    const todo = store.bigQuery(todoQL)

    expect({
      loading: true,
      text: 'hello plume'
    }).toEqual(todo)
  })

  it('test complex bigQuery', () => {
    const loadingQL = QL('loadingQL', [
      'loading',
      (loading) => loading
    ])

    const todoQL = QL('todoQL', [
      loadingQL,
      ['todo', 0, 'text'],
      (loading, text) => ({
        loading,
        text
      })
    ]) 

    const store = new AppStore({})
    const loading = store.bigQuery(loadingQL)
    expect(true).toEqual(loading)

    const todo = store.bigQuery(todoQL)
    expect({loading: true, text: 'hello plume'})
      .toEqual(todo)

    //from cache
    const todoCache = store.bigQuery(todoQL)
    expect({loading: true, text: 'hello plume'})
      .toEqual(todoCache)
  })
})