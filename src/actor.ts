import { IMap, TRoute } from './typing';

export default class Actor {
  private _route: TRoute;

  defaultState(): Object {
    return {};
  }

  receive(msg: string, state: IMap, params?: any): IMap {
    this._route = this._route || {};
    const fn = this._route[msg];
    return fn ? fn.call(this, state, params) : state;
  }
}
