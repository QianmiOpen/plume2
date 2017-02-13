import {Map} from 'immutable'

type IMap = Map<string, any>;
type Route = {
  [name: string]: (state: IMap, params?: any) => IMap;
}

export default class Actor {
  _route: Route;

  defaultState(): Object {
    return {}
  }

  receive(msg: string, state: IMap, params?: any): IMap {
    const action = this._route[msg]
    return action ? action.call(this, state, params) : state
  }
}