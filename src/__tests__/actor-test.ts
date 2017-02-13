import {Map} from 'immutable'
import Actor from '../actor'
import {Action} from '../decorator'

type IMap = Map<string, any>;

class HelloActor extends Actor {
  defaultState() {
    return {
      name: 'plume'
    }
  }

  @Action('change')
  change(state: IMap): IMap {
    return state.set('name', 'plume++')
  }
}

describe('actor test suite', () => {
  it('default state', () => {
    const helloActor = new HelloActor
    expect({name: 'plume'}).toEqual(helloActor.defaultState())
  })

  it('@Action method', () => {
    const helloActor = new HelloActor
    const state = Map({ name: 'plume'})
    const newState = helloActor.receive('change', state)
    expect({name: 'plume++'}).toEqual(newState.toJS())
  })
})