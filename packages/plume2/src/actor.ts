/**
 * actor
 *
 * 借鉴MapReduce的理念，store负责分派，actor负责处理
 */
import { IMap, TRoute } from './typing';

export default class Actor {
  constructor() {
    this._route = this._route || {};
  }

  defaultState(): Object {
    return {};
  }

  private _route: TRoute;

  /**
   * 接收store分派的任务
   * @param msg
   * @param state
   * @param params
   */
  receive(msg: string, state: IMap, params?: any): IMap {
    const fn = this._route[msg];
    return fn ? fn.call(this, state, params) : state;
  }
}
