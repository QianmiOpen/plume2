import Store from '../store'
import Actor from '../actor'

class HelloActor extends Actor {
  defaultState() {
    return {name: 'plume'}
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return {loading: false}
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new HelloActor,
      new LoadingActor
    ]
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


})