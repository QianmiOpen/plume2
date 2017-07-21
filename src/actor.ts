import { Map } from 'immutable';

export type IMap = Map<string, any>;
export type Route = {
  [name: string]: (state: IMap, params?: any) => IMap;
};

export default class Actor {
  _route: Route;

  defaultState(): Object {
    return {};
  }

  receive(msg: string, state: IMap, params?: any): IMap {
    this._route = this._route || {};
    const fn = this._route[msg];
    return fn ? fn.call(this, state, params) : state;
  }
}
