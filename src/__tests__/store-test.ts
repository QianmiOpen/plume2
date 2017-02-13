import Store from '../store'
import Actor from '../actor'
import {Action} from '../decorator'
import {Map} from 'immutable'

type IMap = Map<string, any>;

class HelloActor extends Actor {
  defaultState() {
    return {name: 'plume'}
  }

  @Action('change')
  change(state: IMap) {
    return state.set('name', 'plume++')
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return {loading: false}
  }

  @Action('change')
  change(state: IMap) {
    return state.set('loading', true)
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new HelloActor,
      new LoadingActor
    ]
  }

  change = () => {
    this.dispatch('change')
  }
}

describe('store test suite', () => {
  it('default state', () => {
    const store = new AppStore({})

    //defautlState
    expect({
      loading: false,
      name: 'plume'
    }).toEqual(store.state().toJS())

    //actors
    expect(2).toEqual(store._actors.length)

    //actor'state
    const actorState = store._actorsState
    expect([{name: "plume"}, {loading: false}])
      .toEqual([actorState[0].toJS(), actorState[1].toJS()])
  })

  it('store dispatch', () => {
    const store = new AppStore({})
    store.change()

    const storeState = store.state()
    expect({loading: true, name: 'plume++'}).toEqual(storeState.toJS())

    const actorsState = store._actorsState
    expect([{name: 'plume++'}, {loading: true}])
      .toEqual([actorsState[0].toJS(), actorsState[1].toJS()])
  })

  it('store subscribe', () => {
    const store = new AppStore({})
    const _handleStoreChange = (state: IMap) => {
      expect({loading: true, name: 'plume++'})
        .toEqual(store.state())
    }
    
    store.subscribe(_handleStoreChange)
    expect(1).toEqual(store._callbacks.length)

    store.unsubscribe(_handleStoreChange)
    expect(0).toEqual(store._callbacks.length)
  })
})