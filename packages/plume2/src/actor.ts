/**
 * actor
 *
 * 借鉴MapReduce的理念，store负责分派，actor负责处理
 */
import { IMap, TRoute } from './typing';

export default class Actor {
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
    this._route = this._route || {};
    const fn = this._route[msg];
    return fn ? fn.call(this, state, params) : state;
  }
}
