import { Map } from 'immutable'
import { Actor, Action, Store } from "../src/index";

type IMap = Map<string, any>;

class HelloActor extends Actor {
  defaultState() {
    return { name: 'plume' }
  }

  @Action('change')
  change(state: IMap) {
    return state.set('name', 'plume++')
  }

  @Action('changeText')
  changeTexst(state: IMap, text) {
    return state.set('name', text)
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return { loading: false }
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

  changeTransation() {
    this.transaction(() => {
      this.dispatch('changeText', 'iflux2')
      this.dispatch('changeText', 'plume')
      this.dispatch('changeText', 'plume2')
    })
  }
}

describe('store test suite', () => {
  it('default state', () => {
    const store = new AppStore()

    //defautlState
    expect(store.state().toJS()).toEqual({
      loading: false,
      name: 'plume'
    })

    //actors
    expect(store._actors.length).toEqual(2)

    //actor'state
    const actorState = store._actorsState
    expect([actorState[0].toJS(), actorState[1].toJS()])
      .toEqual([{ name: "plume" }, { loading: false }])
  })

  it('store dispatch', () => {
    const store = new AppStore({ debug: false })
    store.change()

    const storeState = store.state()
    expect(storeState.toJS()).toEqual({ loading: true, name: 'plume++' })

    const actorsState = store._actorsState
    expect([actorsState[0].toJS(), actorsState[1].toJS()])
      .toEqual([{ name: 'plume++' }, { loading: true }])
  })

  it('store transation disptch', () => {
    const store = new AppStore()
    store.changeTransation()
    store.subscribe(state => {
      expect(state.toJS()).toEqual({
        loading: false,
        name: 'plume2'
      })
    })
  })

  it('store subscribe', () => {
    const store = new AppStore({})
    const _handleStoreChange = (state: IMap) => {
      expect(store.state())
        .toEqual({ loading: true, name: 'plume++' })
    }

    store.subscribe(_handleStoreChange)
    expect(store._callbacks.length).toEqual(1)

    store.unsubscribe(_handleStoreChange)
    expect(store._callbacks.length).toEqual(0)
  })
})