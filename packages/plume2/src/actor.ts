import { IMap, TRoute } from './typing';

/**
 * actor
 *
 * 借鉴MapReduce的理念，store负责分派，actor负责处理
 */
export default class Actor {
  constructor() {
    this._route = this._route || {};
  }

  private _route: TRoute;

  defaultState(): Object {
    return {};
  }

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
