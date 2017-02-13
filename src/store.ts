import {Map, fromJS} from 'immutable'
import Actor from './actor'

type IMap = Map<string, any>;

export default class Store {
  _actors: Array<Actor>;
  _state: IMap;
  _actorsState: Array<IMap>;

  constructor(props) {
    this._state = fromJS({})
    this._actorsState = []
    this._actors = this.bindActor()
    this.reduceActor()
  }

  bindActor(): Array<Actor> {
    return []
  }

  reduceActor() {
    this._state = this._state.withMutations(state => {
      for (let actor of this._actors) {
        let initState = fromJS(actor.defaultState())
        this._actorsState.push(initState)
        state = state.merge(initState)
      }
      return state
    })
  }

  state() {
    return this._state
  }
}